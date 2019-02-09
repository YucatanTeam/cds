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


    // ============================================== POST INIT SETUP ==============================================================
    // post table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS post (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title TEXT NOT NULL,
    en_title TEXT NOT NULL,
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
    
    // ============================================= COMMENT INIT SETUP ===============================================================
    // comment table
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS comment (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    post_id INT,
    content TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
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

    // ================================ ABROAD CONTROL CENTER INIT SETUP ============================================================================
    // SCHEME-EXPLANATION :
    //      some tabs have the same structure like migration consultancy
    //      and language courses; so our job is to organize them in such 
    //      a way that there are no two tabs be in conflict(avoid repeating) 
    //      together. in order to do that we need to normalize our db like following:
    //      because these tabs are in common with their structure like slug, tags and content
    //      so we have to create a mc_lc table to store all posts about these tabs;
    //      something we should know is that, these tabs have their own title and abroad country,
    //      some of their posts are in common with country name and title with each other but their slug and content are different. 
    //      so again to normalize our db we should create a table called abroad to store our abroad countries
    //      and their related tabs title. finally we'll put the abroad primary key as a foreign key
    //      reference in our mc_lc table.
    // ...
    

    // abroad table
    // all abroad countries and their tab title !
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS abroad (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country_name TEXT NOT NULL,
        country_en_name TEXT NOT NULL,
        title TEXT NOT NULL,
        en_title TEXT NOT NULL,
        cuid VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    
    )ENGINE=INNODB;` ,[] ,(err, rows) =>{
        if(err) errlog(err, rows)
        else connection.query(`INSERT INTO abroad(country_name, country_en_name, title, en_title, cuid) VALUES(
            'کانادا',
            'canada',
            'مهاجرت به کانادا',
            'migratio to canada',
            ?
        );` ,[cuid()] ,errlog)
    });

    // migration consultancy and language courses table content
    // all langs courses tabs(contents) related to a abroad !
    // all migration consultancy tabs(contents) related to a abroad !
    // ...
    connection.query(`CREATE TABLE IF NOT EXISTS mc_lc (
        id INT AUTO_INCREMENT PRIMARY KEY,
        abroad_id INT,
        slug TEXT NOT NULL,
        en_slug TEXT NOT NULL,
        content TEXT NOT NULL,
        en_content TEXT NOT NULL,
        tags JSON NOT NULL,
        en_tags JSON NOT NULL,
        status TINYINT NOT NULL DEFAULT 0,
        cuid VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX abroad_ind (abroad_id),
        FOREIGN KEY (abroad_id)
            REFERENCES abroad(id)
                ON DELETE CASCADE)ENGINE=INNODB;` ,[] ,(err, rows) =>{
        if(err) errlog(err, rows)
        else connection.query(`INSERT INTO mc_lc(abroad_id, slug, en_slug, content, en_content, tags, en_tags, cuid) VALUES(
            '1',
            'نظام-آموزشی-کانادا',
            'Canadian-Education-System',
            'نظام تحصيلي در سرتاسر كانادا از استاندارد بسيار بالائي برخوردار مي‌باشد.',
            'ckeditor content goes here ...',
            JSON_ARRAY('نظام آموزشی', 'کانادا'),
            JSON_ARRAY('education system', 'canada'),
            ?
        );`, [cuid()], errlog)
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
        if(err) errlog(err, rows)
        // add account dev@cds.or.ir:dev with dev access (7)
        else safe.hash("dev",(err, password) => {
            connection.query(`INSERT INTO user(id, email, password, access, firstname, lastname) VALUES(1, 'dev@cds.org.ir', ?, 7, 'dev', 'eloper')` ,[password] ,errlog);
        });
    });
});
