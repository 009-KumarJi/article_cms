import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
    {
        public_id: {
            type: String,
            required: [true, 'Public ID is required'],
        },
        url: {
            type: String,
            required: [true, 'File URL is required'],
        },
        type: {
            type: String,
            required: [true, 'File type is required'],
        },
        size: {
            type: Number,
            required: [true, 'File size is required'],
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const File = mongoose.models.File || mongoose.model('File', fileSchema);
