import express from 'express';
import multer from 'multer';
import { getProducts, getProductById, createProduct, importProducts } from '../controllers/productController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { IUser } from '../models/User';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', authenticateJWT, authorizeAdmin('ADMIN' as IUser['role']), createProduct);
router.post('/import', authenticateJWT, authorizeAdmin('ADMIN' as IUser['role']), upload.single('file'), importProducts);

export default router;  