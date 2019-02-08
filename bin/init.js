#!/usr/bin/env node

// to scaffold the project!


const mysql = require("mysql");
const cuid = require("cuid"); // use this to create a cuid in insertaion ops
const safe = require('../server/safe.js');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || null;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Qwe%$[rty]*@;123'; // wildonion password
const DB_NAME = process.env.DB_NAME || 'cds';


const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
});

connection.connect(err => {
    if(err) return console.error(err);
    console.log(`database is connected to ${DB_USER}@${DB_HOST}/${DB_NAME}`);
    const errlog = (err, rows) => err ? console.log(err.sqlMessage) : console.log("ok");


    // ============================================================================================================
    // post table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS post (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    en_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    en_content TEXT NOT NULL,
    tags JSON NOT NULL,
    en_tags JSON NOT NULL,
    status TINYINT NOT NULL DEFAULT 0,
    slug TEXT NOT NULL,
    en_slug TEXT NOT NULL,
    cuid VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cover blob NULL)ENGINE=INNODB;` ,[] ,(err, rows) => {
        if(err) errlog(err, rows)
        else connection.query(`INSERT INTO post(title, en_title, content, en_content, tags, en_tags, slug, en_slug, cuid) VALUES(
            'اوین پست',
            'first post',
            'این اولین پست است',
            'this is the first post',
            JSON_ARRAY('ویزا', 'کانادا'),
            JSON_ARRAY('visa', 'canada'),
            'اولین-پست',
            'first-post',
            ?
        );` ,[cuid()] ,errlog);
    });
    
    // ------------------------------------------------------------
    // comment table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS comment (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    post_id INT,
    content TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0,
    cuid VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX post_ind (post_id),
    FOREIGN KEY (post_id)
        REFERENCES post(id)
        ON DELETE CASCADE)ENGINE=INNODB;` ,[] ,(err, rows) => {
            if(err) errlog(err, rows)
            else connection.query(`INSERT INTO comment(post_id, content, name, email, cuid) VALUES(
                '1',
                'این پست عالی است!',
                'wilonion',
                'ea_pain@yahoo.com',
                ?
            );` ,[cuid()] ,errlog)
        });

    // ============================================================================================================
    // user table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS user (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname text NULL,
    lastname text NULL,
    email text NOT NULL,
    password text NOT NULL,
    access int NOT NULL DEFAULT '2',
    avatar blob NULL
    )ENGINE=INNODB;` ,[] ,(err, rows)=>{
        if(err) errlog(err, rows)
        // add account dev@cds.or.ir:dev with dev access (7)
        else safe.hash("dev",(err, password) => {
            connection.query(`INSERT INTO user(id, email, password, access, firstname, lastname) VALUES(1, 'dev@cds.org.ir', ?, 7, 'dev', 'eloper')` ,[password] ,errlog);
        });
    });
});
