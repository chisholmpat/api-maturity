var fs = require('fs');
var file = "./db/api_maturity_revised.sqlite";
var sqlite3 = require('sqlite3').verbose();
var dbAdapter = new sqlite3.Database(file);

exports.addAllAnswersClientForm = function (req, res, err_string, client_id, response_id, question_id) {

    dbAdapter.serialize(function(){
      //Perform SELECT Operation
      dbAdapter.all("UPDATE ClientQuestionResponse\
                     SET response_id = ?\
                     WHERE question_id = ? AND client_id = ?", response_id, question_id, client_id,
                     function(err){
                        //query result dumped as an array into results_array;
                        err_string += err;
                     }
      );
    });
}
