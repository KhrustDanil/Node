import { ProductRepository } from '../repository/productRepository';
import { ProductService } from '../services/productService';
import { connectToTestDb, disconnectFromTestDb } from '../jest.setup';
import { IProduct } from '../models/Product';

const productRepository = new ProductRepository();
const productService = new ProductService();

beforeAll(async () => {
  await connectToTestDb();
});

afterAll(async () => {
  await disconnectFromTestDb();
});

describe('ProductService Integration Tests', () => {
  test('Should save and retrieve a product', async () => {
    const productData: Omit<IProduct, '_id'> = {
      name: 'Test Product',
      description: 'Test description',
      category: 'Test category',
      price: 99.99,
    };

    const savedProduct = await productService.createProduct(productData);
    expect(savedProduct).toHaveProperty('_id');
    expect(savedProduct.name).toBe(productData.name);

    const retrievedProduct = await productService.getProductById(savedProduct._id!.toString());
    expect(retrievedProduct).toBeDefined();
    expect(retrievedProduct?.name).toBe(productData.name);
  });

  test('Should retrieve all products', async () => {
    const productsData: Omit<IProduct, '_id'>[] = [
      { name: 'Product 1', description: 'Description 1', category: 'Category 1', price: 50 },
      { name: 'Product 2', description: 'Description 2', category: 'Category 2', price: 75 },
    ];

    for (const product of productsData) {
      await productService.createProduct(product);
    }

    const allProducts = await productService.getProducts();
    expect(allProducts.length).toBeGreaterThanOrEqual(2);
    const names = allProducts.map((p) => p.name);
    expect(names).toContain('Product 1');
    expect(names).toContain('Product 2');
  });

  test('Should handle validation errors during product creation', async () => {
    const invalidProductData = {
      name: 'Invalid Product',
      description: 'Too long description'.repeat(30),
      category: 'Category 1',
      price: -100,
    };

    await expect(productService.createProduct(invalidProductData as IProduct)).rejects.toThrow();
  });
});
