const db = require('../config/db');
const axios = require('axios');

let shiprocketToken = null;
let tokenExpiry = null;

/**
 * Authenticate with Shiprocket
 */
const getShiprocketToken = async () => {
    if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
        return shiprocketToken;
    }

    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        });

        shiprocketToken = response.data.token;
        // Tokens usually valid for 10 days, let's refresh every 9 days
        tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
        return shiprocketToken;
    } catch (error) {
        console.error('SHIPROCKET_AUTH_ERROR:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Shiprocket');
    }
};

/**
 * Create Shiprocket Shipment
 */
exports.createShipment = async (req, res) => {
  try {
    const { orderId, length, breadth, height, weight } = req.body;

    const token = await getShiprocketToken();
    
    // Fetch order and user details
    const orderRes = await db.query(`
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = $1
    `, [orderId]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];
    const shippingAddress = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address) 
        : order.shipping_address;

    // Shiprocket Adhoc Order payload
    const srOrderData = {
        order_id: order.id,
        order_date: new Date(order.created_at).toISOString().split('T')[0],
        pickup_location: "Primary", // Must be configured in Shiprocket Panel
        billing_customer_name: order.user_name,
        billing_last_name: "",
        billing_address: shippingAddress.address,
        billing_address_2: shippingAddress.landmark || "",
        billing_city: shippingAddress.city,
        billing_pincode: shippingAddress.pincode,
        billing_state: shippingAddress.state || "Telangana",
        billing_country: "India",
        billing_email: order.user_email,
        billing_phone: order.user_phone,
        shipping_is_billing: true,
        order_items: [
            {
                name: "Jeji Vantalu Items",
                sku: "JV_VARIOUS",
                units: 1,
                selling_price: order.total_amount
            }
        ],
        payment_method: order.payment_status === 'paid' ? "Prepaid" : "COD",
        sub_total: order.total_amount,
        length: length || 10,
        breadth: breadth || 10,
        height: height || 10,
        weight: weight || 0.5
    };

    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', srOrderData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const { order_id: sr_order_id, shipment_id: sr_shipment_id } = response.data;

    // Update shipment table
    const result = await db.query(
      `UPDATE shipments 
       SET shiprocket_order_id = $1, shiprocket_shipment_id = $2, shipping_status = $3
       WHERE order_id = $4 RETURNING *`,
      [sr_order_id, sr_shipment_id, 'processed', orderId]
    );

    // Update order status
    await db.query("UPDATE orders SET order_status = 'shipped' WHERE id = $1", [orderId]);

    res.json({
      success: true,
      message: 'Shiprocket Order Created',
      shipment: result.rows[0],
      shiprocket_response: response.data
    });
  } catch (error) {
    console.error('SHIPROCKET_CREATE_ERROR:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create Shiprocket shipment', details: error.response?.data });
  }
};

/**
 * Track Shiprocket Shipment
 */
exports.trackShipment = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const token = await getShiprocketToken();

    const shipmentRes = await db.query('SELECT shiprocket_shipment_id FROM shipments WHERE order_id = $1', [id]);
    if (shipmentRes.rows.length === 0 || !shipmentRes.rows[0].shiprocket_shipment_id) {
      return res.status(404).json({ message: 'Shipment not found for this order' });
    }

    const shipmentId = shipmentRes.rows[0].shiprocket_shipment_id;

    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    res.json({
      success: true,
      tracking_data: response.data[shipmentId]?.tracking_data,
    });
  } catch (error) {
    console.error('SHIPROCKET_TRACK_ERROR:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error tracking shipment' });
  }
};
