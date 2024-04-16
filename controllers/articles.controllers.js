const app = require("../app")
const {fetchArticleById, fetchArticles} = require("../models/articles.models")

function getArticleById(req,res,next){
    const id = req.params

    fetchArticleById(id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch(next)
}   

function getArticles(req,res,next){
    fetchArticles().then((articles) => {
    res.status(200).send(articles)
    })
    .catch(next)
}

module.exports={getArticleById, getArticles}