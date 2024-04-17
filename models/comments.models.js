const db = require("../db/connection")


function fetchCommentsByArticleId(article_id){

    let sqlQueryString = 'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC'

    return db.query(sqlQueryString, [article_id])
    .then((result) => {
    return result.rows;
    });
}


function insertComments(username,body,article_id){

    if(!username || !body || !article_id){
        return Promise.reject({status: 400, msg:"Missing required information"})
    }

    let sqlString = 'INSERT INTO comments (article_id,author,body) VALUES ($1, $2, $3) RETURNING *'

    return db.query(sqlString,[article_id,username,body])
    .then((result) => {
        return result.rows[0]
    })
}


function removeCommentById(comment_id){
    let sqlString = 'DELETE FROM comments WHERE comment_id = $1 RETURNING *'

    return db.query(sqlString,[comment_id])
    .then((result) => {
        return result.rows[0]
    })
}


function checkCommentExists(comment_id){

    return db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
    .then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Not found"})
      }
    })
  }





module.exports = {fetchCommentsByArticleId,insertComments, removeCommentById,checkCommentExists}

