var db = require("../db/db.js");

exports.userLoginValidate = function (username, password, req, callback) {

  // we are checking to see if the user trying to login already exists
  var sql = "SELECT * from users where username = ? AND password =? ";
  db.callQuery(req, callback, sql, [username, password]);

};
