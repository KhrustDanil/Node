import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { eventEmitter } from '../events/eventLogger';

const productService = new ProductService();

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = productService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    const product = productService.getProductById(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = req.body;
    const newProduct = productService.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const importProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    eventEmitter.emit('fileUploadStart');

    const products = await productService.importProducts(req.file);

    res.status(200).json({
      message: 'Products imported successfully',
      totalProducts: products.length,
      sampleProducts: products.slice(0, 5)
    });

    eventEmitter.emit('fileUploadEnd');
  } catch (error) {
    eventEmitter.emit('fileUploadFailed', error);
    next(error);
  }
};
