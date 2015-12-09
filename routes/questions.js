var questionsQuerying = require('../querying/questionsQuerying.js');

function getAllQuestionsCallBack(req, res, err_string, results_array){
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
    app.get('/questions', function(req, res, next) {
      var err_string;
      var results_array;

      questionsQuerying.getAllQuestions(req, res, err_string, results_array, getAllQuestionsCallBack);
    });

    // app.get('/questions/:form_id:category:client_id', function(req, res) {
    //
    // });
}
