const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

module.exports = ({app, db}) => {


    // passport.use(new LocalStrategy(db.api.getUserByUserPass));
    // passport.serializeUser((user, done) => done(null, user.id));
    // passport.deserializeUser(db.api.getUserById);
    
    passport.use(new LocalStrategy((user, pass, cb)=>console.log(`passport is using strategy for ${user}:${pass} with ${cb}`)));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, cb)=>console.log(`passport tried to deserilize ${id} with ${cb}`));
    
    app.use(passport.initialize());
    app.use(passport.session());
}