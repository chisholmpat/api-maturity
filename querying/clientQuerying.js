var knex = require("../db/db.js").knex; // data connection
var dbUtils = require("../helpers/db_util");
var client_email;
var client_id;

//(i)Insert a new Client into the client table
//(ii) Insert the Client into the client-user table to allow user creating the client to have ownership of the client-user
//(iii) Insert the Client into the client-user table to allow the client to view their own information

exports.insertClient = function(client, email, res, callback) {

    // Insert the client object from the post directly.
    client_email = client.email;
    knex('Client').insert(client).asCallback(function(err, rows) {
        client_id = rows[0];
        //this insert ensures the user adding the client is the owner of the client and is allowed to view the client
        knex('userclients').insert({
            client_id: rows[0],
            email: email,
            isOwner: true
        }).asCallback(function(err, rows) {

          //add client_id and email  to user-clients table  to allow the client to view themself
          //this inser allows the client to be able to view their own information
          knex('userclients').insert({
              client_id: client_id,
              email: client_email,
              isOwner: false
          }).asCallback(function(err,rows){
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
        });
};

// return a list of clients.
exports.getClients = function(email, res, callback) {
    knex.select('Client.*').select('Client.id').from('client').where('userclients.email', email).where('client.active', 1)
        .innerJoin('userclients', 'client.id', 'userclients.client_id')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        });
};

// return a list of user Emails.
exports.getAllUserEmails = function(res, callback) {
    knex.distinct('email')
        .select()
        .from('userclients')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        });
};

// return a list of user Emails and ClientIDs
exports.getAllClientIDsAndEmails = function(res, callback) {
    knex.select('email', 'client_id')
        .from('userclients')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        });
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
        });
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
        });
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
        });
};


// sets the active status to the value is isActive
exports.setClientInactive = function(id, isActive, res, callback) {
    knex('client').where('id', id).update({
        active: isActive
    }).asCallback(function(err, rows) {
        callback(err, res);
    });
};
