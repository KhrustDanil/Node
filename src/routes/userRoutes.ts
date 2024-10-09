import express from 'express';
import { registerUser, getUserById } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.get('/:userId', getUserById);

export default router;
