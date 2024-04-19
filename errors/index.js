const app = require("../app")

const psqlErrCodes = ['23503','22P02','23502','42703','42601','2201X','2201W']

exports.handlePsqlErrors = ((err, req, res, next) => {
    if(psqlErrCodes.includes(err.code)){
        res.status(400).send({msg: "Bad request"})
    }
    res.status(err.status).send({msg : err.msg})
    next(err)
})


exports.handleServerErrors = ((err, req, res, next) => {
    res.status(500).send({msg : "Internal server error"})
})