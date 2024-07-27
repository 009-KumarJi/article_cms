// routes/article.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin, isModerator } from '../middlewares/role.middleware.js';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/article.controller.js';

const router = express.Router();

router.post('/', isAuthenticated, isAdmin, createArticle);  // Admin: create article
router.get('/', isAuthenticated, getArticles);              // All: read articles
router.get('/:id', isAuthenticated, getArticleById);        // All: read specific article
router.put('/:id', isAuthenticated, isModerator, updateArticle); // Admin/Moderator: update article
router.delete('/:id', isAuthenticated, isAdmin, deleteArticle);  // Admin: delete article

export default router;
