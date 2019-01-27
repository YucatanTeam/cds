require('svelte/ssr/register'); // for svelte server side rendering
const passport = require('passport');
const safe = require('./safe.js');

// require routes here
// ...

module.exports = ({app, db}) => {
    app.get("/ping", safe.access(7), (req, res) => { // developer pong the name!
        return res.end("pong " + req.user.firstname);
    });

    app.use("/login", safe.page('login'))
    
    app.post('/login', passport.authenticate('local-login', { failureRedirect: "/login"}), (req, res) => {
        // TODO find a way to send 'incoorect login' message to login page
        if(req.user.access >= 5) {
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

    app.use('/public', safe.page('public'))
    app.use('/admin', safe.access(5), safe.page('admin'))
    app.use('/', safe.page('index'))
}