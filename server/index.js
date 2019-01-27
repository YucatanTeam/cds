const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const helmet = require('helmet');

const api = require('./api.js')
const db = require("./db.js");
const auth = require("./auth.js");


const app = express()

app.use(helmet())

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, x-access-token')
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    }
    else {
      next()
    }
})
  

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieSession({
    name: "session",
    keys: [
        process.env.SECRET || 'force'//require('crypto').randomBytes(32).hexSlice()
    ],
    maxAge: 1 * 60 * 60 * 1000, // 24 hrs
}));

auth({app, db})
api({app, db})

module.exports = { app, db }