const app = require("../app")
const {fetchArticleById} = require("../models/articles.models")

function getArticleById(req,res,next){

    const id = req.params
    fetchArticleById(id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch(next)
}   

module.exports={getArticleById}