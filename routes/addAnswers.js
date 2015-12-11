
module.exports = function(app) {
  app.post('/addAnswers', function(req, res) {

    var err_string = "";
    var responses = req.body.user_responses;
    var addAnswersQuerying = require('../querying/addAnswersQuerying.js');

    for(i = 0; i < responses.length; i++) {
	console.log("Attempting to add answer!");
			connection.query("UPDATE ClientQuestionResponse\
                     SET response_id = ?\
                     WHERE question_id = ? AND client_id = ?", [response_id, question_id, client_id], function(err){
                        //query result dumped as an array into results_array;
                        err_string += err;
						console.log(err);
	})}
    if(err_string != ""){
      res.send(err_string);
      console.log(err_string);
    }
    else{
      console.log("Success");
    }

  });
}
