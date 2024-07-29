// controllers/article.controller.js
import {Article} from '../models/article.model.js';
import {ErrorHandler, sout} from '../utils/utility.js';
import {TryCatch} from '../middlewares/error.middleware.js';
import {User} from "../models/user.model.js";

// Create a new article
const createArticle = TryCatch(async (req, res) => {
    const {heading, content, thumbnail, files, tags, status, category} = req.body;

    const article = await Article.create({
        heading,
        content,
        thumbnail,
        files,
        tags,
        status,
        category,
        createdBy: req.userId,
    });

    res.status(201).json({
        success: true,
        message: 'Article created successfully!',
        article,
    });
});

// Get all articles
const getArticles = TryCatch(async (req, res) => {
    const articles = await Article.find();
    let users = await User.find()

    let usersF = {}
    users.map(user => {
        usersF[user["_id"].toString()] = user.username;
    })

    let result = {};
    articles.map(article => {
        let f = result[article.category];
        if (!f){
            result[article.category] = [{
                heading: article.heading,
                username: usersF[article.createdBy],
                category: article.category
            }];
        } else {
            result[article.category].push({
                heading: article.heading,
                username: usersF[article.createdBy],
                category: article.category
            });
        }
    })

    res.status(200).json({
        success: true,
        articles: result,
    });
});

// Get an article by ID
const getArticleById = TryCatch(async (req, res, next) => {
    const {id} = req.params;

    const article = await Article.findById(id);
    if (!article) return next(new ErrorHandler('Article not found', 404));

    res.status(200).json({
        success: true,
        article,
    });
});

// Update an article
const updateArticle = TryCatch(async (req, res, next) => {
    const {id} = req.params;
    const {heading, content, thumbnail, files, tags, status, category} = req.body;

    let article = await Article.findById(id);
    if (!article) return next(new ErrorHandler('Article not found', 404));


    article = await Article.findByIdAndUpdate(
        id,
        {heading, content, thumbnail, files, tags, status, category, updatedBy: req.userId},
        {new: true}
    );

    res.status(200).json({
        success: true,
        message: 'Article updated successfully!',
        article,
    });
});

// Delete an article
const deleteArticle = TryCatch(async (req, res, next) => {
    const {id} = req.params;

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

const searchArticleByCategory = TryCatch(async (req, res, next) => {
    const {category = ""} = req.query;
    if (category.length === 0) {
        return getArticles(req, res, next);
    }

    const articles = await Article.find({
        category: category,
    });

    res.status(200).json(articles);
})

const searchArticles = TryCatch(async (req, res) => {
    const {q = ""} = req.query;
    sout("Searching articles with query:", q);

    const searchString = q.replace(/\+/g, " ");  // Replacing '+' with space

    const articles = await Article.find({
        $text: {$search: searchString},
    });
// category
    res.status(200).json(articles);
});

export {
    searchArticles,
    createArticle,
    getArticleById,
    getArticles,
    updateArticle,
    deleteArticle,
    searchArticleByCategory
};
