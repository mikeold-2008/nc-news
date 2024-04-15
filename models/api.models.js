const fs = require('fs/promises')

function fetchApi(){

    return fs.readFile(`${__dirname}/../endpoints.json`,'utf-8')
    .then((fileContents) => {
        return JSON.parse(fileContents)
    })
}

module.exports = {fetchApi}