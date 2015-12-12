var _ = require('underscore');

function callback(res, err_string, isFinished){
	if(isFinished)
	res.send('200')
}
module.exports = function(app) {

  app.post('/insertAnswers', function(req, res) {

	  console.log("Entering Insert Method");

	  var queries = require('../querying/insertAnswersQuerying');
	  var responses = req.body.user_responses;

	  for (i = 0 ; i < responses.length; i++){
	 	 if (_.has(responses[i], 'response'))  { // handle empty "response field in object
			 console.log("Attempting to insert " + responses[i]);
			 queries.addAnswers(responses[i].response.id, responses[i].id, responses[i].client_id, res, callback, i == responses.length - 1);
  		}};
})
};
