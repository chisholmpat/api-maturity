// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
function callback(res, err_string, results_array) {
    if (!err_string) {
        res.send(results_array);
    }
    else {
        console.log(err_string);
    }
}

module.exports = function (app) {
    // Dependencies
    var mysql = require('mysql');
    var queries = require('../querying/questionsQuerying');

    // Return all questions by client and form id
    app.get('/questions/:client_id/:form_id', function (req, res) {
        queries.getAllQuestions(req.params.client_id, req.params.form_id, res, callback);
    });

    // Return all scores
    app.get('/score/:client_id/:form_id', function (req, res) {
        queries.getAllAnswers(req.params.client_id, req.params.form_id, res, callback);
    });

    // Get all possible responses
    app.get('/responses', function (req, res) {
        queries.getAllResponses(res, callback);
    });

    // Get all forms for a particular client
    app.get('/forms/:client_id', function (req, res) {
        queries.getAllFormsByClient(req.params.client_id, res, callback);
    });

    // Get a list of all the clients
    app.get('/get_clients', function (req, res) {
        queries.getClients(res, callback);
    });

    // Get a list of all the forms.
    app.get('/get_forms', function (req, res) {
        queries.getAllForms(res, callback);
    });

    // Get a list of all the forms.
    app.get('/forms', function (req, res) {
        queries.getForms(res, callback);
    });

    // Get the questions associated with a form.
    app.get("/questions/:form_id", function (req, res) {
        queries.getQuestionsByForm(req.params.form_id, res, callback);
    });

    //
    app.get("/groupings", function (req, res) {
        queries.getGroupings(res, callback);
    });


};
