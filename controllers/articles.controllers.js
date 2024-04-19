const app = require("../app")
const {fetchArticleById, fetchArticles, updateArticle,getVoteCount, checkArticleExists} = require("../models/articles.models")

function getArticleById(req,res,next){
    const id = req.params

    fetchArticleById(id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}   










function getArticles(req,res,next){
    const {topic,sort_by,order,limit,p} = req.query


    Promise.all([fetchArticles(topic,sort_by,order,limit,p)])
    .then((result) => {
        res.status(200).send(result[0])
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