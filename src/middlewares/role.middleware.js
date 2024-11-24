// middlewares/role.middleware.js
import { User } from '../models/user.model.js';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from './error.middleware.js';

const isAdmin = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (user.role !== 'Admin') {
        return next(new ErrorHandler('Access denied: Admins only', 403));
    }
    next();
});

const isModerator = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (user.role !== 'Moderator' && user.role !== 'Admin') {
        return next(new ErrorHandler('Access denied: Moderators only', 403));
    }
    next();
});

export { isAdmin, isModerator };
