
var queries = require('../querying/insertAnswersQuerying');

function callback(res,err_string) {
    if(err_string){
        console.log(err_string)
    }
    res.send('200')
}
module.exports = function (app) {

    app.post('/insertAnswers', function (req, res) {
        queries.addAnswers( res, callback,  req.body.user_responses);
        
    })
};
