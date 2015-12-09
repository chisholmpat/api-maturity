var fs = require('fs');
var file = "./db/api_maturity.sqlite";
var sqlite3 = require('sqlite3').verbose();
var dbAdapter = new sqlite3.Database(file);

exports.getAllQuestions = function (req, res, err_string, results_array, callBack) {
  dbAdapter.serialize(function(){
    //Perform SELECT Operation
    dbAdapter.all("SELECT * FROM Question", function(err,rows){
        //query result dumped as an array into results_array;
        err_string = err;
        results_array = rows;
        callBack(req, res, err_string, results_array);
    });
  });
}
