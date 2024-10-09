import { ProductRepository } from '../repository/productRepository';
import csv from 'csv-parser';
import fs from 'fs';
import { Product } from '../storage/storage';
import { randomUUID } from 'crypto';
import { BadRequest, UnprocessableEntity } from '../error/errors';
import path from 'path';

const PRODUCTS_FILE_PATH = path.join(__dirname, '../storage/products.store.json');

export class ProductService {
  private productRepository = new ProductRepository();

  getProducts() {
    return this.productRepository.getAllProducts();
  }

  getProductById(productId: string) {
    const product = this.productRepository.getProductById(productId);
    if (!product) {
      throw new BadRequest('Product not found');
    }
    return product;
  }

  createProduct(productData: Omit<Product, 'id'>) {
    const newProduct: Product = {
      id: randomUUID(),
      ...productData,
    };
    this.productRepository.saveProduct(newProduct);
    return newProduct;
  }

  async importProducts(file: Express.Multer.File | undefined): Promise<Product[]> {
    if (!file) {
      throw new BadRequest('File is required');
    }

    const results: Product[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
            if (data.id) {
                delete data.id; 
              } 
          const newProduct: Product = {
            id: randomUUID(), // Генеруємо id
            ...data,
          };

          const validation = this.productRepository.validateProduct(newProduct);
          if (validation.error) {
            // Якщо валідація не пройшла, відхиліть проміс з помилкою
            return reject(new UnprocessableEntity(validation.error.details[0].message));
          }

          results.push(newProduct);
        })
        .on('end', () => {
          // Записуємо результати в файл
          fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(results, null, 2));
          resolve(results); // Вирішуємо проміс з результатами
        })
        .on('error', (error) => {
          // Відхиляємо проміс у разі помилки
          reject(new Error(`Error reading file: ${error.message}`));
        });
    });
  }
}
