// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import {ErrorHandler, sout} from '../utils/utility.js';
import { TryCatch } from './error.middleware.js';
import {decrypt} from "../utils/crypto.js";

const isAuthenticated = TryCatch((req, res, next) => {
    const encryptedToken = req.cookies?.accessToken;
    if (!encryptedToken) {
        sout("Authentication attempt without token");
        return next(new ErrorHandler("Token not found", 404));
    }

    const decryptedToken = decrypt(encryptedToken);

    jwt.verify(decryptedToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                sout("Access Token Expired");
                return next(new ErrorHandler("Token Expired", 401)); // status code is reserverd for this line only
            }
            console.error(`Token verification failed: ${err.message}`);
            return next(new ErrorHandler("Token authentication failed", 403));
        }

        req.user = user;
        next();
    });
});

export { isAuthenticated };
