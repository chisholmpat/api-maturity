var db = require ("../db/db.js");

exports.getAllQuestions = function(client_id, form_id, res, callback) {

  var sql = "SELECT ClientQuestionResponse.client_id, Question.id, Question.text, Question.category_id, ClientQuestionResponse.response_id, ClientQuestionResponse.weight\
    FROM ClientQuestionResponse INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id\
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";
  var pool = db.getPool();
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, results); return; }
    // make the query
    connection.query(sql, [client_id, form_id], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(res, err, results); return; }
      callback(res, err, results);
    });
});
};

exports.getAllAnswers = function(client_id, form_id, res, callback) {

  var sql = "SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
    ClientQuestionResponse.weight, Question.category_id, Grouping.name\
    FROM ClientQuestionResponse\
    INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
    INNER JOIN Grouping ON Question.group_id=Grouping.id \
    LEFT  JOIN Response ON ClientQuestionResponse.response_id=Response.id \
    WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?";

  var pool = db.getPool();
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, results); return; }
    // make the query
    connection.query(sql, [client_id, form_id], function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(res, err, results); return; }
      callback(res, err, results);
    });
});
};

exports.getAllResponses = function(res, callback) {

  var sql = "SELECT * FROM RESPONSE";
  var pool = db.getPool();
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err, results); return; }
    // make the query
    connection.query(sql, function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(res, err, results); return; }
      callback(res, err, results);
    });
});
}
