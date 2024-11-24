// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { jwtSecret, sessionId } from '../utils/constants.js';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from './error.middleware.js';

const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies[sessionId];
    if (!token) return next(new ErrorHandler('Unauthorized access for this route!', 401));
    const decodedData = jwt.verify(token, jwtSecret);
    req.userId = decodedData.id;
    next();
});

export { isAuthenticated };
