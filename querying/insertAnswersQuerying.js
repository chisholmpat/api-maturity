var db = require ("../db/db.js");
// responses[i].response.id, responses[i].id, responses[i].client_id], callback,  i == responses.length - 1
exports.addAnswers = function(response_id, question_id, client_id, res, isFinished, callback) {

  var sql = "UPDATE ClientQuestionResponse\
                 SET response_id = ?\
                 WHERE question_id = ? AND client_id = ?"

  var pool = db.getPool();

  console.log("Attempting to INSERT records.")
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, results, isFinished); return; }
    // make the query
    connection.query(sql, [response_id, question_id, client_id], function(err, results) {
      if(isFinished)
      connection.release();
      if(err) { console.log(err); callback(res, err, results, isFinished); return; }
      callback(res, err, results, isFinished);
    });
});
}
