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
        getUserByUserPass(user, pass, cb) { // cb(err, user)
            db.connection.query(`SELECT * FROM user WHERE username = ? AND password = ?`, [user, pass], (err, rows) => {
                if(rows.length === 1) {
                    cb(err, rows[0]);
                } else {
                    cb(err, false);
                }
            });
        },
        addUser(user ,cb) {
            db.connection.query(`INSERT INTO user(firstname, lastname, username, phone, access, password) VALUES (?,?,?,?,?,?)`, [user.firstname,user.lastname,user.username,user.phone,parseInt(user.access),user.password], cb);
        },
        editUser(user ,cb) {
            db.connection.query(`UPDATE user SET firstname = ?, lastname = ?, username = ?, phone = ?, access = ?, password = ? WHERE id = ?`, [user.firstname,user.lastname,user.username,user.phone,parseInt(user.access),user.password,user.id], cb);
        },
        deleteUser(id, cb) {
            db.connection.query(`DELETE FROM user WHERE id = ?`, [id], cb);
        },
        changePassword(id, pass, cb) {
            db.connection.query("UPDATE user SET password = ? WHERE id = ?", [pass, id], cb);
        }
    }
}

module.exports = db;