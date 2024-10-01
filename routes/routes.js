import express from 'express';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { users, carts, orders } from '../storage.js';
import { EventEmitter } from 'events';
import multer from 'multer';
import csv from 'csv-parser';
import Joi from 'joi';
import products from '../storage/products.store.json' assert { type: 'json' };
import { checkUserId } from '../middleware/checkUserId.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const eventEmitter = new EventEmitter();
const PRODUCTS_FILE_PATH = 'storage/products.store.json';

eventEmitter.on('fileUploadStart', () => {
  logEvent('File upload has started');
});

eventEmitter.on('fileUploadEnd', () => {
  logEvent('File has been uploaded');
});

eventEmitter.on('fileUploadFailed', (error) => {
  logEvent(`Error occurred, file upload failed; Details: ${error.message}`);
});

const logEvent = (message) => {
  const date = new Date();
  const formattedDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '');

  const logMessage = `${formattedDate} - ${message}\n`;
  fs.appendFileSync('storage/filesUpload.log', logMessage);
};

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
}).unknown(true);

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[?!@#$%^&*])[A-Za-z\\d?!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must include upper and lower case letters, numbers, and special characters',
      'any.required': 'Password is required',
    }),
});

router.post('/register', (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const { error } = userSchema.validate({ email, name, password });

    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const newUser = { id: randomUUID(), email, name };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error); 
  }
});

router.get('/products', (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:productId', (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const product = products.find((product) => product.id === productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.put('/cart/:productId', checkUserId, (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const productId = parseInt(req.params.productId);
    const product = products.find((product) => product.id === productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }

    let cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      cart = { id: randomUUID(), userId, products: [] };
      carts.push(cart);
    }
    cart.products.push(product);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.delete('/cart/:productId', checkUserId, (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const productId = parseInt(req.params.productId);
    const cart = carts.find((cart) => cart.userId === userId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter((product) => product.id !== productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
});

router.post('/cart/checkout', checkUserId, (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const cart = carts.find((cart) => cart.userId === userId);
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

router.post('/product', (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newProduct = {
    id: randomUUID(),
    ...req.body,
  };

  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(results, null, 2));
  res.status(201).json({ message: 'The product has been created successfully' });
});

router.post('/products/import', upload.single('file'), (req, res, next) => {
  try {
    const results = [];
    eventEmitter.emit('fileUploadStart');

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        const product = {
          id: randomUUID(),
          ...data,
        };

        const { error } = productSchema.validate(product);
        if (error) {
          const err = new Error(`Validation failed: ${error.details[0].message}`);
          err.status = 422;
          throw err;
        }

        results.push(product);
      })
      .on('end', () => {
        fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(results, null, 2));
        eventEmitter.emit('fileUploadEnd');
        res.status(200).json({ message: 'Products imported successfully' });
      })
      .on('error', (error) => {
        eventEmitter.emit('fileUploadFailed', error);
        next(error);
      });
  } catch (error) {
    eventEmitter.emit('fileUploadFailed', error);
    next(error);
  }
});

export default router;