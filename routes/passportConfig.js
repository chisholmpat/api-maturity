// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
// Dependencies
var mysql = require('mysql');
var queries = require('../querying/usersQuerying');
module.exports = function(passport) {

    var LocalStrategy = require('passport-local').Strategy; // Define the strategy to be used by PassportJS
    passport.use(new LocalStrategy(
        function(username, password, done) {
            console.log("Invoking local strategy!");
            if (username === "admin" && password === "admin") // stupid example
                return done(null, {
                name: "admin"
            });

            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
    ));

    // Serialized and deserialized methods when got from session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Define a middleware function to be used for every secured routes
    var auth = function(req, res, next) {
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };
};
