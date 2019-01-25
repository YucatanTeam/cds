const express = require('express')
require('svelte/ssr/register'); // for svelte server side rendering

function page(root) {
    return express.static(`${__dirname}/../www/${root}`)
}

const passport = require('passport');

function private(req, res, next) {
    if(!req.user) return res.redirect("/login");
    next();
}
function access(level) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return (req, res, next) => {
        if(!req.user) return res.redirect("/login");
        if(req.user.access < level) return res.status(403).end();
        next();
    }
}

// require routes here
// ...

module.exports = ({app, db}) => {
    app.get("/ping", access(7), (req, res) => {
        return res.end("pong " + req.user.firstname);
    });

    app.use("/login", page('login'))
    
    // app.post('/login', passport.authenticate('local', { failureRedirect: "/login"}), (req, res) => {
        // TODO
        // return res.redirect("/admin");
        // redirect to /admin panel if its an admin account
        // else redirect to /user panel
    app.post('/login', (req, res) => {
        return res.json({err: null, body: req.body.email})
        // return res.redirect("/")
    });

    app.get('/logout', (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    app.use('/public', page('public'))
    app.use('/admin', private, page('admin'))
    app.use('/', page('index'))
}