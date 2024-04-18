const app = require("../app")
const {fetchArticleById, fetchArticles, updateArticle,getVoteCount, checkArticleExists} = require("../models/articles.models")

function getArticleById(req,res,next){
    const id = req.params

    fetchArticleById(id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch(next)
}   

function getArticles(req,res,next){
    const {topic,sort_by,order} = req.query
    fetchArticles(topic,sort_by,order).then((articles) => {
    res.status(200).send(articles)
    })
    .catch((err) => {
        next(err)
    })
}


function patchArticle(req,res,next){
    const {article_id} = req.params
    const {inc_votes} = req.body

    checkArticleExists(article_id)
    .then(
        getVoteCount(article_id)
    .then((currentVoteCount) => { 
        return currentVoteCount.votes+inc_votes;   
    })
    .then((newVoteTotal) => {
        return updateArticle(article_id,newVoteTotal)
    })
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    }) 
    ).catch(next)

}

module.exports={getArticleById, getArticles, patchArticle}