var knex = require("../db/db.js").knex;

// This method takes each response submitted and updates the
// corresponding record in the CQResponse table. TODO: Right
// now a series of queries need to be called. My plan is to
// move these into a stored procedure, reduce the reduncancy
// and normalize the database so that only a single call is required.
exports.addAnswers = function(res, callback, responses) {

    var updateResponseQuery = " Update ClientQuestionResponse SET response_id = CASE ";
    var updateWeightQuery = "Update ClientQuestionResponse SET weight = CASE ";
    var updateNoteQuery = ''; //"Update ClientQuestionResponse SET note = CASE ";

    for (i = 0; i < responses.length; i++) {

        // Construct response_id update query for multiple entries.
        updateResponseQuery += "  WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN " + responses[i].response_id

        // Construct weight update query for multiple entries
        updateWeightQuery += " WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " THEN " + responses[i].weight

        // Construct note update query.
        if (responses[i].note !== null && 0 !== responses[i].note.length) {

            // To avoid having an empty case statement.
            if (updateNoteQuery.length === 0)
                updateNoteQuery = "Update ClientQuestionResponse SET note = CASE ";
            
            updateNoteQuery += " WHEN question_id =" + responses[i].id +
                " AND client_id = " + responses[i].client_id + " THEN '" + responses[i].note + "'"
        }

    }

    updateResponseQuery += " ELSE response_id END";
    updateWeightQuery += " ELSE weight END";
    updateNoteQuery += " ELSE note END";

    knex.raw(updateResponseQuery).asCallback(function(err, rows) {
        knex.raw(updateWeightQuery).asCallback(function(err, rows) {
            knex.raw(updateNoteQuery).asCallback(function(err, rows) {
                callback(res, err, rows);
            });
        });
    });

};
