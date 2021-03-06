module.exports = function(app) {

    var queries = require('../querying/questionsQuerying');
    var csv = require('express-csv');
    var dbUtils = require('../helpers/db_util');


    // return all questions by client and form id
    //All Questions from clientQuestionsResponses, basically get the answered questions first
    app.get('/questions/:client_id/:form_id/:assessment_id', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, canView) {
            if (canView) {
                queries.getAllQuestions(req.params.client_id, req.params.form_id, req.params.assessment_id, res, dbUtils.callback);
            } else {
                res.send(403);
            }
        });
    });

    //Return all unanswered questions for the form
    app.get('/unansweredQuestions/:client_id/:form_id/:assessment_id', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, canView) {
            if (canView) {
                queries.getallUnansweredQuestions(req.params.client_id, req.params.form_id, req.params.assessment_id, res, dbUtils.callback);
            } else {
                res.send(403);
            }
        });
    });

    // get all scores for a client form assessment
    app.get('/score/:client_id/:form_id/:assessment_id', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.params.client_id, req.user.email, function(err, permitted) {
            if (permitted) {
                queries.getClientAnswers(req.params.client_id, req.params.form_id, req.params.assessment_id, res, dbUtils.callback);
            } else
                res.send(403);
        });
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
        queries.addForm(req.body.formName,res, dbUtils.callbackNoReturn);
    });

    // check if the form_name is unique
    app.get('/checkUniqueFormName/:formname', function(req, res) {
        queries.checkUniqueFormname(req.params.formname, res, dbUtils.callback);
    });

    // get all assessments 
    app.get('/assessments/', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllAssessments(res, dbUtils.callback);
    });

    // get client information given the assessment id
    app.get('/assmentdetails/:assessment_id', function(req, res) {
        queries.getAssessmentDetails(req.params.assessment_id, res, dbUtils.callback);
    });

    // create a new asssessment of the given category for the client
    app.post("/createassessment", function(req, res) {
        queries.createNewAssessment(res, req.body.client_id, dbUtils.callback);
    });

    // return all category information
    app.get('/categories', function(req, res) {
        queries.getAllCategories(res, dbUtils.callback);
    });
};
