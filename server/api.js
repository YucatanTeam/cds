const fs = require("fs");

require('svelte/ssr/register'); // for svelte server side rendering
const express = require('express')
const passport = require('passport');

const formidable = require('formidable');
const sharp = require('sharp');

const validate = require("./validate.js");

const slug = require('limax')

/* --------------------
    TODO : slug the url
   --------------------
    slug: req.body.title.replace(/ /g,"-"),
    en_slug: slug(req.body.en_title.toLowerCase(), { lowercase: true }),

*/
const cwd = process.cwd();

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
        if(req.user.access < level) return res.status(403).end("Access Denied !");
        next();
    }
}


module.exports = ({app, db}) => {
    const dev = require('./dev.js')({app, db});

    /*
        use res.status(code).end() to send errors to client
        use res.json({body: ...}) to send data to client
    */
    
    // ------------
    // dev api
    // ------------
    app.get("/dev/ping", access(7), (req, res) => { // developer pong the name!
        return res.end("pong " + req.user.firstname);
    });
    
    app.get("/dev/ping/:id/:name", access(7), (req, res) => { // example for route controll
        return res.status(200).send(`hello ${req.params.name} (${req.params.id})`);
    });

    app.get("/dev/error/:msg", access(7), (req, res) => { // generate arbitary error !
        dev.report(new Error(req.params.msg), (err, rows) => {
            if(err) return res.status(500).end(err);
            return res.status(200).end("OK");
        });
    });
    app.get("/dev/error/:id/seen", access(7), (req, res) => { // unstar an error !
        db.api.server.error.seen(req.params.id, (err, rows) => {
            if(err) return res.status(500).end(err);
            return res.status(200).end("OK");
        });
    });
    app.get("/dev/errors", access(7), (req, res) => { // list errors !
        db.api.server.error.list((err, rows) => {
            if(err) return res.status(500).end(err);
            var s = "";
            for(var r of rows) {
                s += `[${r.id}] [${r.msg}]${r.status == 1 ? " *" : ""}\n`
            }
            return res.end(s);
        });
    });
    
    // ------------
    // auth api
    // ------------
    app.post('/auth/login', passport.authenticate('local-login'), (req, res) => {
        return res.redirect("/panel");
    });
    app.get('/auth/logout', access(0), (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    
    // ------------
    // user api
    // ------------
    app.get('/user', access(1), (req, res) => {
        var user = {
            access: req.user.access,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email
        }
        setTimeout(e=>res.json({body: user, err:null}), 100)
    })
    
    app.post('/user/update', access(2), (req, res) => {
        console.log(req.body)
        // var valid = true;
        // valid = req.body.password ? validate.password(req.body.password) : valid;

        // valid = req.body.username ? validate.username(req.body.username) : valid;
        // valid = req.body.email ? validate.email(req.body.email) : valid;
        // TODO db.api.user.update(validReqBody)
        res.status(200).end("OK")
    })

    app.post('/user/avatar', access(2), (req, res) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = cwd + "/avatar/";
        form.keepExtensions = true;
        form.maxFieldsSize = 0.5 * 1024 * 1024; // 512 KB
        form.parse(req, function (err, fields, files) {
            if(err || !files.file0) return res.status(400).end("Bad Request !");

            var file0 = files.file0.path;
            if(!validate.avatar(files.file0)) {
                fs.unlink(file0, dev.report);
                return res.status(400).end("Bad Request !");
            }

            var avatar = file0.split('.');
            const ext = avatar[avatar.length - 1];
            avatar[avatar.length - 1] = "sharp";
            avatar.push(ext);
            avatar = avatar.join('.');

            sharp(file0).resize(300, 200).toFile(avatar, function(err) {
                if (err) {
                    dev.report(err);
                    fs.unlink(file0, dev.report);
                    return res.status(500).end("Internal Server Error !");
                }
                db.api.setAvatar(req.user.id, avatar, function (err) {
                    if (err) {
                        dev.report(err);
                        fs.unlink(file0, dev.report);
                        return res.status(500).end("Internal Server Error !");
                    }
                    return res.status(200).json({avatar});
                });
            });
        });
    })

    app.get('/user/avatar', access(1), (req, res) => {
        res.sendFile(req.user.avatar ? req.user.avatar : cwd + "/www/public/img/noavatar.png");
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
    app.use("/login", page('login'))
    app.use('/panel', access(2, "/login"), page('panel'))
    app.use('/', page('index'))
}