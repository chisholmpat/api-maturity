// module for user related DB operations
module.exports = function(app) {

    var queries = require('../querying/usersQuerying');
    var dbUtils = require('../helpers/db_util');

    // route to retrieve user from DB.
    app.get('/users', dbUtils.checkAuthenticated, function(req, res) {
        queries.getUsers(res, dbUtils.callback);
    });

    // route to add user to the database
    app.post('/add_user', dbUtils.checkAuthenticated, function(req, res) {
        queries.addUser(req.body.user, res, dbUtils.callbackNoReturn);
    });

    // update a user in the database
    app.post("/update_user", function(req, res) {
        queries.updateUser(req.body.user, res, dbUtils.callbackNoReturn);
    });

    // return whether or not a particular user has rights to view
    // a client based on the user's email address.
    app.get('/userauthd', function(req, res) {
        queries.checkIfUserCanViewClient(req.query.client_id, req.query.email, res, function(err, res, rows) {
            if (rows && rows.length == 1)
                res.send('1');
            else
                res.send('0');
        });
    });

    // get the user's role from the database
    app.get('/role/', function(req, res) {
        if (req.user && req.user.isIBM) {
            res.send('user');
            return;
        } else {
            if (req.user && req.user.email)
                queries.getUserRole(req.user.email, res, dbUtils.callback);
            else
                res.send(403, 'No User Email');
        }
    });

    // get all roles from the database
    app.get('/roles', function(req, res) {
        queries.getRoles(res, dbUtils.callback);
    });

    // route used to check for uniqueness of user 
    app.get('/checkUniqueUser/:username', function(req, res) {
        queries.checkUniqueUsername(req.params.username, res, dbUtils.callback);
    });

    // route used to check for uniqueness of user email for user form.
    app.get('/checkUniqueUserEmail/:email', function(req, res) {
        queries.checkUniqueUserEmail(req.params.email, res, dbUtils.callback);
    });

    // route to add user to the database
    app.post('/add_user', function(req, res) {
        queries.addUser(req.body.user, res, function(err, res) {
            if (err) {
                res.send(400, err);
            } else {
                res.send(200);
            }
        });

    });
};
