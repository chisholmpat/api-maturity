// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
<<<<<<< HEAD
function callback(res, err_string, results_array) {

    console.log(results_array);
    if (!err_string) {
        res.send(results_array);
    }
    else {
        console.log(err_string);
    }
}

module.exports = function (app) {

    // Dependencies
    var mysql = require('mysql');
    var queries = require('../querying/questionsQuerying');
  	var mysql   = require('mysql');
  	var db = require('../db/db.js');
  	var connection = db.getConnection();
    var bodyParser = require('body-parser');

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    // Return all questions by client and form id
    app.get('/questions/:client_id/:form_id', function (req, res) {
        queries.getAllQuestions(req.params.client_id, req.params.form_id, res, callback);
    });

    app.get('/responses', function (req, res) {
        queries.getAllResponses(res, callback);
    });

    app.get('/forms/:client_id', function (req, res) {
        queries.getAllFormsByClient(req.params.client_id, res, callback);
    });

    app.get('/get_clients', function (req, res) {
        queries.getClients(res, callback);
    });

	// Return all scores
	 app.get('/score/:client_id/:form_id', function(req, res, next) {
  		var err_string;
  		var results_array;
  		var form_id = req.params.form_id || 1;
  		var client_id = req.params.client_id || 1;

  		var query = connection.query('SELECT Response.response, Response.value, Question.text, Question.id, ClientQuestionResponse.response_id,\
      			ClientQuestionResponse.weight, Question.category_id, Question.group_id, Grouping.name\
      			FROM ClientQuestionResponse\
      			INNER JOIN Question ON ClientQuestionResponse.question_id=Question.id \
      			INNER JOIN Response ON ClientQuestionResponse.response_id=Response.id \
      			INNER JOIN Grouping ON Question.group_id=Grouping.id \
      			WHERE Question.form_id = ? AND ClientQuestionResponse.client_id = ?', [form_id, client_id],  function (error, results) {
  					queryCallback(req, res, error, results, connection);
  			});
    });

	  // Return all responses
    app.get('/responses', function(req, res, next) {
  		var err_string;
	    var results_array;

  		var query = connection.query("SELECT * FROM Response",  function (error, results) {
  					queryCallback(req, res, error, results, connection);
  		});

	  });

    app.get('/get_forms', function (req, res) {
        queries.getAllForms(res, callback);
    });

};
