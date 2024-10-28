import { Product, IProduct } from '../models/Product';
import Joi from 'joi';

export class ProductRepository {

  private productSchema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().max(70).required(),
    description: Joi.string().max(256).required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
  });

  // Метод для валідації продукту
  validateProduct(product: IProduct) {
    return this.productSchema.validate(product);
  }
  async saveMany(products: IProduct[]): Promise<IProduct[]> {
    return Product.insertMany(products);
  }
  // Отримати всі продукти
  async getAllProducts(): Promise<IProduct[]> {
    return Product.find().exec();
  }

  // Отримати продукт за ID
  async getProductById(productId: string): Promise<IProduct | null> {
    return Product.findById(productId).exec();
  }

  // Зберегти продукт
  async saveProduct(product: Partial<IProduct>): Promise<IProduct> {
    const newProduct = new Product(product);
    return newProduct.save();
  }
}
