module.exports = function(app) {
   
    var queries = require('../querying/usersQuerying');
    
    // callback for queries    
    function callback(err, res, results) {
        if (!err) {
            res.send(results);
        } else {
            console.log(err);
            res.send('400', err);
        }
    };

    // TODO Fix this particular code. Angular complains
    // that it is expecting an object and recieves an array
    // from the database call to updates and inserts (the returned
    // id of the new record).
    function callbackNoResults(err, res){
        if(!err) {
            res.send('200');
        } else {
            res.send('400', err);
        }
    };

    // route to retrieve user from DB.
    app.get('/users', function(req, res) {
        queries.getUsers(res, callback);
    });

    // route to add user to the database
    app.post('/add_user', function(req, res) {
        queries.addUser(req.body.user, res, callbackNoResults);
    });

    // update a user in the database
    app.post("/update_user", function(req, res) {
        queries.updateUser(req.body.user, res, callbackNoResults);
    });
}
