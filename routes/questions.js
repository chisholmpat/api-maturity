var questionsQuerying = require('../querying/questionsQuerying.js');


// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
function queryCallback(req, res, err_string, results_array){
	if(!err_string){
		res.send(results_array);
	}
	else{
		res.send(err_string);
	}
}

module.exports = function(app) {

    var bodyParser = require('body-parser');

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));


    app.get('/questions/:client_id/:form_id', function(req, res, next) {

      var err_string;
      var results_array;
      var form_id = req.params.form_id || 1;
      var client_id = req.params.client_id || 1;

      questionsQuerying.getAllQuestionsClientForm(
    		req, res, err_string, results_array,
    		form_id, client_id,
    		queryCallback
      );
    });

    app.get('/responses', function(req, res, next) {

	    var err_string;
	    var results_array;
	    var response_category_id = req.body.response_category || 1;
	    questionsQuerying.getAllResponses(
	  		req, res, err_string, results_array,
	  		response_category_id,
	  		queryCallback
			);
	  });

}
