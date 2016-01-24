var knex = require("../db/db.js").knex; // data connection
var dbUtils = require("../helpers/db_util");

// Insert a new customer into the database.
// TODO A current flaw in the database/application design
// requires that when a new client is created they have to
// have an entry for each question in the ClientQuestionResponse
// table. This is because a client can have a unique weighting to
// a question. In the future this should be normalized.
exports.insertClient = function(client, email, res, callback) {

    // Insert all SA questions/client_id into the CQR table. This is broken in to two seperate queries
    // since there are different default answers depending on whether the question is a QA question or
    // a SA question. This shouold be normalized as well.
    var saQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 8 from Question WHERE Question.category_id = 2"


    var qaQuestionQuery = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 1 from Question WHERE Question.category_id = 1"

    // Insert the client object from the post directly.
    knex('Client').insert(client).asCallback(function(err, rows) {
        knex('userclients').insert({
            client_id: rows[0],
            email: email,
            isOwner: true
        }).asCallback(function(err, rows) {});

        // Once the FK constraint has been satisfied, add rows to CQR.
        knex.raw(saQuestionQuery).asCallback(function(err, rows) {
            knex.raw(qaQuestionQuery).asCallback(function(err, rows) {
                callback(err, res);
            });
        });
    });
};

// update a client.
exports.updateClient = function(client, res, callback) {
    knex('client').where('Client.id', client.id).update(client).asCallback(function(err, rows) {
        callback(err, res, rows);
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
            callback(err, res, rows);
        })
};

// return a list of user Emails.
exports.getAllUserEmails = function(res, callback) {
    knex.distinct('email')
        .select()
        .from('userclients')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// return a list of user Emails and ClientIDs
exports.getAllClientIDsAndEmails = function(res, callback) {
    knex.select('email', 'client_id')
        .from('userclients')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// return a list of all clients the user is allowed to view
exports.getAllClientsOwnedByUser = function(email, res, callback) {
    knex.distinct('client_id')
        .select('')
        .from('userclients')
        .where({
            email: email,
            isOwner: true
        })
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};


// return a list of all clients the user is allowed to view
exports.getAllClientInfoOwnedByUser = function(email, res, callback) {
    knex
        .select('Client.*')
        .from('Client')
        .where('userclients.email', email).where('isOwner', '1')
        .innerJoin('userclients', 'Client.id', 'userclients.client_id')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// Add user email and client ID
exports.addClientToUser = function(client_id, user_email, res, callback) {

    // Insert the clinet_id, user_email
    knex('userclients').insert({
            client_id: client_id,
            email: user_email
        })
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};


// sets the active status to the value is isActive
exports.setClientInactive = function(id, isActive, res, callback) {
    knex('client').where('id', id).update({
        active: isActive
    }).asCallback(function(err, rows) {
        callback(err, res);
    });
}
