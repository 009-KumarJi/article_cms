import CustomError from "./CustomError.js";
import {encrypt} from "./crypto.js";
import jwt from "jsonwebtoken";
import {delAsync, getAsync, setAsync} from "./redis.js";

const generateAccessToken = (user) => {
	try {
		return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRY});
	} catch (error) {
		console.error(`Error generating access token: ${error.message}`);
		throw new CustomError("Failed to generate access token", "TokenGenerationError");
	}
};


const generateRefreshToken = (userId) => {
	try {
		const payload = {userId};
		return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRY});
	} catch (error) {
		console.error(`Error generating refresh token: ${error.message}`);
		throw new CustomError("Failed to generate refresh token", "TokenGenerationError");
	}
};


const generateAuthTokens = (user) => {
	try {
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user.userId);
		return {accessToken, refreshToken};
	} catch (error) {
		console.error(`Error generating auth tokens: ${error.message}`);
		throw error;
	}
};

const getUserSessions = async (userId) => {
	try {
		const sessionsData = await getAsync(`sessions:${userId}`);
		console.log(`Sessions data for user ${userId}: ${sessionsData}`);
		return sessionsData ? JSON.parse(sessionsData) : null;
	} catch (error) {
		console.error(`Error fetching sessions for user ${userId}: ${error.message}`);
		return null;
	}
};

const storeSession = async (userId, refreshToken, accessToken, sessions, replaceAccessToken = false) => {
	try {
		console.log(`Storing session for user ${userId} - ${refreshToken}`);
		if (!refreshToken || !userId || !accessToken) {
			console.error(`Invalid session data for user ${userId}`);
			return false;
		}
		const newSession = {refreshToken, accessToken, lastLogin: Date.now()};

		let updatedSessions;
		if (replaceAccessToken) {
			updatedSessions = sessions
				? sessions
					.map(session =>
						session.refreshToken === refreshToken
							? {
								...session,
								accessToken
							}
							: session
					)
				: [newSession];
		} else {
			updatedSessions = sessions ? [...sessions, newSession] : [newSession];
		}

		await setAsync(`sessions:${userId}`, JSON.stringify(updatedSessions), 'EX', 60 * 60 * 12);
		return true;
	} catch (error) {
		console.error(`Error storing session for user ${userId}: ${error.message}`);
		return false;
	}
};

const deleteSession = async (userId, accessToken = "") => {
	try {
		const sessions = await getUserSessions(userId);
		if (!sessions) return;

		const updatedSessions = sessions.filter(session => session.accessToken !== accessToken);
		if (updatedSessions.length === 0) {
			await delAsync(`sessions:${userId}`);
			return;
		}
		await setAsync(`sessions:${userId}`, JSON.stringify(updatedSessions), 'EX', 60 * 60 * 12);
	} catch (error) {
		console.warn(`Error deleting session for user ${userId}: ${error.message}`);
	}
}

export {
	getUserSessions,
	storeSession,
	deleteSession,
	generateAccessToken,
	generateAuthTokens
};
