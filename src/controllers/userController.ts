import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { BadRequest, Unauthorized } from '../error/errors';
import Joi from 'joi';
import { users, User } from '../storage/storage';
import { hashPassword, comparePassword } from '../utils/bcrypt';


const userService = new UserService();

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

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;
    const { error } = userSchema.validate({ email, name, password });

    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const passwordHash = await hashPassword(password);  // Хешування пароля
    const newUser: User = { id: randomUUID(), email, name, passwordHash, role: 'CUSTOMER' };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new Unauthorized('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
