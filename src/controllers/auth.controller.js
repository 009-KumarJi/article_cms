// controllers/auth.controller.js
import {User} from '../models/user.model.js';
import {ErrorHandler, sout} from '../utils/utility.js';
import {compare} from 'bcrypt';
import {TryCatch} from '../middlewares/error.middleware.js';
import {uploadFilesToCloudinary} from "../utils/features.js";
import {avatarUrl} from "../utils/constants.js";
import {deleteSession, generateAccessToken, generateAuthTokens, getUserSessions, storeSession} from "../utils/jwt.js";
import {decrypt, encrypt} from "../utils/crypto.js";
import jwt from "jsonwebtoken";
import {cookieOptions} from "../helper/helper.js";

const register = TryCatch(async (req, res, next) => {
	let {firstName, lastName, username, password, email, avatar, gender} = req.body;
	if (req.file) {
		const file = req.file;
		const result = await uploadFilesToCloudinary([file], true);
		avatar = result[0];
	}
	if (!avatar) avatar = {url: avatarUrl(gender)};
	sout(avatar)
	const user = await User.create({
		firstName,
		lastName,
		username,
		password,
		email,
		avatar
	});

	const cookiePayload = {
		userId: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
	}

	const {accessToken, refreshToken} = generateAuthTokens(cookiePayload);
	const session = await storeSession(user._id, refreshToken, accessToken);
	if (!session) return next(new ErrorHandler("Failed to store session", 500));

	return res
		.status(200)
		.cookie("accessToken", encrypt(accessToken), cookieOptions)
		.json({
			success: true,
			user: encrypt({
				name: user.firstName + " " + user.lastName,
				username: user.username,
				email: user.email,
				role: user.role,
				avatar: user.avatar.url,
			}),
			message: "User registered successfully",
		});
});

const login = TryCatch(async (req, res, next) => {
	const {username, password} = req.body;

	const user = await User.findOne({username}).select("+password");
	if (!user) return next(new ErrorHandler("Invalid credentials", 403));

	const isPasswordCorrect = await compare(password, user.password);
	if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 403));

	const cookiePayload = {
		userId: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
	}

	const {accessToken, refreshToken} = generateAuthTokens(cookiePayload);

	const previousSessions = await getUserSessions(user._id);
	const session = await storeSession(user._id, refreshToken, accessToken, previousSessions);
	if (!session) return next(new ErrorHandler("Failed to store session", 500));

	return res
		.status(200)
		.cookie("accessToken", encrypt(accessToken), cookieOptions)
		.json({
			success: true,
			user: encrypt({
				name: user.firstName + " " + user.lastName,
				username: user.username,
				email: user.email,
				role: user.role,
				avatar: user.avatar.url,
			}),
			message: "Logged in successfully",
		});
});

const logout = TryCatch(async (req, res, next) => {
	let {accessToken} = req?.cookies;
	if (!accessToken || !refreshToken) return next(new ErrorHandler('Unauthorized request', 403));

	await deleteSession(req.user?.userId, decrypt(accessToken));

	return res
		.status(200)
		.clearCookie('accessToken')
		.json({success: true, message: 'User logged out successfully'});
});

const getCurrentUser = TryCatch(async (req, res, next) => {
	const user = await User.findById(req.user.userId).select("-password");

	if (!user) return next(new ErrorHandler("User not found", 404));

	res.status(200).json({
		success: true,
		message: "User profile fetched successfully",
		user,
	});
});

const refreshToken = TryCatch(async (req, res, next) => {
	let {accessToken} = req?.cookies;
	if (!accessToken) return next(new ErrorHandler('Unauthorized request', 403));

	// decrypt both tokens
	accessToken = decrypt(accessToken);
	const decodedAccessToken = jwt.decode(accessToken);
	const activeSessions = await getUserSessions(decodedAccessToken.userId);
	// console.log("activeSessions", activeSessions)
	// console.log("decodedAccessToken", decodedAccessToken)
	// console.log("accessToken", accessToken)
	const refreshToken = activeSessions.find(session => session.accessToken === accessToken)?.refreshToken;
	// console.log("Found: ", Object.keys(activeSessions.find(session => session.accessToken === accessToken)))
	if (!refreshToken) return next(new ErrorHandler('Forbidden Request', 403));

	// check if refresh token is valid
	const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	if (!verifiedToken) return next(new ErrorHandler('Forbidden Request', 403));

	// generate new access token
	const newAccessToken = generateAccessToken({
		userId: decodedAccessToken.userId,
		username: decodedAccessToken.username,
		email: decodedAccessToken.email,
		role: decodedAccessToken.role,
	});

	// store new session
	await storeSession(decodedAccessToken.userId, refreshToken, newAccessToken, activeSessions, true);

	// send new access token in response cookie
	res.cookie('accessToken', encrypt(newAccessToken), {httpOnly: true, secure: true, sameSite: 'none'});

	return res.status(200).json({success: true});
});

export {
	register,
	login,
	logout,
	getCurrentUser,
	refreshToken
};
