// routes/file.routes.js
import express from 'express';
import { uploadFile, getFiles, getFileById, deleteFile } from '../controllers/file.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', isAuthenticated, uploadFile); // Authenticated: upload file
router.get('/', isAuthenticated, getFiles); // Authenticated: get all files
router.get('/:id', isAuthenticated, getFileById); // Authenticated: get file by ID
router.delete('/:id', isAuthenticated, isAdmin, deleteFile); // Admin: delete file

export default router;
