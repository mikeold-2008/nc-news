const articlesRouter = require('express').Router();
const {getArticleById, getArticles, patchArticle} = require("../controllers/articles.controllers")
const {getCommentsByArticleId,postComments} = require("../controllers/comments.controllers")

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id',getArticleById)

articlesRouter.get('/:article_id/comments',getCommentsByArticleId)

articlesRouter.post('/:article_id/comments',postComments)

articlesRouter.patch('/:article_id',patchArticle)

module.exports = articlesRouter;