var knex = require("../db/db.js").knex; // database connection
var passwordHelper = require('../helpers/password');

// For retrieving users from the database.
// TODO Use some sort of encryption library here
// to avoid reading/writing cleartext passwords.
exports.userloginvalidate = function(username, password) {
    knex.select('').from('users')
        .where('username', username.toUpperCase())
        .where('password', password)
        .where('active', 1)
        .ascallback(function(err, rows) {
            return (rows.length !== 0)
        });

};

// Add a user to the database. Additionally the role needs to be
// looked up when inserted. I will change this by offering the role_id
// as a parameter to this function rather than having to do a query for it.
exports.addUser = function(user, res, callback) {
    user.salt = Math.random().toString(36).slice(2);
    passwordHelper.hash(user.password, user.salt, function(err, result) {
        user.password = result;
        user.username = user.username.toUpperCase();
        knex('users').insert(user).asCallback(function(err, rows) {
            callback(err, res);
        });
    });
};

// Updating a user in the DB
exports.updateUser = function(user, res, callback) {

    // We use email to establish priviledge against users 
    // to support SSO users not having to be registered 
    // against our database. When a user is updated we 
    // then have to update the userclients table.
    knex('users').select('email').where('Users.id', user.id).asCallback(function(err, rows) {
        userEmail = rows[0].email;
        user.username = user.username.toUpperCase();
        knex('users').where('Users.id', user.id).update(user).asCallback(function(err, rows) {
            callback(err, res);
        });
        
        knex('userclients').where('email', userEmail).update({
            email: user.email
        })
    });

}

// Retrieve all users from the DB
exports.getUsers = function(res, callback) {
    knex('users').select('').asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}

// Retrieve the role of the user from the database.
exports.getUserRole = function(email, res, callback) {
    knex('users').select('roles.role').where('users.email', email)
        .innerJoin('roles', 'users.role_id', 'roles.id').asCallback(function(err, rows) {
            if (rows && rows[0] && rows[0].role)
                callback(err, res, rows[0].role);
            else
                callback(err, res);
        });
}

// Gets all the roles for use in creating users.
exports.getRoles = function(res, callback) {
    knex('roles').select('').asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}

// Checks to see if a username exists
exports.checkUniqueUsername = function(username, res, callback) {
    knex('users').select('').where('username', username).asCallback(function(err, rows) {
        if (rows && rows[0])
            res.send(rows[0].username);
        else
            res.send(404);
    });
}
