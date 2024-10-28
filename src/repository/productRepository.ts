import { Product, products } from '../storage/storage';
import Joi from 'joi';

export class ProductRepository {
  getAllProducts(): Product[] {
    return products;
  }

  getProductById(productId: string): Product | undefined {
    return products.find(product => product.id === productId);
  }

  saveProduct(product: Product): void {
    products.push(product);
  }

  validateProduct(product: Product) {
    const schema = Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
    });

    return schema.validate(product);
  }
}
