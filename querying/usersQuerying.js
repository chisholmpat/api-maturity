var knex = require("../db/db.js").knex;

// For retrieving users from the database.
exports.userloginvalidate = function(username, password) {
    knex.select('').from('users')
        .where('username', username)
        .where('password', password).asCallback(function(err, rows) {
            return rows;
        });
};
