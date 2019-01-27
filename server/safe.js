const crypto = require('crypto');
const express = require('express')
module.exports = {
    hash(password, cb) {
        const salt = crypto.randomBytes(16).hexSlice()
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, dk) => cb(err, salt + dk.toString()))
    },
    compare(password, saltdk, cb) {
        const salt = saltdk.slice(0, 32);
        const dk = saltdk.slice(32);
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, sdk) => cb(err, sdk.toString() === dk))
    },
    page(root){
        return express.static(`${__dirname}/../www/${root}`)
    },
    private(req, res, next){
        //  commented for debugging
        // if(!req.user) return res.redirect("/login");
        next();
    },
    access(level) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return (req, res, next) => {
        if(!req.user) return res.redirect("/login");
        if(req.user.access < level) return res.status(403).end(); // don't have enogh permition!
        next();
    }
  }
}
