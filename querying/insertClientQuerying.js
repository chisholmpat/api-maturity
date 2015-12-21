var knex = require("../db/db.js").knex;

// Insert a new customer into the database.
exports.insertClient = function(client, res, callback) {

    var saQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 8 from Question WHERE Question.category_id = 2"


    var qaQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 1 from Question WHERE Question.category_id = 1"

    knex('Client').insert(client).asCallback(function(err, rows) {
        knex.raw(saQuestionQuery).asCallback(function(err, rows) {
            knex.raw(qaQuestionQuery).asCallback(function(err, rows) {
                callback(res, err, rows);
            });
        });
    });
};

// Update a client.
exports.updateClient = function(client, res, callback) {
    knex('Client').where('Client.id', client.id).update(client).asCallback(function(err, rows) {
        callback(res, err, rows);
    });
};
