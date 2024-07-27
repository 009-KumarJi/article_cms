// routes/auth.routes.js
import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Login a user
router.get('/logout', isAuthenticated, logout); // Logout a user
router.get('/me', isAuthenticated, getCurrentUser); // Get current user

export default router;
