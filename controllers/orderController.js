const db = require('../config/db');

// POST /orders – place order from current user's cart
const createOrder = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Step 1: Get cart
    const cartResult = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    if (cartResult.rows.length === 0) return res.status(400).json({ error: 'Cart not found' });

    const cartId = cartResult.rows[0].id;

    // Step 2: Get cart items with prices
    const itemsResult = await db.query(`
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    const items = itemsResult.rows;

    if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Step 3: Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Step 4: Create order
    const orderResult = await db.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *',
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // Step 5: Insert order_items
    const insertPromises = items.map(item => {
      return db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    });

    await Promise.all(insertPromises);

    // Step 6: Clear cart
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(201).json({
      message: 'Order placed successfully',
      order: orderResult.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
};

// GET /orders – get all orders for current user
const getAllOrders = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const result = await db.query(
        `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
    }
  };
  
  // GET /orders/:orderId – get order by ID (only if belongs to current user)
  const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.userId;
  
    try {
      const orderResult = await db.query(
        `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
        [orderId, userId]
      );
  
      if (orderResult.rows.length === 0)
        return res.status(404).json({ error: 'Order not found or access denied' });
  
      const itemsResult = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE order_id = $1`,
        [orderId]
      );
  
      res.json({
        order: orderResult.rows[0],
        items: itemsResult.rows
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch order', details: err.message });
    }
};
  
// PATCH /orders/:id/status – update order status (admin or owner)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const role = req.user.role;
  
    const allowedStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  
    try {
      // Only allow update if user owns order OR is admin
      const check = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (check.rows.length === 0)
        return res.status(404).json({ error: 'Order not found' });
  
      const order = check.rows[0];
      if (order.user_id !== userId && role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: not your order' });
      }
  
      // Update order status
      const result = await db.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );
  
      res.json({
        message: 'Order status updated',
        order: result.rows[0]
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status', details: err.message });
    }
  };

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
