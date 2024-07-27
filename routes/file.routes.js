// routes/file.routes.js
import express from 'express';
import { uploadFile, getFiles, getFileById, deleteFile } from '../controllers/file.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';
import {multipleMulter} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(isAuthenticated);
// router.use(isAdmin);

router.post('/', multipleMulter, uploadFile); // Authenticated: upload file
router.get('/', getFiles); // Authenticated: get all files
router.get('/:id', getFileById); // Authenticated: get file by ID
router.delete('/:id', deleteFile); // Admin: delete file

export default router;
