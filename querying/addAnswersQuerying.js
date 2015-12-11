var db = require ("../db/db.js");

exports.addAnswers = function(response_id, question_id, client_id, req, res, finished, callback) {

  var sql = "UPDATE ClientQuestionResponse\
                 SET response_id = ?\
                 WHERE question_id = ? AND client_id = ?"

  var pool = db.getPool();
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, results); return; }
    // make the query
    connection.query(sql, [response_id, question_id, client_id, function(err, results) {
      if(finished)
      connection.release();
      if(err) { console.log(err); callback(res, err, results); return; }
      callback(res, err, results);
    });
});
}
