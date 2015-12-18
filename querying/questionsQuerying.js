// The database connection.
var db = require("../db/db.js");

// Get all the questions available to a client given a form and a client.
exports.getAllQuestions = function (client_id, form_id, res, callback) {
    var sql = "SELECT ClientQuestionResponse.client_id, ClientQuestionResponse.note, Form.name as form_name, Question.id, Question.text, Question.category_id, ClientQuestionResponse.response_id, ClientQuestionResponse.weight\
    FROM ClientQuestionResponse \
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id\
    INNER JOIN Form On Question.form_id = Form.id\
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";
    db.callQuery(res, callback, sql, [form_id, client_id]);
};

// Get all the information required to generate a score on the results page.
// TODO: This query is quite simular to "getAllQuestions" amd the application
// should be refactored to just use a single query.
exports.getAllAnswers = function (client_id, form_id, res, callback) {
    var sql = "SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
    ClientQuestionResponse.weight, Question.category_id, Question.group_id, Grouping.name\
    FROM ClientQuestionResponse\
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
    INNER JOIN Grouping ON Question.group_id=Grouping.id \
    LEFT  JOIN Response ON ClientQuestionResponse.response_id=Response.id \
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";
    db.callQuery(res, callback, sql, [form_id, client_id]);
};

// Return all the responses to populate the answers in the question form.
exports.getAllResponses = function (res, callback) {
    var sql = "SELECT * FROM RESPONSE";
    db.callQuery(res,callback, sql);
};

// Return a list of forms for a given client. Right now every client has
// every form but in the future there may be forms which are unique to a client.
exports.getAllFormsByClient = function (client_id, res, callback) {
    var sql = "SELECT DISTINCT Form.id, Form.name FROM Form\
    INNER JOIN Question on Form.id=Question.form_id\
    INNER JOIN ClientQuestionResponse on Question.id = ClientQuestionResponse.question_id\
    WHERE  ClientQuestionResponse.client_id = ?"
    db.callQuery(res,callback, sql, [client_id]);
};

// TODO: Again the above method can probably be refactored to include the information
// gathered from this query.
exports.getAllForms = function (res, callback) {
    var sql = "SELECT DISTINCT Form.id, Form.name, ClientQuestionResponse.client_id FROM Form\
    INNER JOIN Question on Form.id=Question.form_id\
    INNER JOIN ClientQuestionResponse on Question.id = ClientQuestionResponse.question_id"
    db.callQuery(res,callback, sql);
};

// Get all the questions for a given form.
exports.getQuestionsByForm = function(form_id, res, callback) {
    var sql = "SELECT * from Question WHERE Question.form_id = ?";
    console.log(sql);
    console.log(form_id);
    db.callQuery(res, callback, sql, [form_id]);
}

// Return a list of clients.
exports.getClients = function (res, callback) {
    var sql = "SELECT Client.id, Client.name, Client.industry, Client.phone, Client.contact, Client.country, Client.email from Client";
    db.callQuery(res,callback, sql);
};
