#!/usr/bin/env node

const mysql = require('mysql')

var connection = mysql.createConnection({
    host: "force1267.mysql.pythonanywhere-services.com",
    username: "force1267",
    password: "12672551",
    database: "cds"
})

connection.connect(err => {
    if(err) {
        return console.error(err);
    }
    connection.query(process.argv[2], console.log)
});

