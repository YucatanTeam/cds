const fs = require("fs");
const cuid = require("cuid"); // use this to create a cuid in insertaion ops
require('svelte/ssr/register'); // for svelte server side rendering
const Layout = require('./layout.html');
const moment = require('../www/public/js/moment')
const enLayout = require('./en_layout.html');
const express = require('express')
const passport = require('passport');
const formidable = require('formidable');
const bot = require("./Tbot.js");
const isWin = process.platform === "win32";
// const sharp = require('sharp');
function sharp(file) {
    return { resize(nx, ny) {
        return { toFile(newfile, cb) {
            fs.rename(file, newfile, cb);
        }}
    }}
}
const validate = require("./validate.js");
const cwd = process.cwd();


// slug: req.body.slug.replace(/ /g,"-") 
// en_slug: slug(req.body.en_slug.toLowerCase(), { lowercase: true })


function page(root) {
    return express.static(`${__dirname}/../www/${root}`)
}
    // ------------
    // guard routes
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
        if(req.user.access < level) return res.status(403).end("Forbidden !");
        next();
    }
}


module.exports = ({app, db}) => {
    const dev = require('./dev.js')({app, db});

    app.get("/content/:page", (req, res) => {
        const reqpage = req.params.page.split("-").join(" ");
        db.api.page.getByTitle(reqpage, (err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            if(rows.length < 1) {
                return res.redirect("/404.html");
            }
            const row = rows[0];
            const {head, html} = Layout.render({
                page: reqpage,
                title: reqpage,
                en_title: row.en_title.split(" ").join("-"),
                metatags: row.tags,
                tags: row.tags.split(","),
                created: moment(row.created_at).fromNow(),
                id: row.id,
                comment: row.comment,
                content: row.content,
                cover: row.cover,
            });
            const page = `<html><head>${head}</head><body>${html}</body></html>`;
            res.set('Content-Type', 'text/html').send(page);

        });
    })

    app.get("/en/content/:page", (req, res) => {
        const reqpage = req.params.page.split("-").join(" ");
        db.api.page.getByEnTitle(reqpage, (err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            if(rows.length < 1) {
                return res.redirect("/404.html");
            }
            const row = rows[0];
            const {head, html} = enLayout.render({
                page: reqpage,
                en_title: reqpage,
                title: row.title.split(" ").join("-"),
                en_content: row.en_content,
                id: row.id,
                metatags: row.tags,
                tags: row.tags.split(","),
                created: moment(row.created_at).fromNow(),
                comment: row.comment,
                cover: row.cover,
            });
            const page = `<html><head>${head}</head><body>${html}</body></html>`;
            res.set('Content-Type', 'text/html').send(page);

        });
    })

    app.get('/imgsrc/:image', (req, res) => {
        res.sendFile(cwd + "/images/" + req.params.image);
    })
    

    app.post("/ckeditor", access(3), (req, res) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = cwd + "/images/";
        form.keepExtensions = true;
        form.maxFieldsSize = 25 * 1024 * 1024; // 25 MB
        form.parse(req, function (err, fields, files) {
            if(err) return res.status(400).json({
                error: {
                    message: "Bad Request !"
                }
            });

            var cover;
            if(files.upload) {
                cover = files.upload.path;
                cover = isWin ? cover.split("\\") : cover.split("/");
                cover = cover[cover.length - 1];
            } else {
                cover = null;
            }
            
            return res.json({
                url: `/imgsrc/${cover}`
            });
        });
    })


    /*
        use res.status(code).end("http message") to send errors to client
        use res.json({body: ...}) to send data to client
    */
    
    // ------------
    // dev routes
    // ------------
    app.get("/dev/ping", access(7), (req, res) => { // developer pong the name!
        return res.end("pong " + req.user.firstname);
    });
    app.get("/dev/crash", access(7), (req, res) => { // developer pong the name!
        return res.end(notDefinedVariable);
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
    // auth routes
    // ------------
    app.post('/auth/login', passport.authenticate('local-login'), (req, res) => {
        return res.redirect("/panel");
    });
    
    app.get('/auth/logout', access(0), (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    
    // ------------
    // user routes
    // ------------
    app.get('/user', access(1), (req, res) => {
        var user = {
            id: req.user.id,
            access: req.user.access,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email
        }
        res.json({body: user, err:null})
    })

    app.get('/user/all', access(3), (req, res) => {
        db.api.user.all((err, users) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            var result = [];
            for(var user of users) {
                result.push({
                    id: user.id,
                    access: user.access,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                })
            }
            return res.json({body: result, err:null});
        })
    })

    app.post('/user/update', access(2), (req, res) => {

        for(var i in req.body) {
            if(req.body[i] == null) delete req.body[i];
        }
        for(var i in req.body) {
            if(!validate[i](req.body[i])) return res.status(400).end("Bad Request !");
        }
        var newuser = {
            id: req.user.id,
            access: req.user.access,
            firstname: req.body.firstname ? req.body.firstname : req.user.firstname,
            lastname: req.body.lastname ? req.body.lastname : req.user.lastname,
            email: req.body.email ? req.body.email : req.user.email,
            password: req.body.password ? req.body.password : null
        }
        db.api.user.update(newuser, err => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            } else if(newuser.password) {
                db.api.user.password(newuser.id, newuser.password, err => {
                    if(err) {
                        dev.repprt(err);
                        return res.status(500).end("Internal Server Error !");
                    } else {
                        return res.status(200).end("OK");
                    }
                });
            } else {
                return res.status(200).end("OK");
            }
        })
    })
    
    app.post('/user/access', access(5), (req, res) => {
        db.api.user.getById(req.body.id, (err, user) => {
            if(user.access > req.user.access) return res.status(403).end("Forbidden !");
            user.access = req.body.access;
            db.api.user.update(user ,err => {
                if(err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                }
                res.status(200).end("OK");
            })
        })
    })
    /*------Registeration------*/
    app.post('/user/register',function(req,res){
        db.api.user.add(req.body.email,req.body.password,function(err,user){
            if(err){
                dev.report(err);
                return res.status(500).end("Internal server error !");
            } else if(!user){
                return res.status(409).end("Email exists !");
            }
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.access = 2;
            db.api.user.update(user,function(err){
                if(err){
                    dev.report(err);
                    return res.status(500).end("Internal server err !");
                }
                else{
                    req.login(user, function(err) {
                        if (err) { return next(err); }
                        return res.redirect('/panel');
                      });
                    
                    
                }
            })
        })
    })
    app.post('/user/add', access(5), (req, res) => {
        db.api.user.add(req.body.email, req.body.password ,(err, user) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            } else if(!user) {
                return res.status(409).end("Email exists !"); // email existed
            }
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.access = 2;
            db.api.user.update(user, err => {
                if(err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                }
                return res.status(200).end("OK");
            })
        })
    })

    app.post('/user/remove', access(5), (req, res) => {
        db.api.user.getById(req.body.id, (err, user) => {
            if(user.access > req.user.access) return res.status(403).end("Forbidden !");
            db.api.user.remove(req.body.id ,err => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            res.status(200).end("OK");
            })
        })
    })

    app.post('/user/avatar', access(1), (req, res) => {
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
                const avatarp = isWin ? avatar.split("\\") : avatar.split("/");
                avatar = avatarp[avatarp.length - 1];
                db.api.user.changeAvatar(req.user.id, avatar, function (err) {
                    if (err) {
                        dev.report(err);
                        fs.unlink(file0, dev.report);
                        return res.status(500).end("Internal Server Error !");
                    }
                    fs.unlink(file0, dev.report);
                    return res.status(200).end("OK");
                });
            });
        });
    })

    app.get('/user/avatar', access(1), (req, res) => {
        res.sendFile(req.user.avatar ? cwd + "/avatar/" + req.user.avatar : cwd + "/www/public/img/noavatar.png");
    })

    // --------------
    // content routes
    // --------------

    // get:  /route/all 
    //      json-response{ body: [{title, access, items: [pages]}] }
    // post: /route/:route/item/add
    //      json-body{title: page_title}
    // get:  /page/all
    //      json-response[page objects from db]
    // get:  /page/:title
    //      json-response{ body: [{name: page_title}]}
    // post: /page/add
    //      json-body{page}
    // post: /page/:page_id/remove
    //      json-body{}
    // post: /page/:page_id/block
    //      json-body{}
    // post: /page/:page_id/unblock
    //      json-body{}

    app.get("/route/all", (req, res) => {
        db.api.route.getAll((err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            return res.json({body: rows, err:null});
        })
    })
    app.post("/route/:route/item/add", access(5), (req, res) => {
        db.api.page.setRoute(req.body.page, req.params.route, (err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            return res.json({body: rows, err:null});
        })
    })
    app.get("/route/:route/pages",function(req,res){
        db.api.route.getPages(req.params.route,function(err,row){
            if(err){
                dev.report(err);
                return res.status(500).end("internal server err");
            }
            res.json({body: row,err:null})
        });
    });
    app.post("/page/:page/route/remove", access(5), (req, res) => {
        db.api.page.removeRoute(req.params.page, (err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            return res.json({body: rows, err:null});
        })
    })
    app.get("/page/all", (req, res) => {
        db.api.page.getAll((err, rows) => {
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            }
            return res.json({body: rows, err:null});
        })
    })
    app.post('/page/edit',access(3),function(req,res){
        var form = new formidable.IncomingForm();
        form.uploadDir = cwd + "/images/";
        form.keepExtensions = true;
        form.maxFieldsSize = 25 * 1024 * 1024; // 25 MB
        form.parse(req, function (err, fields, files) {

            if(err) return res.status(400).end("Bad Request !");

            var cover;
            if(files.cover) {
                cover = files.cover.path;
                cover = isWin ? cover.split("\\") : cover.split("/");
                cover = cover[cover.length - 1];
            } else {
                cover = null;
            }

            var page = {
                cover,
                tags: fields.tags,
                route_id: fields.route ? parseInt(fields.route) : null,
                title: fields.title,
                en_title: fields.en_title,
                content: fields.feditor,
                en_content: fields.eneditor,
                comment: fields.comment === "true",
                id:fields.id
            };
            
            db.api.page.edit(page, function (err) {
                if (err) {
                    dev.report(err);
                    return res.status(500).end("ok is not defined");
                }
                if(fields.telegram === "true") {
                    bot(
                        `${process.env.URL}/imgsrc/${page.cover}`,
                        `${process.env.URL}/content/${page.title.split(" ").join("-")}`,
                        (err, response, body) => {
                            if(err) {
                                dev.report(err);
                                return res.status(500).end("Internal Server Error !");
                            }
                            console.log(response, body);
                        }
                    )
                }
                return res.status(200).end("OK");
            });
        });
    })
    
    app.post("/page/add", access(5), (req, res) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = cwd + "/images/";
        form.keepExtensions = true;
        form.maxFieldsSize = 25 * 1024 * 1024; // 25 MB
        form.parse(req, function (err, fields, files) {

            if(err) return res.status(400).end("Bad Request !");

            var cover;
            if(files.cover) {
                cover = files.cover.path;
                cover = isWin ? cover.split("\\") : cover.split("/");
                cover = cover[cover.length - 1];
            } else {
                cover = null;
            }

            var page = {
                cuid: cuid(),
                cover,
                tags: fields.tags,
                route: fields.route ? parseInt(fields.route) : null,
                title: fields.title,
                en_title: fields.en_title,
                content: fields.feditor,
                en_content: fields.eneditor,
                comment: fields.comment === "true",
            };
            
            db.api.page.add(page, function (err) {
                if (err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                }
                if(fields.telegram === "true") {
                    bot(
                        `${process.env.URL}/imgsrc/${page.cover}`,
                        `${process.env.URL}/content/${page.title.split(" ").join("-")}`,
                        (err, response, body) => {
                            if(err) {
                                dev.report(err);
                                return res.status(500).end("Internal Server Error !");
                            }
                            console.log(response, body);
                        }
                    )
                }
                return res.status(200).end("OK");
            });
        });
    })

    // --------------
    // comment routes
    // --------------
    app.get('/comment/getAllRelToAPage/:id', (req, res)=>{
        db.api.comment.getAllRelToAPage(req.params.id, (err, rows)=>{

            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.get('/comment/getAll', access(3), (req, res)=>{
        db.api.comment.getAll((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.post('/comment/delete/cu/:cuid', access(5), (req, res)=>{
        db.api.comment.deleteByCuid(req.params.cuid, (err, rows)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/comment/delete/:id', access(5), (req, res)=>{
        db.api.comment.deleteById(req.params.id, (err, rows)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });
    
    app.post('/comment/deleteAll', access(7), (req, res)=>{
        db.api.comment.deleteAll((err, rows)=>{
            
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/comment/block/:id', access(5), (req, res)=>{
        db.api.comment.block(req.params.id, (err, row)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/comment/unblock/:id', access(5), (req, res)=>{
        db.api.comment.unblock(req.params.id, (err, row)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/comment/edit', access(3), (req, res)=>{
        for(var i in req.body) {
            if(req.body[i] == null) delete req.body[i]
        }
        db.api.comment.getById(req.body.id, (err, cmnt)=>{
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
            var newcomment = {
                id : req.body.id ? req.body.id : cmnt.id,
                content : req.body.content ? req.body.content : cmnt.content,
                name : req.body.name ? req.body.name : cmnt.name,
                email : req.body.email ? req.body.email : cmnt.email
            }

            db.api.comment.update(newcomment, (err, row)=>{
                if(err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                } else return res.status(200).end("OK");
            })

        })
    })

    app.post('/comment/add', (req, res)=>{
        for(var i in req.body){
            if(req.body[i] == null) {
                delete req.body[i] 
                return res.status(411).end("Length Required !");
            } 
        }
            
            var newcomment = {
                cuid: cuid(),
                content : req.body.content,
                name : req.body.name,
                email : req.body.email,
                page_id : req.body.page_id
            }
            
        db.api.comment.add(newcomment, (err, row)=>{
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            } else return res.status(200).end("OK");
        })      
    });

    // ----------------------
    // student control routes
    // ----------------------
    app.get('/student-control/getAll', access(3), (req, res)=>{
        db.api.studentcontrol.getAll((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.get('/student-control/getAll/:id', access(2), (req, res)=>{
        db.api.studentcontrol.getAllRelToId(req.params.id, (err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.post('/student-control/block/:id', access(5), (req, res) =>{
        db.api.studentcontrol.block(req.params.id, (err, row)=>{
            
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });
    
    app.post('/student-control/unblock/:id', access(5), (req, res)=>{
        db.api.studentcontrol.unblock(req.params.id, (err, row)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/student-control/delete/:id', access(5), (req, res)=>{
        db.api.studentcontrol.deleteById(req.params.id, (err, rows)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/student-control/edit', access(3), (req, res)=>{
        for(var i in req.body) {
            if(req.body[i] == null) delete req.body[i]
        }
        db.api.studentcontrol.getById(req.body.id, (err, info)=>{
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }

            var newinfo = {
                id : req.body.info_id ? req.body.info_id : info.id,
                country : req.body.country ? req.body.country : info.country,
                university : req.body.university ? req.body.university : info.university,
                education_language : req.body.education_language ? req.body.education_language : info.education_language,
                cv : req.body.cv ? req.body.cv : info.cv,
                sop : req.body.sop ? req.body.sop : info.sop,
                rc : req.body.rc ? req.body.rc : info.rc,
                field : req.body.field ? req.body.field : info.body,
                reg_date : req.body.reg_date ? req.body.reg_date : info.reg_date,
                description : req.body.description ? req.body.description : info.description
            }

            db.api.studentcontrol.update(newinfo, (err, row)=>{
                if(err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                } else return res.status(200).end("OK");
            })

        })
    })

    app.post('/student-control/add', access(5), (req, res)=>{
        for(var i in req.body){
            if(req.body[i] == null) {
                delete req.body[i] 
                return res.status(411).end("Length Required !");
            } 
        }
            
        var newinfo = {
            cuid: cuid(),
            country : req.body.country,
            university : req.body.university,
            education_language : req.body.education_language,
            cv : req.body.cv,
            sop : req.body.sop,
            rc : req.body.rc,
            field : req.body.field,
            reg_date : req.body.reg_date,
            description : req.body.description,
            user_id : req.body.user_id
        }
        
        db.api.studentcontrol.add(newinfo, (err, row)=>{
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            } else return res.status(200).end("OK");
        })      
    });


    // ----------------------
    // Form routes
    // ----------------------

    app.get('/form/all', access(5), (req, res) => {
        db.api.form.all((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.post('/form/delete/:id', access(5), (req, res)=>{
        db.api.form.deleteById(req.params.id, (err, rows)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/form/add', (req, res)=>{
        
        var form = new formidable.IncomingForm();
        form.uploadDir = cwd + "/doc/";
        form.keepExtensions = true;
        form.maxFieldsSize = 20 * 1024 * 1024;
        form.maxFileSize = 200 * 1024 * 1024;
        form.parse(req, function (err, fields, files) {

            if(err) return res.status(400).end("Bad Request !");

            // TODO : work on document

            // var document;
            // if(files.document) {
            //     document = files.document.path;
            //     document = isWin ? document.split("\\") : document.split("/");
            //     document = document[document.length - 1];
            // } else {
            //     document = null;
            // }

            // var form = {
            //     // document,
            //     birthday_date: fields.birthday_date,
            //     firstname: fields.birthday_date,
            //     lastname: fields.lastname,
            //     marrital_status: fields.marrital_status,
            //     gender: fields.gender,
            //     nationality: fields.nationality,
            //     country_of_residency: fields.country_of_residency,
            //     city_of_residency: fields.city_of_residency,
            //     address: fields.address,
            //     postal_code: fields.postal_code,
            //     telephone_number: fields.telephone_number,
            //     mobile_number: fields.mobile_number,
            //     email: fields.email,
            //     latest_academic_qualification: fields.latest_academic_qualification,
            //     field_of_study: fields.field_of_study,
            //     country: fields.country,
            //     gpa: fields.gpa,
            //     year_awarded: fields.year_awarded,
            //     institution: fields.institution,
            //     language_certificate: fields.language_certificate,
            //     IELTS_listening: fields.IELTS_listening,
            //     IELTS_reading: fields.IELTS_reading,
            //     IELTS_writing: fields.IELTS_writing,
            //     IELTS_speaking: fields.IELTS_speaking,
            //     IELTS_overall_band: fields.IELTS_overall_band,
            //     TOFEL_IBT_listening: fields.TOFEL_IBT_listening,
            //     TOFEL_IBT_reading: fields.TOFEL_IBT_reading,
            //     TOFEL_IBT_writing: fields.TOFEL_IBT_writing,
            //     TOFEL_IBT_speaking: fields.TOFEL_IBT_speaking,
            //     TOFEL_IBT_overall_band: fields.TOFEL_IBT_overall_band,
            //     gmat_verbal: fields.gmat_verbal,
            //     gmat_quantitative: fields.gmat_quantitative,
            //     gmat_analytical_writing: fields.gmat_analytical_writing,
            //     gmat_test_date: fields.gmat_test_date,
            //     gmat_total: fields.gmat_total,
            //     gre_verbal_score: fields.gre_verbal_score,
            //     gre_quantitative_score: fields.gre_analytical_score,
            //     gre_analytical_score: fields.gre_analytical_score,
            //     other_language_info: fields.other_language_info,
            //     oddinfo1: fields.oddinfo1,
            //     oddinfo2: fields.oddinfo2,
            //     oddinfo3: fields.oddinfo3,
            //     oddinfo4: fields.oddinfo4,
            //     oddinfo5: fields.oddinfo5,
            //     oddinfo6: fields.oddinfo6,
            //     details: fields.details 
            // }
        
        // db.api.form.add(form, (err, row)=>{
        //     if(err) {
        //         dev.report(err);
        //         return res.status(500).end("Internal Server Error !");
        //     } else{
                
        //         // TODO mail the form object to req.user.email
        //         // https://nodemailer.com
        //         return res.status(200).end("OK");
            
        //     }
            
        // })

       });          
    });

    // -----------------------------
    // free-time routes
    // -----------------------------
    
    app.get('/free-time/all', access(3), (req, res)=>{
        db.api.freetime.all((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.get('/free-time/available', access(2), (req, res) =>{
        db.api.freetime.available((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    })

    app.post('/free-time/block/:id', access(2), (req, res) =>{
        db.api.freetime.block(req.params.id, (err, row)=>{
            
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });
    
    app.post('/free-time/unblock/:id', access(2), (req, res)=>{
        db.api.freetime.unblock(req.params.id, (err, row)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/free-time/delete/:id', access(7), (req, res)=>{
        db.api.freetime.deleteById(req.params.id, (err, rows)=>{

            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            } else return res.status(200).end("OK");
        })
    });

    app.post('/free-time/edit', access(3), (req, res)=>{
        for(var i in req.body) {
            if(req.body[i] == null) delete req.body[i]
        }
        
        db.api.freetime.getById(req.body.ft_id, (err, ft)=>{
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }

            var newfreetime = {
                id : req.body.ft_id ? req.body.ft_id : ft.id,
                date : req.body.date ? req.body.date : ft.date,
                time : req.body.time ? req.body.time : ft.time,
                price : req.body.price ? req.body.price : ft.price,
            }

            db.api.freetime.update(newfreetime, (err, row)=>{
                if(err) {
                    dev.report(err);
                    return res.status(500).end("Internal Server Error !");
                } else return res.status(200).end("OK");
            })

        })

    })

    app.post('/free-time/add', access(5), (req, res)=>{
        for(var i in req.body){
            if(req.body[i] == null) {
                delete req.body[i] 
                return res.status(411).end("Length Required !");
            } 
        }

        var newfreetime = {
            
            date : req.body.date,
            time : req.body.time,
            price : req.body.price ? req.body.price : 0 
        }

        
        db.api.freetime.add(newfreetime, (err, row)=>{
            if(err) {
                dev.report(err);
                return res.status(500).end("Internal Server Error !");
            } else return res.status(200).end("OK");
        })
                 
    });


    // -----------------------------
    // reserve routes
    // -----------------------------

    app.get('/reserve/all', access(3), (req, res)=>{
        db.api.reserve.all((err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });

    app.get('/reserve/all/:id', access(2), (req, res)=>{
        db.api.freetime.getAllRelToId(req.params.id, (err, rows)=>{
            
            if(rows) return res.json({body: rows, err:null})
            if(err) {
                dev.report(err);
                return res.status(404).end("Nothing Found !");
            }
        })
    });






    // ------------
    // public api
    // ------------
    app.use('/public', page('public'))
    app.use("/login", page('login'))
    app.use('/panel', access(2, "/login"), page('panel'))
    app.use('/', page('index'))
    app.use('/ssr', page('ssr'))
    app.use('/register',page('register'));
}