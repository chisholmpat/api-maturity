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
                callback(err, res, rows);
            });
        });
    });
};

// update a client.
exports.updateClient = function(client, res, callback) {
    knex('client').where('Client.id', client.id).update(client).asCallback(function(err, rows) {
        callback(err, res, rows);
        console.log(rows);
    });
};

// return a list of forms for a given client. Right now every client has
// every form but in the future there may be forms which are unique to a client.
// TODO This query can be replaced by a more generic form query.
exports.getAllFormsByClient = function(client_id, res, callback) {

    // Select form information for client.
    knex.select('Form.id', 'Form.name')
        .from('Form').innerJoin('Question', 'Form.id', 'Question.form_id')
        .innerJoin('ClientQuestionResponse', 'Question.id', 'ClientQuestionResponse.question_id')
        .where('client_id', client_id)
        .distinct('*').asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// return a list of clients.
exports.getClients = function(email, res, callback) {
    knex.select('Client.*').select('Client.id').from('client').where('userclients.email', email).where('client.active', 1)
    .innerJoin('userclients', 'client.id', 'userclients.client_id')
        .asCallback(function(err, rows) {
            console.log(rows);
            callback(err, res, rows);
        })
};


// sets the active status to the value is isActive
exports.setClientInactive = function(id, isActive, res, callback) {
    knex('client').where('id', id).update({
        active: isActive
    }).asCallback(function(err, rows){
        callback(err, res);
    });
}
