var questionsQuerying = require('../querying/questionsQuerying.js');

function getAllQuestionsClientFormCallBack(req, res, err_string, results_array){
    console.log(err_string);
    console.log(results_array);
    if(!err_string){
      res.send(results_array);
    }
    else{
      res.send(err_string);
    }
}

module.exports = function(app) {

    var bodyParser = require('body-parser');

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    app.get('/questions', function(req, res, next) {
      var err_string;
      var results_array;
      var form_id = req.body.form_id || 1;
      var client_id = req.body.client_id || 1;
      var question_category = req.body.question_category || "QA";

      questionsQuerying.getAllQuestionsClientForm(req, res, err_string, results_array, form_id, client_id, question_category, getAllQuestionsClientFormCallBack);
    });

    // app.get('/questions/:form_id:category:client_id', function(req, res) {
    //
    // });
}
