const app = require("../app")


exports.handlePsqlErrors = ((err, req, res, next) => {
    if(err.code==='23503' || err.code==='22P02' || err.code==='23502'){
        res.status(400).send({msg: "Bad request"})
    }
    res.status(err.status).send({msg : err.msg})
    next(err)
})


exports.handleServerErrors = ((err, req, res, next) => {
    res.status(500).send({msg : "Internal server error"})
})