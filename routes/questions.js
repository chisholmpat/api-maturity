module.exports = function(app) {
    
    var queries = require('../querying/questionsQuerying');
    var csv = require('express-csv');
    var dbUtils = require('../helpers/db_util');

    // return all questions by client and form id
    app.get('/questions/:client_id/:form_id', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllQuestions(req.params.client_id, req.params.form_id, res, dbUtils.callback);
    });

    // return the questions and responses for a client for in CSV
    app.get('/questions/:client_id/:form_id/csv', dbUtils.checkAuthenticated, function(req, res) {

        var sendCSV = function(err, res, results) {
            var headers = {};
            for (var key in results[0]) {
                headers[key] = key;
            }

            var fileName = req.params.client_id + '_' + req.params.form_id + '.csv';
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            results.unshift(headers);
            res.csv(results);
        };

        queries.getClientAnswers(req.params.client_id, req.params.form_id, res, sendCSV);

    });

    // get all scores
    app.get('/score/:client_id/:form_id', dbUtils.checkAuthenticated, function(req, res) {
        queries.getClientAnswers(req.params.client_id, req.params.form_id, res, dbUtils.callback);
    });

    // get all possible responses
    app.get('/responses', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllResponses(res, dbUtils.callback);
    });


    // get a list of all the forms.
    app.get('/forms', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllForms(res, dbUtils.callback);
    });

    // get the questions associated with a form.
    app.get("/questions/:form_id", dbUtils.checkAuthenticated, function(req, res) {
        queries.getQuestionsByForm(req.params.form_id, res, dbUtils.callback);
    });

    // get all groupings
    app.get("/groupings", dbUtils.checkAuthenticated, function(req, res) {
        queries.getGroupings(res, dbUtils.callback);
    });

    // update questions
    app.post("/update_questions", dbUtils.checkAuthenticated, function(req, res) {
        queries.updateQuestions(res, req.body.questions, dbUtils.callback);
    });

};
