// routes/file.routes.js
import express from 'express';
import { uploadFile, getFiles, getFileById, deleteFile } from '../controllers/file.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';
import {multipleMulter} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.post('/', multipleMulter, uploadFile); // Authenticated: upload file --OK
router.get('/', getFiles); // Authenticated: get all files --OK
router.get('/:id', getFileById); // Authenticated: get file by ID --OK
router.delete('/:id', deleteFile); // Admin: delete file --OK

export default router;
