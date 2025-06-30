const db = require('../config/db');

// POST /cart – create or return user cart
const createOrGetCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Check if user already has a cart
    const existing = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    // Otherwise, create a new cart
    const result = await db.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create or get cart', details: err.message });
  }
};

// POST /cart/:cartId – add item to cart
const addItemToCart = async (req, res) => {
  const { cartId } = req.params;
  const { product_id, quantity } = req.body;

  try {
    // Check if item already exists in cart
    const existing = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const updated = await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
        [quantity, cartId, product_id]
      );
      return res.json(updated.rows[0]);
    }

    // Else insert new item
    const result = await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [cartId, product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
};

// POST /cart/:cartId/checkout – simulate checkout
const checkoutCart = async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.userId;
  
    try {
      // 1. Verify the cart exists and belongs to the user
      const cartResult = await db.query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [cartId, userId]);
      if (cartResult.rows.length === 0) return res.status(404).json({ error: 'Cart not found' });
  
      // 2. Get cart items with product prices
      const itemsResult = await db.query(`
        SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = $1
      `, [cartId]);
  
      const items = itemsResult.rows;
      if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  
      // 3. Calculate total price
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // 4. Simulate successful payment
      const paymentSuccess = true;
  
      if (!paymentSuccess) {
        return res.status(402).json({ error: 'Payment failed' });
      }
  
      // 5. Create order
      const orderResult = await db.query(
        'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, total, 'paid']
      );
  
      const orderId = orderResult.rows[0].id;
  
      // 6. Insert into order_items
      const insertPromises = items.map(item =>
        db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.product_id, item.quantity, item.price]
        )
      );
      await Promise.all(insertPromises);
  
      // 7. Clear the cart
      await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  
      res.status(201).json({
        message: 'Checkout successful, order placed.',
        order: orderResult.rows[0]
      });
  
    } catch (err) {
      res.status(500).json({ error: 'Checkout failed', details: err.message });
    }
  };

// GET /cart/:cartId – get cart with item details
const getCartWithItems = async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await db.query('SELECT * FROM carts WHERE id = $1', [cartId]);
    if (cart.rows.length === 0) return res.status(404).json({ error: 'Cart not found' });

    const items = await db.query(`
      SELECT ci.*, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    res.json({
      cart: cart.rows[0],
      items: items.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
};

// DELETE /cart/:cartId/:itemId – remove item from cart
const removeItemFromCart = async (req, res) => {
    const { cartId, itemId } = req.params;
  
    try {
      const result = await db.query(
        'DELETE FROM cart_items WHERE cart_id = $1 AND id = $2 RETURNING *',
        [cartId, itemId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      res.json({ message: 'Item removed from cart', item: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove item', details: err.message });
    }
};
  
// DELETE /cart/:cartId – remove all items from the cart
const clearCart = async (req, res) => {
    const { cartId } = req.params;
  
    try {
      const result = await db.query(
        'DELETE FROM cart_items WHERE cart_id = $1 RETURNING *',
        [cartId]
      );
  
      res.json({
        message: 'Cart cleared',
        deletedCount: result.rows.length
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to clear cart', details: err.message });
    }
  };

module.exports = {
    createOrGetCart,
    addItemToCart,
    checkoutCart,
    getCartWithItems,
    removeItemFromCart,
    clearCart
};
