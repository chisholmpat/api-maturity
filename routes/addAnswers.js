// Call back function from the database call. Used to send either the results
// to the response or to send an error string to the response.
function queryCallback(req, res, err_string){
	if(!err_string){
		res.send("SUCCESS");
	}
	else{
		res.send(err_string);
	}
}


app.post('/addAnswers', function(req, res) {

  var err_string;
  var responses = req.body.user_responses;
  var addAnswersQuerying = require('../querying/addAnswersQuerying.js');

  for(i = 0; i < responses.length; i++) {
    addAnswersQuerying.addAllAnswersClientForm(
      req, res, err_string,
      responses[i].form_id, responses[i].client_id,responses[i].response.id, responses[i].question_id,
      queryCallback
    );
  }
});
