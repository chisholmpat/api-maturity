var fs = require('fs');
var file = "./db/api_maturity.sqlite";
var sqlite3 = require('sqlite3').verbose();
var dbAdapter = new sqlite3.Database(file);

exports.getAllResponseForCategory= function (req, res, err_string, results_array, form_id, client_id, question_category, callBack) {
  dbAdapter.serialize(function(){
    //Perform SELECT Operation
    dbAdapter.all("SELECT Question.text, ClientQuestionResponse.weight FROM ClientQuestionResponse INNER JOIN Question  ON ClientQuestionResponse.question_id=Question.id WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ? AND Question.category = ?; ", form_id, client_id, question_category,
      function(err,rows){
        //query result dumped as an array into results_array;
        err_string = err;
        results_array = rows;
        callBack(req, res, err_string, results_array);
      }
    );
  });
}
