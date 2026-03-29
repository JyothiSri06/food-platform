const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Initiate Razorpay Order
 */
exports.createPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_ID.includes('your_key_id') || 
        process.env.RAZORPAY_KEY_SECRET.includes('your_razorpay_key_secret') ||
        process.env.RAZORPAY_KEY_ID.toLowerCase().includes('mock')) {
      
      const mockOrderId = `mock_order_${Date.now()}`;
      await db.query(
        "UPDATE payments SET razorpay_order_id = $1, gateway = 'mock' WHERE order_id = $2",
        [mockOrderId, orderId]
      );

      return res.json({
        success: true,
        isMock: true,
        order_id: mockOrderId,
        amount: Math.round(Number(amount) * 100),
        key_id: 'mock_key'
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${orderId}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Update the payment record with the Razorpay Order ID
    await db.query(
      "UPDATE payments SET razorpay_order_id = $1, gateway = 'razorpay' WHERE order_id = $2",
      [order.id, orderId]
    );
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('RAZORPAY_CREATE_ERROR:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

/**
 * Verify Razorpay Signature
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // SECURITY: Extract orderId from merchant context if possible, 
      // but here we rely on the client's provided razorpay_order_id linked previously.
      // In a more robust setup, we'd use a lookup table or metadata.
      
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        // Find the order associated with this Razorpay Order ID
        // Note: We should ideally have stored razorpay_order_id in our payments table
        const paymentRes = await client.query(
          "UPDATE payments SET payment_status = 'success', transaction_id = $1 WHERE razorpay_order_id = $2 RETURNING order_id",
          [razorpay_payment_id, razorpay_order_id]
        );

        if (paymentRes.rows.length > 0) {
          const orderId = paymentRes.rows[0].order_id;
          await client.query(
            "UPDATE orders SET payment_status = 'paid' WHERE id = $1",
            [orderId]
          );
        }

        await client.query('COMMIT');
        return res.json({ success: true, message: 'Payment Verified and Order Updated' });
      } catch (dbError) {
        await client.query('ROLLBACK');
        console.error('PAYMENT_DB_UPDATE_ERROR:', dbError);
        return res.status(500).json({ error: 'Payment verified but failed to update order status. Please contact support.' });
      } finally {
        client.release();
      }
    } else {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('RAZORPAY_VERIFY_ERROR:', error);
    res.status(500).json({ error: 'Server error during payment verification' });
  }
};
