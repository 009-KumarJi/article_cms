// validator.js
import {body, validationResult} from "express-validator";
import {ErrorHandler} from "./utility.js";

const validateHandler = (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    const errorMessage = errors.array().map((error) => error.msg).join(", ");

    if (errors.isEmpty()) return next();
    next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
    body('firstName', 'Name is required').notEmpty(),
    body('lastName', 'Name is required').notEmpty(),
    body('username', 'Username is required').notEmpty(),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
];

// Validation rules for user login
const loginValidator = () => [
    body('username', 'Enter username!').notEmpty(),
    body('password', 'Enter password!').notEmpty(),
];

// Validation rules for creating an article
const articleValidator = () => [
    body('heading', 'Heading is required').notEmpty(),
    body('content', 'Content is required').notEmpty(),
    body('status', 'Status must be either draft, published, or archived').isIn(['draft', 'published', 'archived']),
];

export {
    validateHandler,
    registerValidator,
    loginValidator,
    articleValidator,
};