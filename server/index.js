const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const api = require('./api.js')
const db = require("./db.js");
const auth = require("./auth.js");


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser());
app.use(cookieSession({
    name: "session",
    keys: [
        // node -e "for(i of [0,0,0])(e=>console.log(`'${e}',`))(crypto.randomBytes(32).hexSlice())"
        // get from process.env at production
        // '0dd0d400ca0e81676567c562cc9395c7af6db06c9a03a12b7ca4fc3bb2ea42ac',
        // '295ec487d6f1c6ee8be025c67f0eaa3c559a5e619ccd64c8f052f38678d7ab2d',
        // 'd89f15fdf2a348a74a6b8eceafdd58a656009873871fcf0efd78700cfc8e440f',
        process.env.SECRET
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hrs
}));

auth({app, db})
api({app, db})

module.exports = { app, db }