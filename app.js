const express = require("express")
const app = express()
const {getTopics} = require("./controllers/topics.controllers")
const {getApi} = require("./controllers/api.controllers")
const {getArticleById, getArticles, patchArticle} = require("./controllers/articles.controllers")
const {getCommentsByArticleId,postComments,deleteCommentById} = require("./controllers/comments.controllers")
const {getUsers} = require("./controllers/users.controllers")
const {handlePsqlErrors,handleServerErrors} = require('./errors/index.js');


app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.post('/api/articles/:article_id/comments',postComments)

app.patch('/api/articles/:article_id/',patchArticle)

app.delete('/api/comments/:comment_id',deleteCommentById)

app.get('/api/users',getUsers)

app.get('*',(req,res) => {
    res.status(404).send({msg : "Not found"})
})


app.use(handlePsqlErrors);

app.use(handleServerErrors)



module.exports = app;