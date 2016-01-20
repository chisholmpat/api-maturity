var knex = require("../db/db.js").knex; // database connection

// Function to check whether use is authenticated
module.exports.checkAuthenticated = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

// callback for queries with a result return
module.exports.callback = function callback(err, res, results) {
    if (!err) {
        console.log(results);
        res.send(results);
    } else {
        console.log(err);
        res.send('400', err);
    }
};

// callback for queries with no expected return
module.exports.callbackNoReturn = function callbackNoResults(err, res) {
    if (!err) {
        res.send('200');
    } else {
        console.log(err);
        res.send('400', err);
    }
};

// Checks to see if a user can view a particular client.
module.exports.userCanViewClient = function(client_id, email, callback) {
    knex('userclients').select('').where('client_id', client_id).where('email', email)
    .asCallback(function(err, rows) {
        console.log("Checking user permissions for " + client_id + " and email " + email);
        console.log(rows);
        var permitted = rows && rows.length == 1;
        callback(err, permitted);
    });
}
 
    
