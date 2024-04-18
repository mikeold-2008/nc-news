const app = require("../app")
const {fetchUsers,fetchUserById} = require("../models/users.models")

function getUsers(req,res,next){
    fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}


function getUserById(req,res,next){
    const id = req.params;

    fetchUserById(id).then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })

}

module.exports = {getUsers,getUserById}