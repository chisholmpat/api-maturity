var db = require("../db/db.js");

// Insert a new customer into the database.
exports.insertClient = function (client, res, callback) {

    var sql = "INSERT INTO Client(name, industry, country, contact, email, phone) VALUES(?,?,?,?,?,?)";

    db.callQueryWithNoCallBack(sql, [client.name, client.industry,
      client.country, client.contact, client.email, client.phone]);

    // This call handles a database design flaw which will be sorted soon.
    // For now if a new client is created they need to have records created
    // in the client question response table so that they have a record which
    // can be updated.

    var sql = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 1 from Question WHERE Question.category_id = 1"

    db.callQueryWithNoCallBack(sql, []);

    var sql = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 8 from Question WHERE Question.category_id = 2"

    db.callQueryWithNoCallBack(sql, []);

};

// Update a client.
exports.updateClient = function (client, res, callback) {
  var sql = "Update Client set name=?, industry=?, country=?, contact=?,\
  email=?, phone=? WHERE Client.id=?"
  db.callQuery(res, callback, sql, [client.name, client.industry,
    client.country, client.contact, client.email, client.phone, client.id]);

};
