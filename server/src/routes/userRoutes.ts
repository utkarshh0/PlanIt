import express from 'express';
import { getUser, signup, login } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/get', authMiddleware,  getUser);

export default router;
