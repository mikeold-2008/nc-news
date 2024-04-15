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
        return Promise.reject({status: 404, msg:"couldn't find requested article"})
      }
      return result.rows[0];
    });



}

module.exports={fetchArticleById}