import express from 'express';
import multer from 'multer';
import { getProducts, getProductById, createProduct, importProducts } from '../controllers/productController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', authenticateJWT, authorizeAdmin, createProduct);
router.post('/import', upload.single('file'), importProducts);

export default router;