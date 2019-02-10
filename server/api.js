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
function access(level, redirect) {
    // level: 0 ban, 1 restricted, 2 user, 3 mod, 5 admin, 7 dev
    return redirect ?
    (req, res, next) => {
        if(!req.user) return res.redirect(redirect);
        if(req.user.access < level) return res.redirect(redirect);
        next();
    } :
    (req, res, next) => {
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
        var user = {access: req.user.access,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
                id: req.user.id,
                avatar: req.user.avatar,
                email: req.user.email}
        setTimeout(e=>res.json({body: user, err:null}), 100) // do whatever u want with json resp in client side
    })
    
    app.post('/updateUser', access(1), (req, res) => {
        console.log(req.body)
        // TODO validate req.body
        // TODO db.api.updateUser(validReqBody)
        res.status(200).end("ok")
    })
    


    
    // ------------
    // comment api
    // ------------
    app.get('/getAllCommentsRelToAPost/:id', access(5), (req, res)=>{ // usage : recommended for client side
        db.api.getAllCommentsRelToAPost(req.params.id, (err, rows)=>{

            if(rows) res.json({body: rows, err:null})
            if(err) res.status(404).end("Nothing Found !");
        })
    });

    app.get('/getAllComments', access(5), (req, res)=>{
        db.api.getAllComments((err, rows)=>{
            if(rows) {
                for ( var index=0; index<rows.length; index++ ) { // only dev can create new comment
                    req.user.access === 5 ? rows[index].actions = [false, true, true, true] : rows[index].actions = [true, true, true, true]
                }
                res.json({body: rows, err:null})
            }
            if(err) res.status(404).end("Nothing Found !");
        })
    });

    app.delete('/deleteComment/:cuid', access(5), (req, res)=>{
        db.api.deleteCommentByCuid(req.params.cuid, (err, resaff, fields)=>{

            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });

    app.delete('/deleteComment/:id', access(5), (req, res)=>{
        db.api.deleteCommentById(req.params.id, (err, resaff, fields)=>{

            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });
    
    app.post('/deleteAllComments', access(5), (req, res)=>{
        db.api.deleteAllComments((err, resaff, fields)=>{
            
            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });

    app.post('/editComment', access(5), (req, res)=>{
        // TODO : validate req.body
        // TODO : db.api.editComment(validated req.body, (err, row))
    });




    // ---------
    // mc_lc api
    // ---------
    app.get('/getAllMcLcRerlToAbroad/:id', access(5), (req, res)=>{
        db.api.getAllMcLcRerlToAbroad(req.params.id, (err, rows)=>{

            if(rows) res.json({body: rows, err:null})
            if(err) res.status(404).end("Nothing Found !");
        });
    })

    app.get('/getAllMcLc', access(5), (req, res)=>{
        db.api.getAllMcLc((err, rows)=>{
            if(rows) {
                for ( var index=0; index<rows.length; index++ ) {
                    // for dev and admin all actions(create , delete , edit , block/unblock status) are set to true
                    rows[index].actions = [true, true, true, true]
                }
                res.json({body: rows, err:null})
            }
            if(err) res.status(404).end("Nothing Found !");
        })
    });

    app.delete('/deleteMcLc/:cuid', access(5), (req, res)=>{
        db.api.deleteMcLcByCuid(req.params.cuid, (err, resaff, fields)=>{

            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });

    app.delete('/deleteMcLc/:id', access(5), (req, res)=>{
        db.api.deleteMcLcById(req.params.id, (err, resaff, fields)=>{

            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });
    
    app.post('/deleteAllMcLc', access(5), (req, res)=>{
        db.api.deleteAllMcLc((err, resaff, fields)=>{

            if(resaff) res.json({body: resaff, err:null, fields: fields})
            if(err) res.status(404).end("Nothing Deleted !");
        })
    });

    app.post('/editMcLc', access(5), (req, res)=>{
        // TODO : validate req.body
        // TODO : db.api.editMcLc(validated req.body, (err, row))
    });






    // ------------
    // public api
    // ------------
    app.use('/public', page('public'))
    app.use('/panel', access(2, "/login"), page('panel'))
    app.use('/', page('index'))
}