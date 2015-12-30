var knex = require("../db/db.js").knex; // data connection

// Insert a new customer into the database.
// TODO A current flaw in the database/application design
// requires that when a new client is created they have to
// have an entry for each question in the ClientQuestionResponse
// table. This is because a client can have a unique weighting to
// a question. In the future this should be normalized.
exports.insertClient = function(client, res, callback) {

    // Insert all SA questions/client_id into the CQR table. This is broken in to two seperate queries
    // since there are different default answers depending on whether the question is a QA question or
    // a SA question. This shouold be normalized as well.
    var saQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 8 from Question WHERE Question.category_id = 2"


    var qaQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 1 from Question WHERE Question.category_id = 1"

    // Insert the client object from the post directly.
    knex('Client').insert(client).asCallback(function(err, rows) {
        // Once the FK constraint has been satisfied, add rows to CQR.
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
