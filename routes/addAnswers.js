
module.exports = function(app) {
  app.post('/addAnswers', function(req, res) {

    var err_string = "";
    var responses = req.body.user_responses;
    var addAnswersQuerying = require('../querying/addAnswersQuerying.js');

    for(i = 0; i < responses.length; i++) {
      addAnswersQuerying.addAllAnswersClientForm(
        req, res, err_string, req.body.client_id, responses[i].response.id, responses[i].id//responses[i].id = question_id
      );
    }
    if(err_string != ""){
      res.send(err_string);
      console.log(err_string);
    }
    else{
      console.log("Success");
    }

  });
}
