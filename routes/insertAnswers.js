var _ = require('underscore');

function callback(res, err_string){
	res.send('200')
}
module.exports = function(app) {

  app.post('/insertAnswers', function(req, res) {

	  console.log("Entering Insert Method");

	  // Update ClientQuestionResponseSET response_id = CASE WHEN question_id =1 AND client_id = 1 THEN 4 ELSE  response_id END
	  var queries = require('../querying/insertAnswersQuerying');
	  var responses = req.body.user_responses;


	  var query = " Update ClientQuestionResponse SET response_id = CASE ";

	  for (i = 0 ; i < responses.length; i++){
		  console.log(responses[i]);
		  query += "  WHEN question_id =" + responses[i].id +
			  " AND client_id = " + responses[i].client_id + " THEN " + responses[i].response_id
	  }

	  query += " ELSE response_id END";

	  console.log(query);

	  queries.addAnswers(query, res, callback);

})
};
