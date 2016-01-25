module.exports = function(app) {

    var queries = require('../querying/questionsQuerying');
    var csv = require('express-csv');
    var dbUtils = require('../helpers/db_util');

    // return all questions by client and form id
    app.get('/questions/:client_id/:form_id', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, canView) {
            if (canView)
                queries.getAllQuestions(req.params.client_id, req.params.form_id, res, dbUtils.callback);
            else
                res.send(403);
        });
    });

    // return the questions and responses for a client for in CSV
    app.get('/questions/:client_id/:form_id/csv', dbUtils.checkAuthenticated, function(req, res) {

        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, permitted) {
            if (permitted) {

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
            } else

                res.send('403');
        })
    });

    // get all scores
    app.get('/score/:client_id/:form_id', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, permitted) {
            if (permitted) {
                queries.getClientAnswers(req.params.client_id, req.params.form_id, res, dbUtils.callback);
            } else
                res.send(403);
        })
    });

    // toggles the active status of a question
    app.post('/deleteQuestion', dbUtils.checkAuthenticated, function(req, res) {
        queries.deleteQuestion(req.body.id, res, dbUtils.callbackNoReturn);
    });

    // get all possible responses
    app.get('/responses', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllResponses(res, dbUtils.callback);
    });

    // get a list of all the forms.
    app.get('/forms', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllForms(res, dbUtils.callback);
    });

    // toggles the active status of a form
    app.post('/deleteForm', dbUtils.checkAuthenticated, function(req, res) {
        queries.deleteForm(req.body.id, res, dbUtils.callbackNoReturn);
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
        queries.updateQuestions(res, req.body.questions, dbUtils.callbackNoReturn);
    });

    // add question to database
    app.post("/addQuestion", dbUtils.checkAuthenticated, function(req, res) {
        queries.addQuestion(req.body.question, res, dbUtils.callbackNoReturn);
    });

    // add a form to the form table
    app.post("/addForm", dbUtils.checkAuthenticated, function(req, res) {
        console.log("reached Add Forms ");
    });

};
