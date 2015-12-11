function callback(res, err_string, results_array, isFinished){

	if(isFinished) {
	if(!err_string){
		res.send("Sucess");
	}
	else{
		res.send(err_string);
	}}

}
module.exports = function(app) {
  app.post('/insertAnswers', function(req, res) {
		var queries = require('../querying/insertAnswersQuerying');
    var responses = req.body.user_responses;
    for(i = 0; i < responses.length; i++)
		queries.addAnswers(responses[i].response.id, responses[i].id, responses[i].client_id, res, callback,  i == responses.length - 1);
})
}
