require('dotenv').config();
const db = require('./config/db');

async function test() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    console.log("Testing Orders insert...");
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, payment_status, order_status, delivery_method, shipping_address, delivery_fee, discount, customization_notes, customization_choices) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [1, 1400, 'pending', 'processing', 'local', JSON.stringify({ pincode: 533437 }), 50, 0, 'none', JSON.stringify({})]
    );
    const orderId = orderRes.rows[0].id;
    console.log("Order Inserted:", orderId);

    console.log("Testing Order Items insert...");
    await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_type, weight, product_name, customization_choices) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [orderId, 1, 1, 1350, 'fresh', '500g', 'Red Velvet Cake', JSON.stringify({})]
    );
    console.log("Order Item Inserted");

    console.log("Testing local_deliveries insert...");
    await client.query(`INSERT INTO local_deliveries (order_id, delivery_status) VALUES ($1, $2)`, [orderId, 'pending']);
    console.log("Local Delivery Inserted");

    console.log("Testing payments insert...");
    await client.query(
        `INSERT INTO payments (order_id, gateway, payment_status, amount) VALUES ($1, $2, $3, $4)`,
        [orderId, 'razorpay', 'pending', 1400]
    );
    console.log("Payment Inserted");

    await client.query('ROLLBACK');
    console.log("SUCCESSFULLY TESTED");
  } catch(e) {
    await client.query('ROLLBACK');
    console.error("TEST FAILED:", e.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

test().catch(console.error);
