var db = require("../db/db.js");

exports.insertClient = function (name, res, callback) {

    var sql = "INSERT INTO Client(name) VALUES(?)";

    db.callQuery(res, callback, sql, [name]);

    var sql = "INSERT INTO ClientQuestionResponse (question_id, client_id)\
               SELECT DISTINCT id , LAST_INSERT_ID() from Question"

    // This call handles a database design flaw which will be sorted soon.
    // For now if a new client is created they need to have records created
    // in the client question response table so that they have a record which
    // can be updated.
    db.callQueryWithNoCallBackOrParams(sql);

};


