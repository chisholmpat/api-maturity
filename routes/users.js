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
        queries.addUser(req.body.user, res, dbUtils.callbackNoResults);
    });

    // update a user in the database
    app.post("/update_user", function(req, res) {
        queries.updateUser(req.body.user, res, dbUtils.callbackNoResults);
    });

    // return whether or not a particular user has rights to view 
    // a client based on the user's email address.
    app.get('/userauthd', function( req, res) {
        queries.checkIfUserCanViewClient(req.query.client_id, req.query.email, res, function(err, res, rows){
            if(rows && rows.length == 1)
                res.send('1');
            else
                res.send('0');        
        });    
    });

    // Get the user's role from the database
    app.get('/role/', function(req, res) {
        queries.getUserRole(req.user.email, res, dbUtils.callback);
    });

}
