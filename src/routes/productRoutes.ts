import express from 'express';
import multer from 'multer';
import { getProducts, getProductById, createProduct, importProducts } from '../controllers/productController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { UserRole } from '../storage/storage';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', authenticateJWT, authorizeAdmin(UserRole.ADMIN), createProduct);
router.post('/import', authenticateJWT, authorizeAdmin(UserRole.ADMIN), upload.single('file'), importProducts);

export default router;