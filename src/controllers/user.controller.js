// controllers/user.controller.js
import {User} from '../models/user.model.js';
import {ErrorHandler, sout} from '../utils/utility.js';
import {TryCatch} from '../middlewares/error.middleware.js';
import {Article} from "../models/article.model.js";

// Get all users
const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find().select('-password'); // Exclude password from response

    res.status(200).json({
        success: true,
        users,
    });
});

// Get user by ID
const getUserById = TryCatch(async (req, res, next) => {
    const {id} = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) return next(new ErrorHandler('User not found', 404));

    res.status(200).json({
        success: true,
        user,
    });
});

// Update user
const updateUser = TryCatch(async (req, res, next) => {
    const {id} = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    }).select('-password');

    if (!user) return next(new ErrorHandler('User not found', 404));

    res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        user,
    });
});

// Delete user
const deleteUser = TryCatch(async (req, res, next) => {
    const {id} = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return next(new ErrorHandler('User not found', 404));

    res.status(200).json({
        success: true,
        message: 'User deleted successfully!',
    });
});

const searchUsers = TryCatch(async (req, res) => {
    sout("Searching users with name:", req.query);
    const {n = ""} = req.query;

    const searchString = n.replace(/\+/g, " ");  // Replacing '+' with space

    const users = await User.find({
        $text: { $search: searchString }
    });
    res.status(200).json(users);
});

const getArticlesByUser = TryCatch(async (req, res) => {
    const {id} = req.params;
    const articles = await Article.find({createdBy: id});
    res.status(200).json(articles);
});

export {
    getArticlesByUser,
    searchUsers,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
