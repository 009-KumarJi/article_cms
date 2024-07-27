// controllers/auth.controller.js
import { User } from '../models/user.model.js';
import { ErrorHandler } from '../utils/utility.js';
import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.middleware.js';
import {cookieOptions, sendToken} from "../utils/features.js";
import {avatarUrl, sessionId} from "../utils/constants.js";
import {uploadFile} from "./file.controller.js";

const register = TryCatch(async (req, res, next) => {
    let { name, username, password, email, avatar, gender } = req.body;
    if (req.file) {
        const file = req.file;
        const newFile = await uploadFile({ ...req, file }, res, next, true);
        avatar = {
            id: newFile._id,
            url: newFile.url,
        };
    }
    if (!avatar) avatar = { url: avatarUrl(gender) };
    const user = await User.create({
        name,
        username,
        password,
        email,
        avatar
    });
    sendToken(res, user, 201, "User created successfully!");
});

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));

    sendToken(res, user, 200, `User Login Successful for ${user.name}!`);
});

const logout = TryCatch(async (req, res) => {
    return res.status(200)
        .cookie(sessionId, "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

const getCurrentUser = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.userId).select("-password");

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user,
    });
});

export {
    register,
    login,
    logout,
    getCurrentUser
};
