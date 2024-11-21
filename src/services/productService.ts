import { ProductRepository } from '../repository/productRepository';
import csv from 'csv-parser';
import fs from 'fs';
import { IProduct } from '../models/Product';
import { randomUUID } from 'crypto';
import { BadRequest, UnprocessableEntity } from '../error/errors';

export class ProductService {
  private productRepository = new ProductRepository();
  private CHUNK_SIZE = 100; // Кількість продуктів у одному чанку для оптимізації запису

  async getProducts(): Promise<IProduct[]> {
    return this.productRepository.getAllProducts();
  }

  async getProductById(productId: string): Promise<IProduct> {
    const product = await this.productRepository.getProductById(productId);
    if (!product) {
      throw new BadRequest('Product not found');
    }
    return product;
  }

  async createProduct(productData: Omit<IProduct, '_id'>): Promise<IProduct> {
    const validation = this.productRepository.validateProduct(productData);
    if (validation.error) {
      throw new UnprocessableEntity(validation.error.details[0].message);
    }

    return await this.productRepository.saveProduct(productData);
  }

  private async saveChunk(products: IProduct[]) {
    // Виконуємо групове збереження в MongoDB
    console.log('Saving chunk to MongoDB:', products);
    await this.productRepository.saveMany(products);
  }

  async importProducts(file: Express.Multer.File | undefined): Promise<IProduct[]> {
    if (!file) {
      throw new BadRequest('File is required');
    }

    return new Promise((resolve, reject) => {
      const results: IProduct[] = [];
      const readStream = fs.createReadStream(file.path);

      readStream
        .pipe(csv())
        .on('data', (data) => {
          const newProduct: Omit<IProduct, '_id'> = {
            name: data.name,
            description: data.description,
            category: data.category,
            price: parseFloat(data.price),
          };

          const validation = this.productRepository.validateProduct(newProduct);
          if (validation.error) {
            return reject(new UnprocessableEntity(validation.error.details[0].message));
          }

          results.push(newProduct);
        })
        .on('end', async () => {
          try {
            const savedProducts = await this.productRepository.saveMany(results);
            resolve(savedProducts);
          } catch (error) {
            reject(new Error(`Error saving products to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        })
        .on('error', (error) => {
          reject(new Error(`Error reading file: ${error.message}`));
        });
    });
  }
}