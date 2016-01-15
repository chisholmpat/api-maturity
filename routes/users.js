// module for user related DB operations
module.exports = function(app) {
    
    var queries = require('../querying/usersQuerying');
    var dbUtils = require('../helpers/db_util');
    
    // route to retrieve user from DB.
    app.get('/users', dbUtils.checkAuthenticated, function(req, res) {
        queries.getUsers(res, dbUtils.callback);
    });

    // route to add user to the database
    app.post('/add_user', function(req, res) {
        queries.addUser(req.body.user, res, dbUtils.callbackNoResults);
    });

    // update a user in the database
    app.post("/update_user", function(req, res) {
        queries.updateUser(req.body.user, res, dbUtil.callbackNoResults);
    });
}
