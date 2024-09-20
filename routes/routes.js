import express from 'express';
import { randomUUID } from 'crypto';
import { users, products, carts, orders } from '../storage.js';

const router = express.Router();

router.post('/register', (req, res) => {
  try {
    const { email, name, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!@#$%^&*])[A-Za-z\d?!@#$%^&*]{8,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, include upper and lower case letters, numbers, and special characters.',
      });
    }

    const newUser = { id: randomUUID(), email, name };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products', (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.put('/cart/:productId', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const productId = parseInt(req.params.productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = { id: randomUUID(), userId, products: [] };
      carts.push(cart);
    }
    cart.products.push(product);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/cart/:productId', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const productId = parseInt(req.params.productId);
    const cart = carts.find((c) => c.userId === userId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter((p) => p.id !== productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
});

router.post('/cart/checkout', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = carts.find((c) => c.userId === userId);
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ error: 'Cart is empty' });

    const totalPrice = cart.products.reduce((sum, product) => sum + product.price, 0);
    const order = { id: randomUUID(), userId, products: cart.products, totalPrice };
    orders.push(order);

    cart.products = [];
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
