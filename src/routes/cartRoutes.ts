import express from 'express';
import { getCart, addToCart, clearCart } from '../controllers/cartController';
import { checkUserId } from '../middleware/checkUserId';

const router = express.Router();

router.use(checkUserId);
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/clear', clearCart);

export default router;
