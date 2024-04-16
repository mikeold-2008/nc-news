const express = require("express")
const app = express()
const {getTopics} = require("./controllers/topics.controllers")
const {getApi} = require("./controllers/api.controllers")
const {getArticleById, getArticles} = require("./controllers/articles.controllers")
const {getCommentsByArticleId,postComments} = require("./controllers/comments.controllers")


app.use(express.json())



app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)


app.post('/api/articles/:article_id/comments',postComments)



//Error handling:
app.get('*',(req,res) => {
    res.status(404).send({msg : "Not found"})
})

app.use((err, req, res, next) => {
    if(err.code === '23503'){
        res.status(400).send({msg: "Bad request"})
    }

    res.status(err.status).send({msg : err.msg})
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg : "internal server error"})
})


module.exports = app;