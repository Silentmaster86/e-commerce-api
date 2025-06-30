const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for current user
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: User's orders
 */
router.get('/', authenticateToken, getAllOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order from cart
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', authenticateToken, createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get a single order (with items)
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:orderId', authenticateToken, getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - name: id
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch('/:id/status', authenticateToken, updateOrderStatus);

module.exports = router;
