const express = require('express')
require('svelte/ssr/register'); // for svelte server side rendering
const passport = require('passport');

function page(root) {
    return express.static(`${__dirname}/../www/${root}`)
}


function private(req, res, next) {
    //  commented for debugging
    // if(!req.user) return res.redirect("/login");
    next();
}
function access(level) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return (req, res, next) => {
        console.log(`checking access(${level}) for ${req.user.email}`)
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
    
    app.post('/login', passport.authenticate('local-login', { failureRedirect: "/login"}), (req, res) => {
        // TODO find a way to send 'incoorect login' message to login page
        console.log(req.user.email, "is logged in with access ", req.user.access)
        if(req.user.access >= 5) {
            console.log("redirecting ro /admin")
            return res.redirect("/admin");
        } else {
            // return res.redirect("/user");
            return res.redirect("/"); // change this when /user is implemented
        }
    });

    app.get('/logout', (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    app.use('/public', page('public'))
    app.use('/admin', access(5), page('admin'))
    app.use('/', page('index'))
}