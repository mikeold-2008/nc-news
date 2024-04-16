const db = require("../db/connection")


function fetchCommentsByArticleId(article_id){

    let sqlQueryString = 'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC'

    return db.query(sqlQueryString, [article_id])
    .then((result) => {
    return result.rows;
    });
}


module.exports = {fetchCommentsByArticleId}

