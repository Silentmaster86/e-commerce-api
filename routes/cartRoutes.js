const express = require('express');
const router = express.Router();
const {
  createOrGetCart,
  addItemToCart,
  checkoutCart,
  getCartWithItems,
  removeItemFromCart,
  clearCart
} = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Create or retrieve a user's cart
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Cart returned or created
 */
router.post('/', authenticateToken, createOrGetCart);

/**
 * @swagger
 * /cart/{cartId}:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart
 */
router.post('/:cartId', authenticateToken, addItemToCart);

/**
 * @swagger
 * /cart/{cartId}:
 *   get:
 *     summary: Get all items in a cart
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart items
 */
router.get('/:cartId', authenticateToken, getCartWithItems);

/**
 * @swagger
 * /cart/{cartId}:
 *   delete:
 *     summary: Clear all items from a cart
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/:cartId', authenticateToken, clearCart);

/**
 * @swagger
 * /cart/{cartId}/{itemId}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/:cartId/:itemId', authenticateToken, removeItemFromCart);

/**
 * @swagger
 * /cart/{cartId}/checkout:
 *   post:
 *     summary: Simulate a checkout (create an order)
 *     tags: [Cart]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Checkout complete
 */
router.post('/:cartId/checkout', authenticateToken, checkoutCart);

module.exports = router;
