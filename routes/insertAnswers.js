var queries = require('../querying/insertAnswersQuerying');

function callback(err, res) {
    if (err) {
        console.log(err);
        res.send('400');
    }
    res.send('200');
}
module.exports = function(app) {

    app.post('/insertAnswers', function(req, res) {
        console.log(req.body.user_responses);
        queries.addAnswers(res, callback, req.body.user_responses);
    });
};
