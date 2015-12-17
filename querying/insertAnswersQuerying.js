var db = require("../db/db.js");

// This method takes each response submitted and updates the
// corresponding record in the CQResponse table. TODO: Right
// now a series of queries need to be called. My plan is to
// move these into a stored procedure, reduce the reduncancy
// and normalize the database so that only a single call is required.
exports.addAnswers = function (res, callback, responses) {

    var query = " Update ClientQuestionResponse SET response_id = CASE ";

    for (i = 0; i < responses.length; i++) {
        console.log(responses[i].client_id)
        query += "  WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN " + responses[i].response_id
    }

    query += " ELSE response_id END";

    db.callQueryWithNoCallBack(query);

    var query = "Update ClientQuestionResponse SET weight = CASE ";

    for (i = 0; i < responses.length; i++) {
        query += " WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN " + responses[i].weight
    }

    query += " ELSE weight END";


    var query = "Update ClientQuestionResponse SET note = CASE ";


    for (i = 0; i < responses.length; i++) {
      if(responses[i].note !== null) {
        query += " WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN '" + responses[i].note + "'"
        }
    }

    query += " ELSE note END";

        console.log(query);

    db.callQuery(res, callback, query);

};
