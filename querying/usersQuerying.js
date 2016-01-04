var knex = require("../db/db.js").knex; // database connection

// For retrieving users from the database.
// TODO Use some sort of encryption library here
// to avoid reading/writing cleartext passwords.
exports.userloginvalidate = function(username, password) {
    knex.select('').from('users')
        .where('username', username)
        .where('password', password).ascallback(function(err, rows) {
            console.log(rows.length !== 0);
            return (rows.length !== 0)
        });
};
