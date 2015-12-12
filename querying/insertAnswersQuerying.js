var db = require ("../db/db.js");
var pool = db.getPool();

exports.addAnswers = function(query, res, callback) {


  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(res, err); return; }
    // make the query
    connection.query(query, [], function(err, results) {
      if(err) { console.log(err); callback(res, err); return; }
      console.log(results.affectedRows + " rows affected.")
      connection.release();
      callback(res, err);
    });
});
};
