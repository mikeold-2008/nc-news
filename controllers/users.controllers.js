const app = require("../app")
const {fetchUsers} = require("../models/users.models")

function getUsers(req,res,next){
    fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getUsers}