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
    var mysql = require('mysql');;
    var queries = require('../querying/questionsQuerying');

    // Return all questions by client and form id
    app.get('/questions/:client_id/:form_id', function (req, res) {
        queries.getAllQuestions(req.params.client_id, req.params.form_id, res, callback);
    });

    // Return all scores
    app.get('/score/:client_id/:form_id', function (req, res) {;
        queries.getAllAnswers(req.params.client_id, req.params.form_id, res, callback);
    });

    app.get('/responses', function (req, res) {
        queries.getAllResponses(res, callback);
    });

    app.get('/forms/:client_id', function (req, res) {
        queries.getAllForms(req.params.client_id, res, callback);
    });
};
