const db = require('../config/db');

// @desc    Assign delivery partner to an order
// @route   POST /api/delivery/assign
// @access  Private/Admin
exports.assignDelivery = async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;

    const orderRes = await db.query("SELECT * FROM orders WHERE id = $1 AND delivery_method = 'local'", [orderId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Local delivery order not found' });
    }

    // Insert or get delivery partner id
    let dpRes = await db.query("SELECT id FROM delivery_partners WHERE user_id = $1", [partnerId]);
    if (dpRes.rows.length === 0) {
      dpRes = await db.query("INSERT INTO delivery_partners (user_id, status) VALUES ($1, 'available') RETURNING id", [partnerId]);
    }
    const dpId = dpRes.rows[0].id;

    // Assign
    const result = await db.query(
      "UPDATE local_deliveries SET delivery_partner_id = $1, delivery_status = 'assigned', assigned_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *",
      [dpId, orderId]
    );

    res.json({
      success: true,
      message: 'Delivery assigned',
      delivery: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error assigning delivery' });
  }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/status
// @access  Private/Partner
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const result = await db.query(
      "UPDATE local_deliveries SET delivery_status = $1 WHERE order_id = $2 RETURNING *",
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery assignment not found' });
    }

    if (status === 'delivered') {
      await db.query("UPDATE orders SET order_status = 'delivered' WHERE id = $1", [orderId]);
      await db.query("UPDATE local_deliveries SET delivered_at = CURRENT_TIMESTAMP WHERE order_id = $1", [orderId]);
    }

    res.json({
      success: true,
      delivery: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// @desc    Get all delivery partners
// @route   GET /api/delivery/partners
// @access  Private/Admin
exports.getDeliveryPartners = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id as user_id, 
        u.name, 
        u.email, 
        u.phone,
        dp.id as partner_id,
        dp.status
      FROM users u
      LEFT JOIN delivery_partners dp ON u.id = dp.user_id
      WHERE u.role = 'partner'
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching delivery partners' });
  }
};
