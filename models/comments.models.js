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


module.exports = {fetchCommentsByArticleId,insertComments}

