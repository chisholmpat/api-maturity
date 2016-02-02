var knex = require("../db/db.js").knex;

// This method takes each response submitted and updates the
// corresponding record in the CQResponse table. TODO: Right
// now a series of queries need to be called. My plan is to
// move these into a stored procedure, reduce the reduncancy
// and normalize the database so that only a single call is required.
// Also, it causes SQL errors on some calls. This really is bad.
exports.updateAnswers = function(res, responses, callback) {

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
                callback('', res);
            });
        });
    });

};

exports.addNewlyAnswered = function(res, responses, client_id, callback) {
  var index = 0;
  var error = null;

  addNext(index,client_id, responses, callback, res, error);

}

function addNext(index, client_id, responses, callback, res, error){
  var max_index = responses.length;

  console.log("INSERTING RESPONSES" + responses);
  console.log(responses[index] + " index" + index);

  if(index >= max_index)
    callback(error, res);

  else{
    if(responses[index].response_id){
      console.log(responses[index]);

      knex('ClientQuestionResponse')
      .insert({
          response_id: responses[index].response_id,
          question_id: responses[index].id,
          client_id: client_id,
          weight: responses[index].weight || 0,
          note: responses[index].note,
          assessment_id: responses[index].assessment_id
       }).asCallback(function(err, rows){
           console.log("ERR" + err);
           console.log("ROWS: " + rows);
           addNext(index+1, client_id, responses, callback, res, err);
      });
    } else {
      addNext(index+1, client_id, responses, callback, res, error);
    }
  }
}
