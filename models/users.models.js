const db = require("../db/connection");


function fetchUsers(){

return db.query("SELECT * FROM users")
.then((result) => {
return result.rows;
});

}

function fetchUserById(id){
    const {username} = id

    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
      if(result.rows.length === 0){
        return Promise.reject({status: 404, msg:"Not found"})
      }
      return result.rows[0];
    });
}

module.exports = {fetchUsers,fetchUserById}