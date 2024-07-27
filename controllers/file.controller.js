// controllers/file.controller.js
import { File } from '../models/file.model.js';
import {ErrorHandler, sout} from '../utils/utility.js';
import { TryCatch } from '../middlewares/error.middleware.js';
import {deleteFilesFromCloudinary, uploadFilesToCloudinary} from "../utils/features.js";
import {envMode} from "../utils/constants.js";


const uploadFile = TryCatch(async (req, res, next, internal = false) => {
    let file = req.files || req.file;

    if (!file) return next(new ErrorHandler('No file uploaded', 400));
    if (!Array.isArray(file)) file = [file];
    // Upload file to Cloudinary
    const results = await uploadFilesToCloudinary(file);
    if (!results) return next(new ErrorHandler('File upload failed', 500));

    const newFiles = await File.insertMany(results.map(result => ({
        public_id: result.public_id,
        url: result.url,
        type: result.type,
        size: result.size,
        uploadedBy: req.userId,
    })));

    if (internal) {
        return newFiles;
    }

    res.status(201).json({
        success: true,
        message: 'File uploaded successfully!',
        ...(envMode === "DEVELOPMENT" && { file: newFiles }),
    });
});

// Get all files
const getFiles = TryCatch(async (req, res) => {
    const files = await File.find();

    res.status(200).json({
        success: true,
        files,
    });
});

// Get file by ID
const getFileById = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return next(new ErrorHandler('File not found', 404));

    res.status(200).json({
        success: true,
        file,
    });
});

// Delete file
const deleteFile = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return next(new ErrorHandler('File not found', 404));

    // Delete file from Cloudinary
    await deleteFilesFromCloudinary([file.public_id]);

    // Delete file record from the database
    await File.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'File deleted successfully!',
    });
});

export {
    uploadFile,
    getFiles,
    getFileById,
    deleteFile
};
