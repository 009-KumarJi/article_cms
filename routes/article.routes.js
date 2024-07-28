// routes/article.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin, isModerator } from '../middlewares/role.middleware.js';
import {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    searchArticles
} from '../controllers/article.controller.js';
import {articleValidator, validateHandler} from "../utils/validators.js";

const router = express.Router();

router.use(isAuthenticated);
router.get('/', getArticles);              // All: read articles --OK
router.post('/', isAdmin, articleValidator(), validateHandler, createArticle);  // Admin: create article --OK
router.get('/search', searchArticles);     // All: search articles
router.put('/:id', isModerator, updateArticle); // Admin/Moderator: update article --OK
router.delete('/:id', isAdmin, deleteArticle);  // Admin: delete article
router.get('/:id', getArticleById);        // All: read specific article --OK

export default router;
