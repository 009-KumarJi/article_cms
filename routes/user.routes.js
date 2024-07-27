// routes/user.routes.js
import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {isAdmin, isModerator} from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(isAuthenticated);
router.use(isModerator);

router.get('/', getAllUsers); // Moderator: get all users --OK
router.get('/:id', getUserById); // Moderator: get user by ID --OK
router.put('/:id', updateUser); // Moderator: update user --OK

router.delete('/:id', isAdmin, deleteUser); // Admin: delete user --OK

export default router;
