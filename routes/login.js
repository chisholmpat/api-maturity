// routes for handling login operations
module.exports = function(app, passport) {

    // defines the strategies for logins
    var passportConfig = require('../config/passportConfig.js')(passport);
    var queries = require('../querying/usersQuerying');
    // var http = require('http');
    // route to log out
    app.post('/logout', function(req, res) {
        req.logOut();
        res.send(200);
    });

    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.send(req.user);
    });

    // route to log into IBMlogin
    app.get('/ibmlogin', passport.authenticate('openidconnect', {}), function(req,res){});

    // route used in sso redirect
    app.get('/auth/sso/callback', function(req, res, next) {
        passport.authenticate('openidconnect', {
            successRedirect: '/#',
            failureRedirect: 'http://bmix-essential.mybluemix.net/#/ibmlogin',
        })(req, res, next);
    });
};
