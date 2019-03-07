#!/usr/bin/env node

// to scaffold the project!

// ---------------------------------------------------------------
// CREATE DATABASE cds CHARACTER SET utf8 COLLATE utf8_persian_ci;


const mysql = require("mysql");
const cuid = require("cuid"); // use this to create a cuid in insertaion ops
const safe = require('../server/safe.js');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || null;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root';
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
    const errlog = (name) => (err, rows) => err ? console.log(name.toUpperCase()+">", err.sqlMessage) : console.log(name.toUpperCase()+">", "ok");



    // ================================ CANDO PAGES ============================================================================
    connection.query(`CREATE TABLE IF NOT EXISTS route (
        id INT AUTO_INCREMENT PRIMARY KEY,
        access INT,
        title TEXT NOT NULL,
        en_title TEXT NOT NULL,
        status TINYINT NOT NULL DEFAULT 0
    )ENGINE=INNODB;` ,[] ,(err, rows) =>{
        errlog("route")(err, rows)
        connection.query(`INSERT INTO route(id, access, title, en_title, status) VALUES(
            1,
            7,
            'مهاجرت به کانادا',
            'migratio to canada',
            1
        );` ,[] ,errlog("route"))
    });
    connection.query(`CREATE TABLE IF NOT EXISTS page (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT,
        tags TEXT,
        title VARCHAR(100) NOT NULL,
        en_title TEXT NOT NULL,
        cover TEXT,
        slug TEXT NOT NULL,
        en_slug TEXT NOT NULL,
        content TEXT NOT NULL,
        en_content TEXT NOT NULL,
        status TINYINT NOT NULL DEFAULT 0,
        comment TINYINT NOT NULL DEFAULt 0,
        cuid VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY title_key (title)
        )ENGINE=INNODB;` ,[] ,(err, rows) =>{
        errlog("page")(err, rows)
        if(!err) connection.query(`INSERT INTO page(route_id, tags, title, en_title, slug, en_slug, content, en_content, cuid) 
        VALUES(1, "govah,cando,certificate", 'گواه فارسی', 'english govah', 'persian_govah' ,'govah', 'govah e khoshgel', 'nice govah', ?);`, [cuid()], (err, rows) => {
            errlog("first page")(err, rows)
            if(!err) {
    // ============================================= COMMENT INIT SETUP ===============================================================
    // comment table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS comment (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        page_id INT,
        content TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        status TINYINT NOT NULL DEFAULT 0,
        cuid VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX post_ind (page_id),
        FOREIGN KEY (page_id)
            REFERENCES page(id)
            ON DELETE CASCADE)ENGINE=INNODB;` ,[] ,(err, rows) => {
                errlog("comment")(err, rows)
                if(!err)  connection.query(`INSERT INTO comment(page_id, content, name, email, cuid) VALUES(
                    1,
                    'این پست عالی است!',
                    'wilonion',
                    'ea_pain@yahoo.com',
                    ?
                );` ,[cuid()] ,errlog("first comment"))
            });
            }
        })
    });

    // ========================================= USER INIT SETUP ===================================================================
    // user table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS user (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname text NULL,
    lastname text NULL,
    email text NOT NULL,
    password text NOT NULL,
    access int NOT NULL DEFAULT '2',
    avatar text NULL
    )ENGINE=INNODB;` ,[] ,(err, rows)=>{
        errlog("user")(err, rows)
        // add account dev@cds.or.ir:dev with dev access (7)
        safe.hash("dev",(err, password) => {
            connection.query(`INSERT INTO user(id, email, password, access, firstname, lastname) VALUES(1, 'dev@cds.org.ir', ?, 7, 'dev', 'eloper')` ,[password] ,errlog("dev user"));
        });
    });

    // ========================================= APPLY INIT SETUP ===================================================================
    // apply table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS apply (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        description TEXT DEFAULT NULL,
        country TEXT DEFAULT NULL,
        university TEXT DEFAULT NULL,
        education_language TEXT NOT NULL,
        field TEXT DEFAULT NULL,
        cv TEXT DEFAULT NULL, 
        sop TEXT DEFAULT NULL,
        rc TEXT DEFAULT NULL,
        reg_date TEXT DEFAULT NULL,
        cuid VARCHAR(100) NOT NULL,
        status TINYINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX user_ind (user_id),
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE)ENGINE=INNODB;` ,[] ,(err, rows)=>{
            errlog("apply")(err, rows)
            connection.query(`INSERT INTO apply(user_id, description, country, university, education_language, field, cv, sop, rc, reg_date, cuid) VALUES(
                                    "2",
                                    "توضیحات اضافه اینجا....",
                                    "کانادا",
                                    "toronto",
                                    "انگلیسی",
                                    "cs",
                                    "دریافت شد",
                                    "دریافت شد",
                                    "در حال انجام",
                                    "1397-12-07",
                                    ?
            );` ,[cuid()] ,errlog("first apply"));
        });

    // ========================================= FORM INIT SETUP ===================================================================
    // form table
    //...
    connection.query(`CREATE TABLE IF NOT EXISTS forms (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        iframe TEXT NOT NULL,
        cuid VARCHAR(100) NOT NULL,
        status TINYINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)ENGINE=INNODB;` ,[] ,(err, rows)=>{
            errlog("form")(err, rows)
            connection.query(`INSERT INTO forms(name, iframe, cuid) VALUES(
                'cando form',
                '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc6sL9JIN2MfBJWyUinbzvVq4Nht1krsGFUzIDJK1_T0_bGmA/viewform?embedded=true" width="640" height="1112" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>',
                ?
            );` ,[cuid()] ,errlog("first form"));
        });
    
    // ========================================= FORM INIT SETUP ===================================================================
    // transactions table
    //...
    connection.query(`CREATE TABLE IF NOT EXISTS transactions (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        paid INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)ENGINE=INNODB;` ,[] ,(err, rows)=>{
            errlog("freetime")(err, rows)
        });

    // ========================================= FORM INIT SETUP ===================================================================
    // freetime table
    //...
    connection.query(`CREATE TABLE IF NOT EXISTS freetime (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        price INT NOT NULL,
        status TINYINT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)ENGINE=INNODB;` ,[] ,(err, rows)=>{
            errlog("freetime")(err, rows)
        });

    // ========================================= FORM INIT SETUP ===================================================================
    // reserve table
    //...
    connection.query(`CREATE TABLE IF NOT EXISTS reserve (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        freetime_id INT NOT NULL,
        transaction_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)ENGINE=INNODB;` ,[] ,(err, rows)=>{
            errlog("freetime")(err, rows)
        });

    // ========================================= DEV INIT SETUP ===================================================================
    // error table
    //...
    connection.query(`CREATE TABLE IF NOT EXISTS error (
        id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        msg text NULL,
        status int NULL
        )ENGINE=INNODB;` ,[] ,errlog("error"));
});
