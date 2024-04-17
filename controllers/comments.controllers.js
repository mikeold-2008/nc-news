const app = require("../app")
const {fetchCommentsByArticleId,insertComments,removeCommentById,checkCommentExists} = require("../models/comments.models")
const {checkArticleExists} = require("../models/articles.models")

function getCommentsByArticleId(req,res,next){
    const {article_id} = req.params

    Promise.all([fetchCommentsByArticleId(article_id),checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send(comments)
    })
    .catch(next)
}


function postComments(req,res,next){
    const {username,body} = req.body
    const {article_id} = req.params
    
    Promise.all(
        [insertComments(username,body,article_id),checkArticleExists(article_id)]
    )
    .then(([comment]) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}


function deleteCommentById(req,res,next){
    const {comment_id} = req.params

    checkCommentExists(comment_id)
    .then(
    removeCommentById(comment_id)
    .then((comment) => {
        res.status(204).send({})
    })
    .catch((err) => {
        next(err)
    })
    ).catch(next)
}


module.exports = {getCommentsByArticleId, postComments,deleteCommentById}