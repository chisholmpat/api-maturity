// The database connection
var knex = require("../db/db.js").knex;

// This method takes each response submitted and updates the
// corresponding record in the CQResponse table. TODO: Right
// now a series of queries need to be called. My plan is to
// move these into a stored procedure, reduce the reduncancy
// and normalize the database so that only a single call is required.
// Also, it causes SQL errors on some calls. This really is bad.
exports.updateAnswers = function(res, responses, assessment_id, callback) {

    var updateResponseQuery = " Update ClientQuestionResponse SET response_id = CASE ";
    var updateWeightQuery = "Update ClientQuestionResponse SET weight = CASE ";
    var updateNoteQuery = ''; //"Update ClientQuestionResponse SET note = CASE ";

    for (i = 0; i < responses.length; i++) {

        // Construct response_id update query for multiple entries.
        updateResponseQuery += "  WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " AND assessment_id = " + assessment_id + 
               " THEN " + responses[i].response_id;

        // Construct weight update query for multiple entries
        updateWeightQuery += " WHEN question_id =" + responses[i].id +
            " AND client_id = " + responses[i].client_id + " AND assessment_id = " + assessment_id +
               " THEN " + responses[i].weight;

        // Construct note update query.
        if (responses[i].note !== null && 0 !== responses[i].note.length) {

            // To avoid having an empty case statement.
            if (updateNoteQuery.length === 0)
                updateNoteQuery = "Update ClientQuestionResponse SET note = CASE ";

            updateNoteQuery += " WHEN question_id =" + responses[i].id +
                " AND client_id = " + responses[i].client_id + " AND assessment_id = " + assessment_id +
                   " THEN '" + responses[i].note + "'";
        }
    }

    updateResponseQuery += " ELSE response_id END";
    updateWeightQuery += " ELSE weight END";
    updateNoteQuery += " ELSE note END";

    // TODO Handle the error in this query so that errors can 
    // appropriately be reported and sent back.
    knex.raw(updateResponseQuery).asCallback(function(err, rows) {
        console.log(1, err);
        knex.raw(updateWeightQuery).asCallback(function(err, rows) {
          console.log(2, err);

            knex.raw(updateNoteQuery).asCallback(function(err, rows) {
              console.log(3, err);

                callback('', res);
            });
        });
    });

};

// Inserts any previously unanswered questions into the database.
// Uses recursion to iterate over all of the response objects.
exports.addNewlyAnswered = function(res, responses, client_id, assessment_id, callback) {
    var index = 0;
    var error = null;
    console.log("Adding new answers.");
    for(i = 0; i < responses.length; i++)
      console.log(responses[i]);
    addNext(index, client_id, responses, assessment_id, callback, res, error);
};

// Recursive call used to insert records into the database. Recursion
// is used to handle multiple records being inserted into the database.
// TODO: Change this into a single call to the backend.
function addNext(index, client_id, responses, assessment_id, callback, res, error) {

  console.log("Response: " + responses[index]);

    if (index >= responses.length)
        callback(error, res);
    else {
        if (responses[index].response_id) {

            knex('ClientQuestionResponse')
                .insert({
                    response_id: responses[index].response_id,
                    question_id: responses[index].id,
                    client_id: client_id,
                    weight: responses[index].weight || 0,
                    note: responses[index].note,
                    assessment_id: assessment_id
                }).asCallback(function(err, rows) {
                    addNext(index + 1, client_id, responses, assessment_id, callback, res, err);
                });
        } else {
            addNext(index + 1, client_id, responses, assessment_id, callback, res, error);
        }
    }
}
