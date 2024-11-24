// controllers/auth.controller.js
import {User} from '../models/user.model.js';
import {ErrorHandler, sout} from '../utils/utility.js';
import {compare} from 'bcrypt';
import {TryCatch} from '../middlewares/error.middleware.js';
import {cookieOptions, sendToken, uploadFilesToCloudinary} from "../utils/features.js";
import {avatarUrl, sessionId} from "../utils/constants.js";
import {deleteSession, generateAccessToken, generateAuthTokens, getUserSessions, storeSession} from "../utils/jwt.js";
import {decrypt, encrypt} from "../utils/crypto.js";
import jwt from "jsonwebtoken";

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
	sendToken(res, cookiePayload, 201, "User created successfully!");
});

const login = TryCatch(async (req, res, next) => {
	const {username, password} = req.body;

	const user = await User.findOne({username}).select("+password");
	if (!user) return next(new ErrorHandler("Invalid credentials", 401));

	const isPasswordCorrect = await compare(password, user.password);
	if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));

	const cookiePayload = {
		userId: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
	}

	const {accessToken, refreshToken} = generateAuthTokens(cookiePayload);

	const previousSession = await getUserSessions(user._id);
	const session = await storeSession(user._id, refreshToken, previousSession);
	if (!session) return next(new ErrorHandler("Failed to store session", 500));

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
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
	let {accessToken, refreshToken} = req?.cookies;
	sout(decrypt(accessToken));
	sout(decrypt(refreshToken))
	if (!accessToken || !refreshToken) return next(new ErrorHandler('Unauthorized request', 403));

	await deleteSession(req.user?.userId, decrypt(refreshToken));

	return res
		.status(200)
		.clearCookie('accessToken')
		.clearCookie('refreshToken')
		.json({success: true, message: 'User logged out successfully'});
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

const refreshToken = TryCatch(async (req, res, next) => {
	let {refreshToken, accessToken} = req?.cookies;
	if (!refreshToken) return next(new ErrorHandler('Refresh token not provided', 400));

	// decrypt both tokens
	refreshToken = decrypt(refreshToken);
	accessToken = decrypt(accessToken);

	// check if refresh token is valid
	const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	if (!verifiedToken) return next(new ErrorHandler('Forbidden Request', 403));

	// generate new access token
	const decodedAccessToken = jwt.decode(accessToken);
	delete decodedAccessToken.iat;
	delete decodedAccessToken.exp;
	const newAccessToken = generateAccessToken(decodedAccessToken);

	// send new access token in response cookie
	res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: true, sameSite: 'none'});

	return res.status(200).json({success: true});
});

export {
	register,
	login,
	logout,
	getCurrentUser,
	refreshToken
};
