var db = require("../db/db.js");

exports.insertClient = function (client, res, callback) {

    var sql = "INSERT INTO Client(name, industry, country, contact, email, phone) VALUES(?,?,?,?,?,?)";

    db.callQuery(res, callback, sql, [client.name, client.industry,
      client.country, client.contact, client.email, client.phone]);

    // This call handles a database design flaw which will be sorted soon.
    // For now if a new client is created they need to have records created
    // in the client question response table so that they have a record which
    // can be updated.


    var sql = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , LAST_INSERT_ID(), 1 from Question WHERE Question.category_id = 1"

    db.callQueryWithNoCallBackOrParams(sql);

    var sql = "INSERT INTO ClientQuestionResponse (question_id, client_id, response_id )\
               SELECT DISTINCT id , (SELECT MAX(id) from Client), 8 from Question WHERE Question.category_id = 2"

    db.callQueryWithNoCallBackOrParams(sql);

};


exports.updateClient = function (client, res, callback) {

  console.log(client);
  var sql = "Update Client\
  set name=?, industry=?, country=?, contact=?, email=?, phone=? \
  WHERE Client.id=?"

  db.callQuery(res, callback, sql, [client.name, client.industry,
    client.country, client.contact, client.email, client.phone, client.id]);

};
