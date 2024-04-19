const db = require("../db/connection")


function fetchCommentsByArticleId(article_id,limit=10,p=1){

    let sqlQueryString = 'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC'

    const getTotal = db.query(sqlQueryString, [article_id]);

    sqlQueryString+=` LIMIT ${limit} OFFSET ${(p - 1) * limit}`;

    const getComments = db.query(sqlQueryString,[article_id])


    return Promise.all([getComments,getTotal])
    .then((result) => {
      const comments = result[0].rows;
      const total_count = result[1].rowCount;
      if(comments.length===0){
          return Promise.reject({status: 404, msg:"Not found"})
      }
      return { comments, total_count };
    });

}









function insertComments(username,body,article_id){

    let sqlQueryString = 'INSERT INTO comments (article_id,author,body) VALUES ($1, $2, $3) RETURNING *'

    return db.query(sqlQueryString,[article_id,username,body])
    .then((result) => {
        return result.rows[0]
    })
}


function removeCommentById(comment_id){
    let sqlQueryString = 'DELETE FROM comments WHERE comment_id = $1 RETURNING *'

    return db.query(sqlQueryString,[comment_id])
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

