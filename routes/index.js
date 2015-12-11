// TODO Move to single place and get VCAP variables.




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
        console.log("Response ID = " + responses[i].response.id +    "Question ID = " + responses[i].question_id )
      }
      res.send("Success");
    });
    
    
    app.get('/dbtest', function(req, res) {


	// TODO Move to one spot.
	var mysql   = require('mysql');
	var db = require('../db/db.js');
	var connection = db.getConnection();
	connection.connect()
	connection.query('SELECT * from Client', function(err, rows, fields) {
		console.log('The solution is: ', rows[0]);
		connection.end();
	});
    });
    

};

