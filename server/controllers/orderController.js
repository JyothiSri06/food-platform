const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalAmount: clientTotal, paymentMethod, deliveryFee: clientDeliveryFee, discount: clientDiscount, customization_notes, customization_choices } = req.body;
  const totalAmount = Number(clientTotal);
  const deliveryFee = Number(clientDeliveryFee) || 0;
  const discount = Number(clientDiscount) || 0;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Server-side price recalculation and validation
  let calculatedSubtotal = 0;
  try {
    const itemIds = orderItems.map(item => item.product_id);
    const productsRes = await db.query('SELECT id, price, price_250g, price_500g, price_1kg, discount_percentage FROM products WHERE id = ANY($1)', [itemIds]);
    const productsMap = productsRes.rows.reduce((map, p) => { map[p.id] = p; return map; }, {});

    for (const item of orderItems) {
      const product = productsMap[item.product_id];
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }

      const basePrice = Number(product.price) || 0;
      const p250 = Number(product.price_250g);
      const p500 = Number(product.price_500g);
      const p1kg = Number(product.price_1kg);

      let unitPrice = basePrice;
      if (item.weight === '250g') {
        unitPrice = p250 || basePrice;
      } else if (item.weight === '500g') {
        unitPrice = (p500 && p500 !== basePrice) ? p500 : Math.round(basePrice * 1.8);
      } else if (item.weight === '1kg') {
        unitPrice = (p1kg && p1kg !== basePrice) ? p1kg : Math.round(basePrice * 3.5);
      }

      // Apply product-level discount if any
      const discountPct = Number(product.discount_percentage) || 0;
      if (discountPct > 0) {
        unitPrice = Math.round(unitPrice * (1 - discountPct / 100));
      }

      calculatedSubtotal += unitPrice * item.quantity;
      item.price = unitPrice;
    }

    const calculatedTotal = calculatedSubtotal + (deliveryFee || 0) - (discount || 0);
    
    if (Math.abs(calculatedTotal - totalAmount) > 1) {
      return res.status(400).json({ 
        message: 'Order total mismatch. Prices may have changed.',
        detail: `Expected ₹${calculatedTotal}, but received ₹${totalAmount}. Please refresh your cart.`,
        serverCalculated: calculatedTotal,
        clientProvided: totalAmount
      });
    }

    const hasFreshItems = orderItems.some(item => item.product_type === 'fresh');
    const delivery_method = hasFreshItems ? 'local' : 'courier';
    
    if (hasFreshItems) {
      const shippingAddr = shippingAddress || {};
      const postalCode = (shippingAddr.pincode || shippingAddr.postalCode || '').toString().trim();
      const areaCheck = await db.query('SELECT 1 FROM delivery_areas WHERE pincode = $1', [postalCode]);
      if (areaCheck.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'One or more items are only available for local delivery. Please enter a supported local postal code.' 
        });
      }
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const orderRes = await client.query(
        `INSERT INTO orders (user_id, total_amount, payment_status, order_status, delivery_method, shipping_address, delivery_fee, discount, customization_notes, customization_choices) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [req.user.id, totalAmount, 'pending', 'processing', delivery_method, JSON.stringify(shippingAddress || {}), deliveryFee || 0, discount || 0, customization_notes || null, JSON.stringify(customization_choices || {})]
      );

      const orderId = orderRes.rows[0].id;

      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_type, weight, product_name, customization_choices) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [orderId, item.product_id, item.quantity, item.price, item.product_type, item.weight, item.name, JSON.stringify(item.customization_choices || {})]
        );
      }

      if (delivery_method === 'local') {
        await client.query(`INSERT INTO local_deliveries (order_id, delivery_status) VALUES ($1, $2)`, [orderId, 'pending']);
      } else {
        await client.query(`INSERT INTO shipments (order_id, shipping_status) VALUES ($1, $2)`, [orderId, 'pending']);
      }

      await client.query(
        `INSERT INTO payments (order_id, gateway, payment_status, amount) VALUES ($1, $2, $3, $4)`,
        [orderId, paymentMethod || 'paytm', 'pending', totalAmount]
      );

      await client.query('COMMIT');
      res.status(201).json(orderRes.rows[0]);
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('CREATE_ORDER_ERROR:', error);
    require('fs').writeFileSync(__dirname + '/../tmp_order_err.txt', error.stack || error.toString());
    res.status(500).json({ message: 'Server error creating order', detail: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const itemsRes = await db.query(`
      SELECT items.*, COALESCE(items.product_name, p.name) as name, items.weight, items.customization_choices
      FROM order_items items 
      LEFT JOIN products p ON items.product_id = p.id 
      WHERE items.order_id = $1
    `, [id]);
    order.order_items = itemsRes.rows;

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving user orders' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving all orders' });
  }
};

// @desc    Update order to paid (Mock)
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction_id } = req.body;
    
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const updatedOrder = await client.query(
        "UPDATE orders SET payment_status = 'paid' WHERE id = $1 RETURNING *",
        [id]
      );

      if (updatedOrder.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Order not found' });
      }

      await client.query(
        "UPDATE payments SET payment_status = 'success', transaction_id = $1 WHERE order_id = $2",
        [transaction_id || 'mock_txn_12345', id]
      );

      await client.query('COMMIT');
      res.json(updatedOrder.rows[0]);
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('UPDATE_PAID_ERROR:', error);
    res.status(500).json({ message: 'Server error updating payment' });
  }
};

// @desc    Track order by ID (Public)
// @route   GET /api/orders/track/:id
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await db.query(
      'SELECT id, order_status, delivery_method, payment_status, created_at, total_amount FROM orders WHERE id = $1', 
      [id]
    );
    
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];

    const itemsRes = await db.query(`
      SELECT items.quantity, COALESCE(items.product_name, p.name) as name, items.weight, items.customization_choices
      FROM order_items items 
      LEFT JOIN products p ON items.product_id = p.id 
      WHERE items.order_id = $1
    `, [id]);
    order.order_items = itemsRes.rows;

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error tracking order' });
  }
};

// @desc    Update order status and add updates
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, update_message } = req.body;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentOrder = orderRes.rows[0];
    
    if (currentOrder.order_status.toLowerCase() === 'cancelled') {
        return res.status(400).json({ message: 'Cancelled orders cannot be updated.' });
    }

    let statusUpdates = currentOrder.status_updates || [];

    if (update_message || (order_status && order_status !== currentOrder.order_status)) {
      statusUpdates.push({
        status: order_status || currentOrder.order_status,
        message: update_message || `Order status updated to ${order_status}`,
        timestamp: new Date().toISOString()
      });
    }

    const updatedOrder = await db.query(
      `UPDATE orders 
       SET order_status = $1, status_updates = $2 
       WHERE id = $3 RETURNING *`,
      [order_status || currentOrder.order_status, JSON.stringify(statusUpdates), id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const forbiddenStatuses = ['food prepared', 'shipped', 'delivered', 'cancelled'];
    if (forbiddenStatuses.includes(order.order_status.toLowerCase())) {
      return res.status(400).json({ 
        message: `Order cannot be cancelled because it is already ${order.order_status}.` 
      });
    }

    let statusUpdates = order.status_updates || [];
    statusUpdates.push({
      status: 'cancelled',
      message: 'Order cancelled by user',
      timestamp: new Date().toISOString()
    });

    const isPaid = order.payment_status === 'paid';
    const refundStatus = isPaid ? 'pending' : 'none';

    const updatedOrder = await db.query(
      `UPDATE orders 
       SET order_status = $1, status_updates = $2, refund_status = $3 
       WHERE id = $4 RETURNING *`,
      ['cancelled', JSON.stringify(statusUpdates), refundStatus, id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
};

// @desc    Process refund (Admin only)
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund_id, update_message } = req.body;

    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];
    if (order.order_status !== 'cancelled') {
        return res.status(400).json({ message: 'Only cancelled orders can be refunded.' });
    }

    let statusUpdates = order.status_updates || [];
    statusUpdates.push({
      status: 'refunded',
      message: update_message || `Refund processed successfully. Refund ID: ${refund_id}`,
      timestamp: new Date().toISOString()
    });

    const updatedOrder = await db.query(
      `UPDATE orders 
       SET refund_status = $1, refund_id = $2, status_updates = $3 
       WHERE id = $4 RETURNING *`,
      ['completed', refund_id, JSON.stringify(statusUpdates), id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error processing refund' });
  }
};
