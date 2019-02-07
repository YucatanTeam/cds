require('svelte/ssr/register'); // for svelte server side rendering
const express = require('express')
const passport = require('passport');

const slug = require('limax')

/* --------------------
    TODO : slug the url
   --------------------
    slug: req.body.title.replace(/ /g,"-"),
    en_slug: slug(req.body.en_title.toLowerCase(), { lowercase: true }),
*/

function page(root) {
    return express.static(`${__dirname}/../www/${root}`)
}
    // ------------
    // guard api
    // ------------
function access(level) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return (req, res, next) => {
        if(!req.user) return res.status(401).end("Unauthorized !");
        if(req.user.access < level) return res.status(403).end("Access denied !");
        next();
    }
}


module.exports = ({app, db}) => {
    
    /*
        use res.status(code).end() to send errors to client
        use res.json({body: ...}) to send data to client
    */
    
    // ------------
    // dev api
    // ------------
    app.get("/ping", access(7), (req, res) => { // developer pong the name!
        return res.end("pong " + req.user.firstname);
    });
    
    app.get("/ping/:id/:name", access(7), (req, res) => { // example for route controll
        return res.status(200).send(`hello ${req.params.name} (${req.params.id})`);
    });
    
    
    // ------------
    // auth api
    // ------------
    app.use("/login", page('login'))
    app.post('/login', passport.authenticate('local-login'), (req, res) => {
        return res.redirect("/panel");
    });
    app.get('/logout', (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    
    // ------------
    // user api
    // ------------
    app.get('/getuser', access(1), (req, res)=>{
        user = {access: req.user.access,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                id: req.user.id,
                avatar: req.user.avatar,
                email: req.user.email}
        setTimeout(e=>res.json({body: user, err:null}), 2000) // do whatever u want with json resp in client side
    })

    
    
    // ------------
    // comment api
    // ------------
    app.get('/getAllComments', access(5), (req, res)=>{
        db.api.getAllComments((err, rows)=>{ // // do whatever u want with json resp in client side
            if(rows) res.json({body: rows, err:null})
            if(err) res.status(404).end("Nothing Found !");
        })
    });









    // ------------
    // public api
    // ------------
    app.use('/public', page('public'))
    app.use('/panel', access(2), page('panel'))
    app.use('/', page('index'))
}