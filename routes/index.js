module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/greg-questions/:someNumber', function(req, res) {
       var someNumber = req.params.someNumber;
       res.send(someNumber);
    });

    // example of posting
    app.post('/addAnswers', function(req, res){

      var responses = req.body.user_responses
      console.log(responses);


      for(i = 0; i < responses.length; i++) {
        console.log("Response ID = " + responses[i].response.id +    "Question ID = " + responses[i].id )
      }
      res.send("Success");
    });

};
