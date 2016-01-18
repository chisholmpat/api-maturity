module.exports = function(app) {

    var queries = require('../querying/answersQuerying');
    var dbUtils = require('../helpers/db_util');

    app.post('/insertAnswers', dbUtils.checkAuthenticated, function(req, res) {
        queries.addAnswers(res, req.body.user_responses, dbUtils.callbackNoReturn);
    });
};
