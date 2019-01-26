const bcrypt = require('bcrypt');

const db = {
    connection: null,
    api: {
        getAllUsers(cb) { // cb(err, user)
            db.connection.query(`SELECT * FROM user`, [], cb);
        },
        getUserById(id, cb) { // cb(err, user)
            db.connection.query(`SELECT * FROM user WHERE id = ?`, [id], (err, rows) => {
                if(rows.length === 1) {
                    cb(err, rows[0]);
                } else {
                    cb(err, false);
                }
            });
        },
        getUserByEmailPass(email, password, cb) { // callback with email and password from our form
            console.log(`finding ${email}:${password}`)
            db.connection.query("SELECT * FROM `user` WHERE `email` = ?", [email], function (err, rows) {
                console.log(`found rows`, rows)
                if (err)
                    return cb(err);
                if (!rows.length) {
                    return cb(null, false);
                }
                console.log(`no errors`)
                // bcrypt appends the 'salt' to the 'hash' so we dont need to store the salt.
                bcrypt.compare(password, rows[0].password, function(err, res) {
                    if(res) {
                        // Passwords match
                        console.log(`password match`)
                        return cb(null, rows[0]);
                    } else {
                        // Passwords don't match
                        console.log(`wrong password`)
                        return cb(null, false);
                    }
                });
            });
        },
        addUser(email, password, cb) {
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
                    var newUserMysql = {}

                    newUserMysql.email = email;

                    bcrypt.hash(password, 10, function(err, hash) {
                        // hash contains the salt (salt.hash) so we dont need to store salt
                        // Store hash in database
                        var insertQuery = "INSERT INTO users ( email, password, access ) values ( ?, ?, 2 )";
                        db.connection.query(insertQuery, [email, hash], function (err, rows) {
                            newUserMysql.id = rows.insertId;
                            return cb(null, newUserMysql);
                        });
                    });
                    
                }
            });
        },
        editUser(user ,cb) {
            var password = user.password;
            bcrypt.hash(password, 10, function(err, hash) {
                user.password = hash;
                db.connection.query(`UPDATE user SET firstname = ?, lastname = ?, username = ?, phone = ?, access = ?, password = ? WHERE id = ?`, [user.firstname,user.lastname,user.username,user.phone,parseInt(user.access),user.password,user.id], cb);
            });
        },
        deleteUser(id, cb) {
            db.connection.query(`DELETE FROM user WHERE id = ?`, [id], cb);
        },
        changePassword(id, pass, cb) {
            bcrypt.hash(pass, 10, function(err, hash) {
                db.connection.query("UPDATE user SET password = ? WHERE id = ?", [hash, id], cb);
            });
            
        }
    }
}

module.exports = db;