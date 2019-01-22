const db = {
    connection: null,
    api: {
        test(cb) {
            cb(db.connection);
        },
        getAllUsers(cb) { // cb(err, user)
            db.all(`SELECT * FROM user`, [], cb);
        },
        getUserById(id, cb) { // cb(err, user)
            db.all(`SELECT * FROM user WHERE id = ?`, [id], (err, rows) => {
                if(rows.length === 1) {
                    cb(err, rows[0]);
                } else {
                    cb(err, false);
                }
            });
        },
        getUserByUserPass(user, pass, cb) { // cb(err, user)
            db.all(`SELECT * FROM user WHERE username = ? AND password = ?`, [user, pass], (err, rows) => {
                if(rows.length === 1) {
                    cb(err, rows[0]);
                } else {
                    cb(err, false);
                }
            });
        },
        addUser(user ,cb) {
            db.all(`INSERT INTO user(firstname, lastname, username, phone, access, password) VALUES (?,?,?,?,?,?)`, [user.firstname,user.lastname,user.username,user.phone,parseInt(user.access),user.password], cb);
        },
        editUser(user ,cb) {
            db.all(`UPDATE user SET firstname = ?, lastname = ?, username = ?, phone = ?, access = ?, password = ? WHERE id = ?`, [user.firstname,user.lastname,user.username,user.phone,parseInt(user.access),user.password,user.id], cb);
        },
        deleteUser(id, cb) {
            db.all(`DELETE FROM user WHERE id = ?`, [id], cb);
        },
        changePassword(id, pass, cb) {
            db.all("UPDATE user SET password = ? WHERE id = ?", [pass, id], cb);
        },
        searchPatient(key, cb) {
            // var keys = key.split(' ').filter(k => k !== '');
            if(key[0] == "@") {
                key = key.split(' ')[0].slice(1);
                db.all(`SELECT * FROM "pts" WHERE id LIKE ?`, [key], cb);
            } else {
                key += "%";
                db.all(`SELECT * FROM "pts" WHERE
                    id LIKE ? OR
                    meli LIKE ? OR
                    lastname LIKE ? OR
                    firstname LIKE ?`, [key, key, key, key], cb);
            }
            
        },
        getPshape(cb) {
            db.all(`SELECT * FROM struct WHERE name = 'patient_data'`, [], cb);
        },
        setPshape(ps, cb) {
            db.all(`UPDATE struct SET shape = ? WHERE name = 'patient_data'`, [ps], cb);
        },
        getPatient(id, cb) {
            db.all(`SELECT * FROM pts WHERE id = ?`, [id], cb);
        },
        addPatient(pat ,cb) {
            db.all(`INSERT INTO pts(firstname, lastname, meli, phone, gender, data) VALUES (?,?,?,?,?,?)`, [pat.firstname,pat.lastname,pat.meli,pat.phone,pat.gender,pat.data], cb);
        },
        editPatient(pat ,cb) {
            db.all(`UPDATE pts SET firstname = ?, lastname = ?, meli = ?, phone = ?, gender = ?, data = ? WHERE id = ?`, [pat.firstname,pat.lastname,pat.meli,pat.phone,pat.gender,pat.data,pat.id], cb);
        },
        deletePatient(id, cb) {
            db.all(`DELETE FROM pts WHERE id = ?; DELETE FROM visit WHERE pid = ?`, [id, id], cb);
        },
        getVisit(pid ,cb) {
            db.all(`SELECT * FROM visit WHERE pid = ?`, [pid], cb);
        },
        addVisit(pid, data, cb) {
            db.all(`INSERT INTO visit VALUES(?, datetime('now'), ?)`, [pid, data], cb);
        }
    }
}

module.exports = db;