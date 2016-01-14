var knex = require("../db/db.js").knex; // database connection
var passwordHelper = require('../helpers/password');

// For retrieving users from the database.
// TODO Use some sort of encryption library here
// to avoid reading/writing cleartext passwords.
exports.userloginvalidate = function(username, password) {
    knex.select('').from('users')
        .where('username', username)
        .where('password', password).ascallback(function(err, rows) {
            return (rows.length !== 0)
        });

};


// Add a user to the DB
exports.addUser = function(user, res, callback) {
    user.salt = Math.random().toString(36).slice(2);
    passwordHelper.hash(user.password, user.salt, function(err, result) {
        user.password = result;
        knex('users').insert(user).asCallback(function(err, rows) {
            callback(err, res);
        });
    });
};

// Updating a user in the DB
exports.updateUser = function(user, res, callback) {
    knex('users').where('User.id', user,id).update(user).asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}

// Retrieve all users from the DB
exports.getUsers = function(res, callback) {
    knex('users').select('').asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}
