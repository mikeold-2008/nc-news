const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");


function fetchArticleById(id){
    const {article_id} = id
    if(/^\d+$/.test(article_id) === false){
        return Promise.reject({status: 400, msg:"Bad request"})
    }

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg:"Couldn't find requested article"})
      }
      return result.rows[0];
    });
}


function checkArticleExists(article_id){

  if(/^\d+$/.test(article_id) === false){
    return Promise.reject({status: 400, msg:"Invalid article ID"})
  }

  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then((result) => {
    if(result.rows.length === 0){
      return Promise.reject({status: 404, msg: "Article ID not found"})
    }
  })
}


function fetchArticles(){

  let sqlQueryString = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id  ORDER BY articles.created_at DESC'

  return db.query(sqlQueryString, [])
    .then((result) => {
      return result.rows;
    });

}

function updateArticle(article_id,newVoteTotal){

  return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *', [newVoteTotal,article_id])
  .then((result) => {
    return result.rows[0];
  })
}


function getVoteCount(article_id){
  const id = article_id;

  return db.query('SELECT votes FROM articles WHERE article_id = $1', [id])
  .then((result) => {
    return result.rows[0]; 
  })

}


module.exports={fetchArticleById, fetchArticles, checkArticleExists,updateArticle,getVoteCount}