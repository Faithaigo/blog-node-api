const express = require('express')
const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed')

const app = express()

// app.use(bodyParser.urlencoded()) //x-www-form-urlenncoded requests

app.use(bodyParser.json())

/**
 * Set headers on any response that leaves the server (CORS)
 */
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*') //allow access from any domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, PATCH, DELETE') //allow specific http methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') //allow headers clients set
    next()
})

app.use('/feed', feedRoutes)

app.listen(8080)