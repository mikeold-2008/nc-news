const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");


function fetchArticleById(id){
    const {article_id} = id

    let sqlQueryString = 'SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY created_at DESC'

    return db.query(sqlQueryString, [article_id])
    .then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg:"Not found"})
      }
      return result.rows[0];
    });
}


function checkArticleExists(article_id){

  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then((result) => {
    if(result.rows.length === 0){
      return Promise.reject({status: 404, msg: "Not found"})
    }
  })
}









function fetchArticles(topic,sort_by = "created_at",order = "desc",limit=10,p=1){
  const queryVals = []
  const validSortQueries = ["article_id","title","topic","author","created_at","votes"]
  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }


  let sqlQueryString = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id '

  if(topic){
    sqlQueryString+='WHERE topic = $1 '
    queryVals.push(topic)
  }
  
  sqlQueryString+=`GROUP BY articles.article_id 
  ORDER BY articles.${sort_by} ${order}`

  const getTotal = db.query(sqlQueryString, queryVals);

  sqlQueryString+=` LIMIT ${limit} OFFSET ${(p - 1) * limit}`;

  const getArticles = db.query(sqlQueryString,queryVals)

  return Promise.all([getArticles,getTotal])
  .then((result) => {
    const articles = result[0].rows;
    const total_count = result[1].rowCount;
    if(articles.length===0){
        return Promise.reject({status: 404, msg:"Not found"})
    }
    return { articles, total_count };
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