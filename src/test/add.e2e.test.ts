import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { connectDB, disconnectDB } from '../repository/mongoRepository';

const generateTestToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ id: userId, role }, secret, { expiresIn: '1h' });
};

let server: any;

beforeAll(async () => {
  server = app.listen(3000);
  await connectDB();
});

afterAll(async () => {
  await server.close();
  await disconnectDB();
});

describe('POST /api/carts/add', () => {
  it('should add a product to the cart for an authorized user', async () => {
    const token = generateTestToken('user123', 'Customer');
    const response = await request(app)
      .post('/api/carts/add')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ productId: '12345' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: 'Product added to cart' });
  });

  it('should return 400 if productId is not provided', async () => {
    const token = generateTestToken('user123', 'Customer');
    const response = await request(app)
      .post('/api/carts/add')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Product ID is required" });
  });

  it('should return 404 if product does not exist', async () => {
    const token = generateTestToken('user123', 'Customer');
    const response = await request(app)
      .post('/api/carts/add')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ productId: 'non-existent-id' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 if user is not authorized', async () => {
    const response = await request(app)
      .post('/api/carts/add')
      .set('Content-Type', 'application/json')
      .send({ productId: '12345' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
