import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../repository/mongoRepository';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});


describe('GET /api/carts', () => {
    it('should return the cart contents with status 200 if the cart exists', async () => {
        const testUserId = '673edd6420eb43da6becc001';
        const testProductId = '64a9f60d8e1b8d5f9f6c888e';
        
        const addResponse = await request(app)
          .post('/api/carts/add')
          .set('x-user-id', testUserId)
          .send({ productId: testProductId });
      
        expect(addResponse.status).toBe(201);
        expect(addResponse.body).toHaveProperty('user');
        expect(addResponse.body).toHaveProperty('products');

        const response = await request(app)
          .get('/api/carts')
          .set('x-user-id', testUserId);
      
        expect(response.status).toBe(200);
      
        expect(response.body).toEqual({
          user: testUserId,
          products: expect.any(Array),
        });
      
        const addedProduct = response.body.products.find(
          (product: any) => product._id.toString() === testProductId
        );
        expect(addedProduct).toBeDefined();
      });
      


  it('should return 404 if the cart is not found', async () => {
    const response = await request(app)
      .get('/api/carts')
  
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Cart not found' });
  });
  
});
