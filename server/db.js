
const safe = require('./safe.js');

const db = {
    connection: null,
    api: {
        /* --------------------
            SERVER API
        */
        server: {
            error: {
                add(error, cb) {
                    // status : 1 fresh, 2 seen, 3 solved
                    db.connection.query(`INSERT INTO error(msg, status) VALUES(?, 1)`, [error], cb ? cb : e=>e);
                },
                handled(errorId, cb) {
                    db.connection.query(`UPDATE error SET status = 3 WHERE id = ?`, [errorId], cb ? cb : e=>e);
                },
                seen(errorId, cb) {
                    db.connection.query(`UPDATE error SET status = 2 WHERE id = ?`, [errorId], cb ? cb : e=>e);
                },
                list(cb) {
                    db.connection.query(`SELECT * FROM error`, [], cb);
                },
            }
        },
        /* --------------------
            USER API
        */
        user: {
            all(cb) { // cb(err, user)
                db.connection.query(`SELECT * FROM user`, [], cb);
            },
            getById(id, cb) { // cb(err, user)
                db.connection.query(`SELECT * FROM user WHERE id = ?`, [id], (err, rows) => {
                    if(rows.length === 1) {
                        return cb(err, rows[0]);
                    } else {
                        return cb(err, false);
                    }
                });
            },
            getByEmailPass(email, password, cb) { // callback with email and password from our form
                db.connection.query("SELECT * FROM `user` WHERE `email` = ?", [email], function (err, rows) {
                    if (err)
                        return cb(err);
                    if (!rows.length) {
                        return cb(null, false);
                    }
                    // hash function appends the 'salt' to the 'hash' so we dont need to store the salt.
                    safe.compare(password, rows[0].password, function(err, res) {
                        if(res) {
                            // Passwords match
                            return cb(null, rows[0]);
                        } else{
                            // Passwords don't match
                            return cb(err, false);
                        }
                    })
                });
            },
            add(email, password, cb) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                db.connection.query("SELECT * FROM user WHERE email = ?", [email], function (err, rows) {
                    if (err)
                        return cb(err);
                    if (rows.length) {
                        return cb(null, false);
                    } else {
                        // if there is no user with that email
                        // create the user
                        safe.hash(password, function(err, saltdk) {
                            // saltdk contains the salt and hash (salt + hash) so we dont need to store salt
                            // Store saltdk in database
                            db.connection.query("INSERT INTO user ( email, password, access ) values ( ?, ?, 2 )", [email, saltdk], function (err, rows) {
                                db.connection.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
                                    return cb(null, rows[0]);
                                })
                           }) 
                        });
                    }
                });
            },
            update(user ,cb) {
                db.connection.query(`UPDATE user SET email = ?, firstname = ?, lastname = ?, access = ? WHERE id = ?`, [user.email,user.firstname,user.lastname,parseInt(user.access),user.id], cb);
            },
            password(id, password ,cb) {
                safe.hash(password, function(err, saltdk) {
                    db.connection.query(`UPDATE user SET password = ? WHERE id = ?`, [saltdk, id], cb);
                })
            },
            changeAvatar(id, avatar, cb) {
                db.connection.query(`UPDATE user SET avatar = ? WHERE id = ?`, [avatar, id], cb);
            },
            remove(id, cb) {
                db.connection.query(`DELETE FROM user WHERE id = ?`, [id], cb);
            },
            changePassword(id, pass, cb) {
                safe.hash(pass, function(err, saltdk) {
                    db.connection.query("UPDATE user SET password = ? WHERE id = ?", [saltdk, id], cb);
                });
                
            },
        },
        /* --------------------
            COMMENTS API
            TODO :
                https://stackoverflow.com/questions/7296846/how-to-implement-one-to-one-one-to-many-and-many-to-many-relationships-while-de
                https://www.w3schools.com/sql/sql_join.asp
        */
        comment: {
            getAllRelToAPost(post_id, cb){
                // TODO use mysql join method
            },
            getById(id, cb){

            },
            getByCuid(cuid, cb){

            },
            getAll(cb){
                db.connection.query(`SELECT * FROM comment`, [], (err, rows)=>{
                    if(rows.length >= 1) {
                        return cb(err, rows);
                    } else {
                        return cb(err, false);
                    }
                });
            },
            deleteByCuid(cuid, cb){
                db.connection.query(`DELETE FROM comment WHERE cuid = ?`, [cuid], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            deleteById(id, cb){
                db.connection.query(`DELETE FROM comment WHERE id = ?`, [id], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            deleteAll(cb){
                db.connection.query(`DELETE * FROM comment`, [], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            block(cuid, cb){
                db.connection.query(`UPDATE comment SET status = 0 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            unblock(cuid, cb){
                db.connection.query(`UPDATE comment SET status = 1 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            add(comment, cb){

            },
            update(comment, cb){

            },
        },
        /* ---------------------------------------------
            MIGRATION CONSULTANCY & LANGUAGE COURSES API
            TODO : 
                https://stackoverflow.com/questions/7296846/how-to-implement-one-to-one-one-to-many-and-many-to-many-relationships-while-de
                https://www.w3schools.com/sql/sql_join.asp
        */
        mc_lc:{
            getAllRerlToAbroad(abroad_id, cb){
                 
            },
            getById(id, cb){

            },
            getByCuid(cuid, cb){

            },
            getAll(cb){
                db.connection.query(`SELECT * FROM mc_lc`, [], (err, rows)=>{
                    if(rows.length >= 1) {
                        return cb(err, rows);
                    } else {
                        return cb(err, false);
                    }
                });
            },
            block(cuid, cb){
                db.connection.query(`UPDATE mc_lc SET status = 0 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            unblock(cuid, cb){
                db.connection.query(`UPDATE mc_lc SET status = 1 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            deleteByCuid(cuid, cb){
                db.connection.query(`DELETE FROM mc_lc WHERE cuid = ?`, [cuid], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            deleteById(id, cb){
                db.connection.query(`DELETE FROM mc_lc WHERE id = ?`, [id], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            deleteAll(cb){
                db.connection.query(`DELETE * FROM mc_lc`, [], (err, results, fields)=>{
                    if(results){ // found one !
                        return cb(err, results.affectedRows, fields)
                    } else{ // delete nothing!
                        return cb(err, false, false)
                    }
                });
            },
            add(mclc, cb){

            },
            update(mclc, cb){
                
            }

            
        },
        /* -----------------
            ABROAD API
        */
        abroad:{
            add(abroad, cb){

            },
            getAll(cb){

            },
            getById(id, cb){

            },
            getByCuid(cuid, cb){

            },
            deleteAll(cb){

            },
            deleteByCuid(cuid, cb){

            },
            deleteById(id, cb){

            },
            block(cuid, cb){
                db.connection.query(`UPDATE abroad SET status = 0 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            unblock(cuid, cb){
                db.connection.query(`UPDATE abroad SET status = 1 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            update(abroad, cb){

            }

        },
        /* -----------------
            CERT API
        */
       cert:{
            getAll(cb){
                db.connection.query(`SELECT * FROM cert`, [], (err, rows)=>{
                    if(rows.length >= 1) {
                        return cb(err, rows);
                    } else {
                        return cb(err, false);
                    }
                });
            },
            getById(id, cb){

            },
            getByCuid(cuid, cb){

            },
            delete(id, cb){

            },
            update(id, cb){

            },
            block(cuid, cb){
                db.connection.query(`UPDATE cert SET status = 0 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
            unblock(cuid, cb){
                db.connection.query(`UPDATE cert SET status = 1 WHERE cuid = ?`, [cuid], cb ? cb : e=>e);
            },
       },

    }
}

module.exports = db;