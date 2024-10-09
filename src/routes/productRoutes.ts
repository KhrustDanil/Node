import express from 'express';
import multer from 'multer';
import { getProducts, getProductById, createProduct, importProducts } from '../controllers/productController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.post('/import', upload.single('file'), importProducts);

export default router;