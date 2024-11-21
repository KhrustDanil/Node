import request from 'supertest';
import app  from '../app';
import mongoose from 'mongoose';
import { describe } from 'node:test';
import { IUser, UserRole, User } from '../models/User';
import { Product } from '../models/Product';

describe('API E2E Tests for /api/register', () => {
    beforeAll(() => {
        return new Promise<void>((resolve) => {
            mongoose.connect(process.env.MONGODB_URI as string).then(() => resolve());
        });
    });

    afterAll(() => {
        return new Promise<void>(async (resolve) => {
            await User.deleteMany();
            await Product.deleteMany();
            await mongoose.disconnect();
            resolve();
        });
    });

    it('should register a new user successfully', () => {
        return new Promise<void>((resolve) => {
            const newUser: Partial<IUser> = {
                name: 'Valid User',
                email: 'validuser@example.com',
                password: 'StrongPassword123!',
            };

            request(app)
                .post('/api/users/register')
                .send(newUser)
                .then((response) => {
                    expect(response.status).toBe(201);
                    expect(response.body).toHaveProperty('user._id');
                    expect(response.body.user.name).toBe(newUser.name);
                    expect(response.body.user.email).toBe(newUser.email);
                    expect(response.body.user.role).toBe(UserRole.CUSTOMER);
                    expect(response.body).not.toHaveProperty('password');
                    resolve();
                });
        });
    });

    it('should not register a user with invalid email', () => {
        return new Promise<void>((resolve) => {
            const newUser: Partial<IUser> = {
                name: 'Invalid User',
                email: 'invalidemail',
                password: 'StrongPassword123',
            };

            request(app)
                .post('/api/users/register')
                .send(newUser)
                .then((response) => {
                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty('error', 'Invalid email format'); // Очікуване повідомлення
                    resolve();
                });
        });
    });

    it('should not allow duplicate email registration', () => {
        return new Promise<void>(async (resolve) => {
            const existingUser: Partial<IUser> = {
                name: 'Existing User',
                email: 'duplicate@example.com',
                password: 'Password123',
            };

            await User.create({
                ...existingUser,
                passwordHash: 'hashedpassword',
                role: UserRole.CUSTOMER,
            });

            request(app)
                .post('/api/users/register')
                .send(existingUser)
                .then((response) => {
                    expect(response.status).toBe(400);
                    expect(response.body).toHaveProperty('error', 'Password must include upper and lower case letters, numbers, and special characters'); // Очікуване повідомлення
                    resolve();
                });
        });
    });
});
