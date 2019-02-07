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

    // ------------
    // guard api
    // ------------
function page(root) {
    return express.static(`${__dirname}/../www/${root}`)
}

function private(){
    return (req, res, next) =>{
        if(!req.user) return res.redirect("/login");
        next();
    }
}

function access(level) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return (req, res, next) => {
        if(!req.user) return res.redirect("/login");
        if(req.user.access < level) return res.status(403).end(); // don't have enogh permition!
        next();
    }
}


module.exports = ({app, db}) => {
    
    
    
    // ------------
    // dev api
    // ------------
    app.get("/ping", access(7), (req, res) => { // developer pong the name!
        return res.end("pong " + req.user.firstname);
    });
    
    
    
    // ------------
    // auth api
    // ------------
    app.use("/login", page('login'))
    app.post('/login', passport.authenticate('local-login', { failureRedirect: "/login"}), (req, res) => {
        // TODO find a way to send 'incoorect login' message to login page then fix its ui in Form tag
        return res.redirect("/panel");
    });
    app.get('/logout', (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    
    // ------------
    // user api
    // ------------
    app.get('/getuser', private(), (req, res, next)=>{
        try{
          res.json({type: 'success', message: 'ok', user: req.user}) // do whatever u want with json resp in client side
        } catch(err){
            next(err);
        }
    })

    
    
    // ------------
    // comment api
    // ------------
    app.get('/getAllComments', access(5), (req, res, next)=>{
        try {
            db.api.getAllComments((err, rows)=>{ // // do whatever u want with json resp in client side
                if(rows) res.json({type:'success', message:'Fetched Successfully', rows})
                if(err) res.status(404).json({type: 'error', message:'No Comments Fetched From Server', err})
            })
         
          } catch (err) {
            next(err);
          }

    });









    // ------------
    // public api
    // ------------
    app.use('/public', page('public'))
    app.use('/panel', access(5), page('panel'))
    app.use('/', page('index'))
}