var knex = require("../db/db.js").knex;

exports.userLoginValidate = function(username, password, res, callback) {
    knex.select('').from('users')
        .where('username', username)
        .where('password', password).asCallback(function(err, rows) {
            callback(res, err, rows);
        });
};
