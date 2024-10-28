import express from 'express';
import { getCart, addToCart, clearCart } from '../controllers/cartController';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/clear', clearCart);

export default router;
