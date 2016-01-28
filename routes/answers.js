// TODO Jan22/15 Rename user_responses to userResponses in the FE.
// Module for handling queries related to answers.
// Broke out into own file as there may be more
// queries related to generating analytics.
module.exports = function(app) {

    var queries = require('../querying/answersQuerying');
    var dbUtils = require('../helpers/db_util');

    // Insert the completed questions into the database
    app.post('/insertAnswers', dbUtils.checkAuthenticated, function(req, res) {

        console.log("Responses:" + req.body.user_responses.length);
        console.log("Newly Answered:" + req.body.newly_answered_responses.length);

        for(i = 0; i < req.body.newly_answered_responses.length;i++)
          console.log(req.body.newly_answered_responses[i]);

        queries.updateAnswers(res, req.body.user_responses, function(req, res){});
        queries.addNewlyAnswered(res, req.body.newly_answered_responses, req.body.client_id, dbUtils.callbackNoReturn);
    });
};
