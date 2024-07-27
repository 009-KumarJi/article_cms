// routes/user.routes.js
import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', isAuthenticated, isAdmin, getAllUsers); // Admin: get all users
router.get('/:id', isAuthenticated, getUserById); // Authenticated: get user by ID
router.put('/:id', isAuthenticated, updateUser); // Authenticated: update user
router.delete('/:id', isAuthenticated, isAdmin, deleteUser); // Admin: delete user

export default router;
