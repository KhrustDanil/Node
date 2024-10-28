import express from 'express';
import { registerUser, getUserById, loginUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); 
router.get('/:userId', getUserById);

export default router;
