import mongoose from 'mongoose';
import { hash } from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Provide Your first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Provide Your last name'],
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'Provide a Username!'],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: [true, 'Provide an Email!'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false,
        },
        avatar: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'File',
            },
            url: {
                type: String,
                required: true,
                trim: true,
            },
        },
        role: {
            type: String,
            enum: ['Admin', 'Moderator', 'User'],
            default: 'User',
            trim: true
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 10);
    next();
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
