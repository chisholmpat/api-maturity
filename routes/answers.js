module.exports = function(app) {

    var queries = require('../querying/insertAnswersQuerying');
    var dbUtils = require('../helpers/db_util');

    app.post('/insertAnswers', function(req, res) {
        queries.addAnswers(res, req.body.user_responses, dbUtils.callback);
    });
};
