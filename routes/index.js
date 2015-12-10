module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/greg-questions/:someNumber', function(req, res) {

       var someNumber = req.params.someNumber; 
       
            res.send(someNumber);
    });
}

