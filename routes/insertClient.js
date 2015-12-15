
var queries = require('../querying/insertClientQuerying');

function callback(res,err_string) {
    if(err_string){
        console.log(err_string)
    }
    res.send('200')
}
module.exports = function (app) {

    app.post('/insertClient', function (req, res) {
        queries.insertClient(req.body.name, res, callback);
    })
};
