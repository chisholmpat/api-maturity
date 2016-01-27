var knex = require("../db/db.js").knex; // the database connection.

// Get all the questions available to a client given a form and a client
// TODO December 20th, 2015 : Reduce size/complexity of this query.
exports.getAllQuestions = function(client_id, form_id, res, callback) {

    knex.select('ClientQuestionResponse.client_id', 'ClientQuestionResponse.note',
            'Form.name as form_name', 'Question.id', 'Question.text', 'Question.category_id',
            'ClientQuestionResponse.response_id', 'ClientQuestionResponse.weight')
        .from('ClientQuestionResponse')
        .innerJoin('Question', 'ClientQuestionResponse.question_id', 'Question.id')
        .innerJoin('Form', 'Question.form_id', 'Form.id')
        .where('Question.form_id', form_id)
        .where('Question.active', 1)
        .where('ClientQuestionResponse.client_id', client_id)
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// Get all the questions available for the form which are present in Questions but not in ClientQuestionResponse
//Basically all unAnswered questions.
exports.getallUnansweredQuestions = function(client_id, form_id, res, callback) {

  var subQuery = knex.select('clientquestionresponse.question_id').from('clientquestionresponse').where('clientquestionresponse.client_id', client_id);
  console.log("client id for the form query "+ client_id);
  console.log(form_id);
  knex.select('Question.id', 'Question.text', 'Question.category_id', 'Form.name as form_name')
      .from('Question')
      .innerJoin('Form', 'Question.form_id', 'Form.id')
      .where('Question.form_id', form_id)
      .where('Question.active', 1).whereNotIn('Question.id', subQuery).asCallback(function(err, rows) {
           console.log(rows);
           console.log(err);
           callback(err, res, rows);
       });

};


// Function to retrieve all of the answers that a client has submitted to calculate score.
// TODO December 20th, 2015 : Reduce size/completexity of this query.
exports.getClientAnswers = function(client_id, form_id, res, callback) {

    knex.select('Response.response', 'Response.value', 'Question.text', 'Question.id',
            'ClientQuestionResponse.response_id', 'ClientQuestionResponse.weight',
            'Question.category_id', 'Question.group_id', 'Grouping.name')
        .from('ClientQuestionResponse')
        .innerJoin('Question', 'ClientQuestionResponse.question_id', 'Question.id')
        .innerJoin('Grouping', 'Question.group_id', 'Grouping.id')
        .leftJoin('Response', 'ClientQuestionResponse.response_id', 'Response.id')
        .where('Question.form_id', form_id)
        .where('Question.active', 1)
        .where('ClientQuestionResponse.client_id', client_id)
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};


// Return all the possible responses to a question.
exports.getAllResponses = function(res, callback) {
    knex.select().table('response').
    asCallback(function(err, rows) {
        callback(err, res, rows);
    });
};

// TODO: Again the above method can probably be refactored to include the information
// gathered from this query.
exports.getAllForms = function(res, callback) {
    knex.select().table('form')
        .distinct('*')
        .where('Form.active', 1)
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// Get all the questions for a given form.
exports.getQuestionsByForm = function(form_id, res, callback) {
    knex.select('Question.*', 'Form.name')
        .from('Question')
        .innerJoin('Form', 'Question.form_id', 'Form.id')
        .where('Question.form_id', form_id)
        .where('Question.active', 1)
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};


// Return a list of groupings.
exports.getGroupings = function(res, callback) {
    knex.select().table('grouping')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// Return a list of forms.
exports.getForms = function(res, callback) {
    knex.select().table('form')
        .asCallback(function(err, rows) {
            callback(err, res, rows);
        })
};

// TODO This query is rather hideous right now, there has
// to be a more elegant way of performing multiple unique
// updates against the database apart from a for-loop.
exports.updateQuestions = function(res, questions, callback) {

    var updateTextQuery = " Update Question SET text = CASE ";
    var updateGroupQuery = " Update Question SET group_id = CASE ";

    for (i = 0; i < questions.length; i++) {
        updateTextQuery += "  WHEN id =" + questions[i].id +
            " THEN '" + questions[i].text + "'";

        updateGroupQuery += "  WHEN id =" + questions[i].id +
            " THEN " + questions[i].group_id;
    }

    updateTextQuery += " ELSE text END";
    updateGroupQuery += " ELSE group_id END";;

    // TODO Fix this logic. Right now the callback
    // for the first query is the second query. Also
    // There is the possibility for SQL injection here.
    knex.raw(updateTextQuery)
        .asCallback(function(err, rows) {
            knex.raw(updateGroupQuery)
                .asCallback(function(err, rows) {
                    callback(err, res, rows);
                })
        });
};

// Set the field of a question to inactive
exports.deleteQuestion = function(id, res, callback) {
    knex('question').where('id', id).update({
        active: 0
    }).asCallback(function(err, rows) {
        callback(err, res);
    });
};



// Set the field of a question to inactive
exports.deleteForm = function(id, res, callback) {
    knex('form').where('id', id).update({
        active: 0
    }).asCallback(function(err, rows) {
        callback(err, res);
    });
};


// Add a question to the database. The design currently
// dictates that there must be an entry in CQR table to
// allow users to "answer questions".
exports.addQuestion = function(question, res, callback) {

    knex('question').insert(question).asCallback(function(err, rows) {
        if (!err) {
            var rawSql = "INSERT INTO ClientQuestionResponse(response_id, question_id, client_id, weight)\
            SELECT DISTINCT 1, (SELECT MAX(id) from Question), id, 0 from Client";

            knex.raw(rawSql).asCallback(function(err, rows) {
                callback(err, res);
            });
        }
    });

}

// Add a new form to the form table
//By default the form is set to isActive = true

exports.addForm = function(formName, res, callback) {
  console.log("reached Add Forms query " + formName);
  knex('form').insert({
      name: formName,
      active: 1
  })
  .asCallback(function(err, rows) {
      callback(err, res, rows);
  })
}


// Checks to see if a form Name exists
exports.checkUniqueFormname = function(formname, res, callback){
    knex('form').select('').where('name', formname).asCallback(function(err, rows){
        console.log(err);
        console.log(rows)
        if(rows && rows[0])
            res.send(rows[0].name);
        else
            res.send(404);
    });
}
