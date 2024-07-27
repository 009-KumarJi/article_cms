// controllers/file.controller.js
import { File } from '../models/file.model.js';
import { uploadFilesToCloudinary, deleteFilesFromCloudinary } from '../helpers/cloudinary.js';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from '../middlewares/error.middleware.js';

// Upload file
const uploadFile = TryCatch(async (req, res, next, internal = false) => {
    const file = req.file;

    if (!file) return next(new ErrorHandler('No file uploaded', 400));

    // Upload file to Cloudinary
    const results = await uploadFilesToCloudinary([file]);
    if (!results) return next(new ErrorHandler('File upload failed', 500));

    const { public_id, url } = results[0]; // Get the first result (assuming single file upload)

    // Save file details to the database
    const newFile = await File.create({
        public_id,
        url,
        type: file.mimetype,
        size: file.size,
        uploadedBy: req.userId,
    });

    if (internal) {
        return newFile;
    }

    res.status(201).json({
        success: true,
        message: 'File uploaded successfully!',
        file: newFile,
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
