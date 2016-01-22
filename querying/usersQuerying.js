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

        knex('users').insert({
            username: user.username,
            password: user.password,
            salt: user.salt,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: "NONE"
        }).asCallback(function(err, rows) {

            console.log(err);
            console.log(rows);

            var userID = rows[0].id;


            var roleQuery = knex('roles').select('id').where('role', user.role).asCallback(function(err, rows) {
                knex('users').where('id', userID).update({
                    role_id: rows[0].id
                }).asCallback(function(err, rows) {
                    callback(err, res);
                });
            });

        });
    });
};

// Updating a user in the DB
exports.updateUser = function(user, res, callback) {

    console.log(JSON.stringify(user));
    knex('users').where('id', user.id).update(user).asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}

// Retrieve all users from the DB
exports.getUsers = function(res, callback) {
    knex('users').select('').asCallback(function(err, rows) {
        callback(err, res, rows);
    });
}

exports.getUserRole = function(email, res, callback) {

    knex('users').select('roles.role').where('users.email', email)
        .innerJoin('roles', 'users.role_id', 'roles.id').asCallback(function(err, rows) {

            if (rows)
                callback(err, res, rows[0].role);
            else
                callback(err, res);
        });
}
