const app = require("../app")
const {fetchApi} = require("../models/api.models")

function getApi(req,res,next){
    fetchApi()
    .then((result) => {
        res.status(200).send(result)
    })
    .catch(next)
}

module.exports = {getApi}