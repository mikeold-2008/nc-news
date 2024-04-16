const app = require("../app")
const {fetchCommentsByArticleId} = require("../models/comments.models")
const {checkArticleExists} = require("../models/articles.models")

function getCommentsByArticleId(req,res,next){
    const {article_id} = req.params


    Promise.all([fetchCommentsByArticleId(article_id),checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send(comments)
    })
    .catch(next)
}


module.exports = {getCommentsByArticleId}