const crypto = require('crypto');
module.exports = {
    hash(password, cb) {
        const salt = crypto.randomBytes(16).hexSlice()
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, dk) => cb(err, salt + dk.toString()))
    },
    compare(password, saltdk, cb) {
        const salt = saltdk.slice(0, 32);
        const dk = saltdk.slice(32);
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, sdk) => cb(err, sdk.toString() === dk))
    }
}