function queryCallback(req, res, err_string, results_array, isFinished){
	
	if(isFinished) {
	if(!err_string){
		res.send("Sucess");
	}
	else{
		res.send(err_string);
	}}
	
}

module.exports = function(app) {
  app.post('/addAnswers', function(req, res) {

    var err_string = "";
    var responses = req.body.user_responses;
	var mysql   = require('mysql');
	var db = require('../db/db.js');
	var connection = db.getConnection();
	
	console.log(req.body.user_responses);
    for(i = 0; i < responses.length; i++) {

			connection.query("UPDATE ClientQuestionResponse\
							SET response_id = ?\ WHERE question_id = ? AND client_id = ?", 
							[responses[i].response.id, responses[i].id, responses[i].client_id], function(err, results){
								queryCallback(req, res, err, results, i == responses.length - 1);
						})}
  });
}
