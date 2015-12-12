var db = require ("../db/db.js");
var pool = db.getPool();

exports.addAnswers = function(response_id, question_id, client_id, res,  callback, isFinished) {

    console.log("Attempting to ADD " + response_id);

  var sql = "UPDATE ClientQuestionResponse\
                 SET response_id = ?\
                 WHERE question_id = ? AND client_id = ?";



  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, isFinished); return; }
    // make the query
    connection.query(sql, [response_id, question_id, client_id], function(err, results) {
      if(err) { console.log(err); callback(res, err, isFinished); return; }
        connection.release();
      callback(res, err, isFinished);
    });
});
};
