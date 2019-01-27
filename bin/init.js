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
    const errlog = (err, rows) => err ? console.log(err.sqlMessage) : console.log(".");
    // TODO make init queries

    /* -------------------------
       [ insertion / creation ]
    
        // db creation...
    // connection.query(`CREATE SCHEMA ${DB_NAME} DEFAULT CHARACTER SET utf8 COLLATE utf8_persian_ci ;`)
    */


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
        else connection.query(`INSERT INTO post VALUES(
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
        ON DELETE CASCADE)ENGINE=INNODB;` ,[] ,errlog);


    // ============================================================================================================
    // user table
    // ...
    // ------------------------------------
    // create the password in node terminal
    // ------------------------------------
    //   > salt = crypto.randomBytes(16).toString('hex')
    //   '4f52181f71ece28a5fad7feae112ecc9'
    //   > pswd = crypto.pbkdf2Sync('wildonion', salt, 10000, 512, 'sha512').toString('hex')
    //   '6657e4aede417fd0acbd2934a8b1a5f5c37875ddcc6d06e26bcb186cfa05049cba8b3f7ca704bc2a9ede209572bd10e42620e435cbac1e1438eb014c5d6795d5b32658c96b216c60e69bdecd566410433d215147d424103285dd0f8244829fbd53fe3188bdbfb5f3fe63edc37cb50e04a7a04623cc24e7047ee8b552385ce129292f980f6d74bc98bdc2f4b28835a2782a4f6437c42a0ab0433ef372d53c80c44923c26881bb8624addaa2bf28dfac2b1bbc2e2630b19effb9d942c722c1fd22586c37f525a174f96bd02ebcff92efdaf78c0991ae9a47f055258a547c8bf1c2ee4aeb48d5a4b007edf0a280f401b556cab135712fecfe19d3e42bdc825f95d9d9a6a7f17fdcaf0edd062e82d602c8361582b4841cb13d1bc5bdc040a759b7feb7187f8949a79352a8b793b6f9402e001117ffab4c1bf4c41af24bd55a441a3d8a1e4d22d218c635b352aea693e0a327f4f01e655b7bb7ff7138f16ca328bbaa8a2ef219967d50144636e4ceed84b08c7c36bd0fc2c174a8df5cbb5a18b9ca5fe36143504f5c0cac9587382b8db1e80064445e9394b065cee469c419b85b6bbb77a4c0f9e92c3264dd789bb90647e1bef07aa39bb8f735e3ee31f8db7baa4123a88afb054eedd7bf8514759c84d98464ac2f7532a28244dee5e727ccc181bb6f5a8c9e9bd0d9b5f22ff41bc6522bcd7623210577fde0ec60de6119fad21f5984'
    //   > hash = pswd.concat('.', salt)
    //   '6657e4aede417fd0acbd2934a8b1a5f5c37875ddcc6d06e26bcb186cfa05049cba8b3f7ca704bc2a9ede209572bd10e42620e435cbac1e1438eb014c5d6795d5b32658c96b216c60e69bdecd566410433d215147d424103285dd0f8244829fbd53fe3188bdbfb5f3fe63edc37cb50e04a7a04623cc24e7047ee8b552385ce129292f980f6d74bc98bdc2f4b28835a2782a4f6437c42a0ab0433ef372d53c80c44923c26881bb8624addaa2bf28dfac2b1bbc2e2630b19effb9d942c722c1fd22586c37f525a174f96bd02ebcff92efdaf78c0991ae9a47f055258a547c8bf1c2ee4aeb48d5a4b007edf0a280f401b556cab135712fecfe19d3e42bdc825f95d9d9a6a7f17fdcaf0edd062e82d602c8361582b4841cb13d1bc5bdc040a759b7feb7187f8949a79352a8b793b6f9402e001117ffab4c1bf4c41af24bd55a441a3d8a1e4d22d218c635b352aea693e0a327f4f01e655b7bb7ff7138f16ca328bbaa8a2ef219967d50144636e4ceed84b08c7c36bd0fc2c174a8df5cbb5a18b9ca5fe36143504f5c0cac9587382b8db1e80064445e9394b065cee469c419b85b6bbb77a4c0f9e92c3264dd789bb90647e1bef07aa39bb8f735e3ee31f8db7baa4123a88afb054eedd7bf8514759c84d98464ac2f7532a28244dee5e727ccc181bb6f5a8c9e9bd0d9b5f22ff41bc6522bcd7623210577fde0ec60de6119fad21f5984.4f52181f71ece28a5fad7feae112ecc9'
    //   > salt = hash.split(".")[1]
    //   '4f52181f71ece28a5fad7feae112ecc9'
    //   > middlehash = hash.split(".")[0]
    //   '6657e4aede417fd0acbd2934a8b1a5f5c37875ddcc6d06e26bcb186cfa05049cba8b3f7ca704bc2a9ede209572bd10e42620e435cbac1e1438eb014c5d6795d5b32658c96b216c60e69bdecd566410433d215147d424103285dd0f8244829fbd53fe3188bdbfb5f3fe63edc37cb50e04a7a04623cc24e7047ee8b552385ce129292f980f6d74bc98bdc2f4b28835a2782a4f6437c42a0ab0433ef372d53c80c44923c26881bb8624addaa2bf28dfac2b1bbc2e2630b19effb9d942c722c1fd22586c37f525a174f96bd02ebcff92efdaf78c0991ae9a47f055258a547c8bf1c2ee4aeb48d5a4b007edf0a280f401b556cab135712fecfe19d3e42bdc825f95d9d9a6a7f17fdcaf0edd062e82d602c8361582b4841cb13d1bc5bdc040a759b7feb7187f8949a79352a8b793b6f9402e001117ffab4c1bf4c41af24bd55a441a3d8a1e4d22d218c635b352aea693e0a327f4f01e655b7bb7ff7138f16ca328bbaa8a2ef219967d50144636e4ceed84b08c7c36bd0fc2c174a8df5cbb5a18b9ca5fe36143504f5c0cac9587382b8db1e80064445e9394b065cee469c419b85b6bbb77a4c0f9e92c3264dd789bb90647e1bef07aa39bb8f735e3ee31f8db7baa4123a88afb054eedd7bf8514759c84d98464ac2f7532a28244dee5e727ccc181bb6f5a8c9e9bd0d9b5f22ff41bc6522bcd7623210577fde0ec60de6119fad21f5984'
    //   > status = crypto.pbkdf2Sync('wildonion', salt, 10000, 512, 'sha512').toString('hex') === middlehash ? true : false
    //   true
    connection.query(`CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname text NULL,
    lastname text NULL,
    email text NOT NULL,
    password text NOT NULL,
    access int NOT NULL DEFAULT '2',
    avatar blob NULL
    );` ,[] ,(err, rows)=>{
        if(err) errlog(err, rows)
        // add account dev@cds.or.ir:dev with dev access (7)
        else safe.hash("dev",(err, password) => {
            connection.query(`INSERT INTO user(id, email, password, access) VALUES(1, 'dev@cds.org.ir', ?, 7)` ,[password] ,errlog);
        });
    });
});
