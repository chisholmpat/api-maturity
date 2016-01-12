module.exports = function(app, passport) {

    var queries = require('../querying/usersQuerying');
    var passportConfig = require('./passportConfig.js')(passport);

    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        console.log("Checking to see if user is logged in!");
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/login', passport.authenticate('local'), function(req, res) {
        console.log("Logging user in!");
        console.log("User: " + req.user);
        res.send(req.user);
    });

    // route to log out
    app.post('/logout', function(req, res) {
        console.log("Logging out!");
        req.logOut();
        res.send(200);
    });

    // route to add user to the database
    app.post('/add_user', function(req, res) {
        queries.addUser(req.body.user, res, function(err, res) {
            if (err) {
                console.log(err);
                res.send(400);
            } else {
                res.send(200);
            }
        });

    });

};
