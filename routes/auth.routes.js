// routes/auth.routes.js
import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {loginValidator, registerValidator, validateHandler} from "../utils/validators.js";
import {singleMulter} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post('/register', singleMulter, registerValidator(), validateHandler, register); // Register a new user
router.post('/login', loginValidator(), validateHandler, login); // Login a user

router.use(isAuthenticated);
router.get('/logout', logout); // Logout a user
router.get('/me', getCurrentUser); // Get current user

export default router;
