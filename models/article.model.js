import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: [true, 'Provide a heading for the article'],
            trim: true,
        },
        thumbnail: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Article content is required'],
        },
        files: [
            {
                type: String,
                trim: true,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },
    },
    {
        timestamps: true,
    }
);

// Index for full-text search
articleSchema.index({ heading: 'text', content: 'text', tags: 'text' });

export const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
