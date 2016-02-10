// TODO Jan22/15 Rename user_responses to userResponses in the FE.
// Module for handling queries related to answers.
// Broke out into own file as there may be more
// queries related to generating analytics.
module.exports = function(app) {

    var queries = require('../querying/answersQuerying');
    var dbUtils = require('../helpers/db_util');

    // Insert the completed questions into the database
    app.post('/insertAnswers', dbUtils.checkAuthenticated, function(req, res) {
        console.log("ASSESSMENTID: " + req.body.assessmentID);
        console.log("BODY: " + req.body.answersToUpdate);
        console.log("NEWLY ANSWERED: " + req.body.answersToAdd);
        queries.updateAnswers(res, req.body.answersToUpdate, req.body.assessmentID, function(req, res){});
        queries.addNewlyAnswered(res, req.body.answersToAdd, req.body.clientID, req.body.assessmentID, dbUtils.callbackNoReturn);
    });
};
