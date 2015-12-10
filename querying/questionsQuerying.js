var fs = require('fs');
var file = "./db/api_maturity_revised.sqlite";
var sqlite3 = require('sqlite3').verbose();
var dbAdapter = new sqlite3.Database(file);

exports.getAllQuestionsClientForm = function (req, res, err_string, results_array, form_id, client_id, callBack) {

   dbAdapter.serialize(function(){
    //Perform SELECT Operation
    dbAdapter.all("SELECT Question.text, Question.id, ClientQuestionResponse.response_id, ClientQuestionResponse.weight, Question.category_id\
                   FROM ClientQuestionResponse INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
                   WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?", form_id, client_id,
                   function(err,rows){
                      //query result dumped as an array into results_array;
                      err_string = err;
                      results_array = rows;
                      callBack(req, res, err_string, results_array);
                   }
    );
  });
}

exports.getAllResponses = function (req, res, err_string, results_array, callBack) {

   dbAdapter.serialize(function(){
    //Perform SELECT Operation
    dbAdapter.all("SELECT * FROM Response",
      function(err,rows){
        //query result dumped as an array into results_array;
        err_string = err;
        results_array = rows;
        callBack(req, res, err_string, results_array);
      }
    );
  });
}

exports.getDataForScore = function (req, res, err_string, results_array, form_id, client_id, callBack) {

   dbAdapter.serialize(function(){
    //Perform SELECT Operation
    dbAdapter.all('SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
                   ClientQuestionResponse.weight, Question.category_id\
                  FROM ClientQuestionResponse\
                  INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
                  LEFT  JOIN Response ON ClientQuestionResponse.response_id=Response.id \
 WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?', form_id, client_id,
                   function(err,rows){
                      //query result dumped as an array into results_array;
                      err_string = err;
                      results_array = rows;
                      callBack(req, res, err_string, results_array);
                   }
    );
  });
}
