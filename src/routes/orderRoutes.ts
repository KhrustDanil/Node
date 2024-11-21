import express from 'express';
import { getOrders, createOrder } from '../controllers/orderController';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for a user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: [] # якщо потрібен токен
 *     responses:
 *       200:
 *         description: A list of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: ID of the user
 *                   products:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: ID of the product
 *                   status:
 *                     type: string
 *                     enum: [created, completed, cancelled]
 *                     description: Order status
 *       404:
 *         description: No orders found for the user
 *       401:
 *         description: Unauthorized
 */
router.get('/', getOrders);
router.post('/', createOrder);

export default router;