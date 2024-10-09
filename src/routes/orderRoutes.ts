import express from 'express';
import { getOrders, createOrder } from '../controllers/orderController';
import { checkUserId } from '../middleware/checkUserId';

const router = express.Router();

router.use(checkUserId);
router.get('/', getOrders);
router.post('/', createOrder);

export default router;