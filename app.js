const express = require("express")
const cors = require('cors');
const app = express()
const {handlePsqlErrors,handleServerErrors} = require('./errors/index.js');
const apiRouter = require('./routes/api-router.js');
const articlesRouter = require("./routes/articles-router.js")
const commentsRouter = require("./routes/comments-router.js")
const usersRouter = require("./routes/users-router.js")
const topicsRouter = require("./routes/topics-router.js")


app.use(cors());

app.use(express.json())

app.use('/api', apiRouter)

app.use('/api/articles', articlesRouter)

app.use('/api/comments',commentsRouter)

app.use('/api/users',usersRouter)

app.use('/api/topics', topicsRouter)

app.get('*',(req,res) => {
    res.status(404).send({msg : "Not found"})
})

app.use(handlePsqlErrors);

app.use(handleServerErrors)



module.exports = app;