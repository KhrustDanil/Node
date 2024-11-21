import express from 'express';
import { registerUser, getUserById, loginUser } from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     description: Створення нового користувача в системі.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email користувача.
 *               name:
 *                 type: string
 *                 description: Ім'я користувача.
 *               password:
 *                 type: string
 *                 description: Пароль користувача.
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User registered successfully'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Помилка валідації запиту.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid email format'
 *       500:
 *         description: Внутрішня помилка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Ідентифікатор користувача.
 *         email:
 *           type: string
 *           description: Email користувача.
 *         name:
 *           type: string
 *           description: Ім'я користувача.
 *         role:
 *           type: string
 *           description: Роль користувача.
 *           enum:
 *             - ADMIN
 *             - CUSTOMER
 */

router.post('/register', registerUser);
router.post('/login', loginUser); 
router.get('/:userId', getUserById);

export default router;
