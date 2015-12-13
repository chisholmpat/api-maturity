var db = require("../db/db.js");
var pool = db.getPool();

exports.addAnswers = function (res, callback, responses) {

    var query = " Update ClientQuestionResponse SET response_id = CASE ";

    for (i = 0; i < responses.length; i++) {
        console.log(responses[i]);
        query += "  WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN " + responses[i].response_id
    }

    query += " ELSE response_id END";

    db.callQuery(res, callback, query);
};
