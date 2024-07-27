// controllers/article.controller.js
import { Article } from '../models/article.model.js';
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from '../middlewares/error.middleware.js';

// Create a new article
const createArticle = TryCatch(async (req, res, next) => {
    const { heading, content, thumbnail, files, tags, status } = req.body;

    const article = await Article.create({
        heading,
        content,
        thumbnail,
        files,
        tags,
        status,
        createdBy: req.userId,
    });

    res.status(201).json({
        success: true,
        message: 'Article created successfully!',
        article,
    });
});

// Get all articles (pagination and search can be added as needed)
const getArticles = TryCatch(async (req, res) => {
    const articles = await Article.find();

    res.status(200).json({
        success: true,
        articles,
    });
});

// Get an article by ID
const getArticleById = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) return next(new ErrorHandler('Article not found', 404));

    res.status(200).json({
        success: true,
        article,
    });
});

// Update an article
const updateArticle = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { heading, content, thumbnail, files, tags, status } = req.body;

    let article = await Article.findById(id);
    if (!article) return next(new ErrorHandler('Article not found', 404));


    article = await Article.findByIdAndUpdate(
        id,
        { heading, content, thumbnail, files, tags, status, updatedBy: req.userId },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Article updated successfully!',
        article,
    });
});

// Delete an article
const deleteArticle = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) return next(new ErrorHandler('Article not found', 404));

    // Ensure the user is authorized to delete
    if (req.userId.toString() !== article.createdBy.toString()) {
        return next(new ErrorHandler('Unauthorized to delete this article', 403));
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Article deleted successfully!',
    });
});

export {
    createArticle,
    getArticleById,
    getArticles,
    updateArticle,
    deleteArticle
};
