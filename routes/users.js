module.exports = function(app) {
   
    var queries = require('../querying/usersQuerying');
    
    // callback for queries    
    function callback(err, res, results) {
        if (!err) {
            res.send(results);
        } else {
            res.send('400', err);
        }
    }

    // route to retrieve user from DB.
    app.get('/users', function(req, res) {
        queries.getUsers(res, callback);
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
}
