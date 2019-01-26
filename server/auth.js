const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

module.exports = ({ app, db }) => {

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(db.api.getUserById);


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
    }, db.api.addUser));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password'
    }, db.api.getUserByEmailPass));


    app.use(passport.initialize());
    app.use(passport.session());
}