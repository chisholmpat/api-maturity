// The database connection.
var knex = require("../db/db.js").knex;

// Get all the questions available to a client given a form and a client
// TODO December 20th, 2015 : Reduce size/complexity of this query.
exports.getAllQuestions = function(client_id, form_id, res, callback) {

    knex.select('ClientQuestionResponse.client_id', 'ClientQuestionResponse.note',
            'Form.name as form_name', 'Question.id', 'Question.text', 'Question.category_id',
            'ClientQuestionResponse.response_id', 'ClientQuestionResponse.weight')
        .from('ClientQuestionResponse')
        .innerJoin('Question', 'ClientQuestionResponse.question_id', 'Question.id')
        .innerJoin('Form', 'Question.form_id', 'Form.id')
        .where('Question.form_id', form_id)
        .where('ClientQuestionResponse.client_id', client_id)
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// Function to retrieve all of the answers that a client has submitted to calculate score.
// TODO December 20th, 2015 : Reduce size/completexity of this query.
exports.getClientAnswers = function(client_id, form_id, res, callback) {

    knex.select('Response.response', 'Response.value', 'Question.text', 'Question.id',
            'ClientQuestionResponse.response_id', 'ClientQuestionResponse.weight',
            'Question.category_id', 'Question.group_id', 'Grouping.name')
        .from('ClientQuestionResponse')
        .innerJoin('Question', 'ClientQuestionResponse.question_id', 'Question.id')
        .innerJoin('Grouping', 'Question.group_id', 'Grouping.id')
        .leftJoin('Response', 'ClientQuestionResponse.response_id', 'Response.id')
        .where('Question.form_id', form_id)
        .where('ClientQuestionResponse.client_id', client_id)
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};


// Return all the possible responses to a question.
exports.getAllResponses = function(res, callback) {
    knex.select().table('response').
    asCallback(function(err, rows) {
        callback(res, err, rows);
    });
};

// Return a list of forms for a given client. Right now every client has
// every form but in the future there may be forms which are unique to a client.
// TODO This query can be replaced by a more generic form query.
exports.getAllFormsByClient = function(client_id, res, callback) {

    // Select form information for client.
    knex.select('Form.id', 'Form.name')
        .from('Form').innerJoin('Question', 'Form.id', 'Question.form_id')
        .innerJoin('ClientQuestionResponse', 'Question.id', 'ClientQuestionResponse.question_id')
        .where('client_id', client_id)
        .distinct('*').asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// TODO: Again the above method can probably be refactored to include the information
// gathered from this query.
exports.getAllForms = function(res, callback) {
    knex.select().table('form')
        .distinct('*')
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// Get all the questions for a given form.
exports.getQuestionsByForm = function(form_id, res, callback) {
    knex.select('Question.*', 'Form.name')
        .from('Question')
        .innerJoin('Form', 'Question.form_id', 'Form.id')
        .where('Question.form_id', form_id)
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// Return a list of clients.
exports.getClients = function(res, callback) {
    knex.select().table('client')
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// Return a list of groupings.
exports.getGroupings = function(res, callback) {
    knex.select().table('grouping')
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// Return a list of forms.
exports.getForms = function(res, callback) {
    knex.select().table('form')
        .asCallback(function(err, rows) {
            callback(res, err, rows);
        })
};

// TODO This query is rather hideous right now, there has
// to be a more elegant way of performing multiple unique
// updates against the database apart from a for-loop.
exports.updateQuestions = function(res, callback, questions) {

    var updateTextQuery = " Update Question SET text = CASE ";
    var updateGroupQuery = " Update Question SET group_id = CASE ";

    for (i = 0; i < questions.length; i++) {
        updateTextQuery += "  WHEN id =" + questions[i].id +
            " THEN '" + questions[i].text + "'";

        updateGroupQuery += "  WHEN id =" + questions[i].id +
            " THEN " + questions[i].group_id;
    }

    updateTextQuery += " ELSE text END";
    updateGroupQuery += " ELSE group_id END";;

    // TODO Fix this logic. Right now the callback 
    // for the first query is the second query. Also
    // There is the possibility for SQL injection here.
    knex.raw(updateTextQuery)
        .asCallback(function(err, rows) {
            knex.raw(updateGroupQuery)
                .asCallback(function(err, rows) {
                    callback(res, err, rows);
                })
        });
}
