module.exports = function(app, passport) {

    var passportConfig = require('./passportConfig.js')(passport);

    // route to log out
    app.post('/logout', function(req, res) {
        console.log("Logging out!");
        req.logOut();
        res.send(200);
    });

    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        console.log("Checking to see if user is logged in!");
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/login', passport.authenticate('local'), function(req, res) {
        console.log("Authenticating User: " + req.user);
        res.send(req.user);
    });

    // route to log into IBMlogin
    app.get('/ibmlogin', passport.authenticate('openidconnect', {}));

    app.get('/auth/sso/callback', function(req, res, next) {
        passport.authenticate('openidconnect', {
            successRedirect: '/#',
            failureRedirect: 'http://bmix-essential.mybluemix.net/#/ibmlogin',
        })(req, res, next);
    });

    function ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.originalUrl = req.originalUrl;
            res.redirect('/login');
        } else {
            return next();
        }
    }

    app.get('/hello', ensureAuthenticated, function(req, res) {
        res.send('Hello, ' + req.user['id'] + '!\n' + ' This is Bluemix Node JS Sample Application, This is protected using SSO Service');
    });

    app.get('/failure', function(req, res) {
        res.send('login failed');
    });

};
