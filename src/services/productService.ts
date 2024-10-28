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

    return new Promise((resolve, reject) => {
        const results: Product[] = [];
        const readStream = fs.createReadStream(file.path);

        let existingData: Product[] = [];
        const fileExists = fs.existsSync(PRODUCTS_FILE_PATH);

        if (fileExists) {
            try {
                const fileContent = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
                existingData = JSON.parse(fileContent || '[]');
            } catch (error) {
                console.log('Error reading existing data, continuing with an empty array.');
            }
        }

        const writeStream = fs.createWriteStream(PRODUCTS_FILE_PATH, {
            flags: fileExists ? 'r+' : 'w',
        });

        if (!fileExists || existingData.length === 0) {
            writeStream.write('[');
        } else {
            writeStream.write(',');
        }

        readStream
            .pipe(csv())
            .on('data', (data) => {
                if (data.id) {
                    delete data.id;
                }

                const newProduct: Product = {
                    id: randomUUID(),
                    ...data,
                };

                const validation = this.productRepository.validateProduct(newProduct);
                if (validation.error) {
                    return reject(new UnprocessableEntity(validation.error.details[0].message));
                }

                results.push(newProduct);
            })
            .on('end', () => {
                results.forEach((product, index) => {
                    const productData = JSON.stringify(product);
                    writeStream.write(productData + (index < results.length - 1 ? ',' : ''));
                });

                writeStream.write(']');
                writeStream.end();

                resolve(results);
            })
            .on('error', (error) => {
                reject(new Error(`Error reading file: ${error.message}`));
            });
    });
}
}
