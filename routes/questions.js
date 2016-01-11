// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
function callback(err, res, results) {
    if (!err) {
        res.send(results);
    } else {
        console.log(err);
        res.send('400');
    }
}

module.exports = function(app) {

    // Dependencies
    var queries = require('../querying/questionsQuerying');
    var csv = require('express-csv');

    // Return all questions by client and form id
    app.get('/questions/:client_id/:form_id', function(req, res) {
        queries.getAllQuestions(req.params.client_id, req.params.form_id, res, callback);
    });

    // This is just temperorary until I'm able to figure out how to make it 
    // so that the request will be formatted as /question/1/2.csv
    app.get('/questions/:client_id/:form_id/csv', function(req, res) {

        var sendCSV = function(err, res, results) {
            var headers = {};
            for (var key in results[0]) {
                headers[key] = key;
            }
            
            var fileName = req.params.client_id + '_' + req.params.form_id + '.csv';
            res.setHeader('Content-disposition', 'attachment; filename=' +fileName);
            results.unshift(headers);
            res.csv(results);
        };

        queries.getClientAnswers(req.params.client_id, req.params.form_id, res, sendCSV);

    });


    // Return all scores
    app.get('/score/:client_id/:form_id', function(req, res) {
        queries.getClientAnswers(req.params.client_id, req.params.form_id, res, callback);
    });

    // Get all possible responses
    app.get('/responses', function(req, res) {
        queries.getAllResponses(res, callback);
    });

    // Get all forms for a particular client
    app.get('/forms/:client_id', function(req, res) {
        queries.getAllFormsByClient(req.params.client_id, res, callback);
    });

    // Get a list of all the clients
    app.get('/clients', function(req, res) {
        queries.getClients(res, callback);
    });

    // Get a list of all the forms.
    app.get('/forms', function(req, res) {
        queries.getAllForms(res, callback);
    });

    // Get the questions associated with a form.
    app.get("/questions/:form_id", function(req, res) {
        queries.getQuestionsByForm(req.params.form_id, res, callback);
    });

    // Get all groupings
    app.get("/groupings", function(req, res) {
        queries.getGroupings(res, callback);
    });

    // Update questions
    app.post("/update_questions", function(req, res) {
        queries.updateQuestions(res, callback, req.body.questions);
    });



};
