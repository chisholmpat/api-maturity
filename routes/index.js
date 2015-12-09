module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/data', function(req, res) {
             res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('This data came from the back end!');
    });
}

