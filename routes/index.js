module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/data', function(req, res) {
              
         var gem  = { 
            name : 'Dodecahedron',
            price : 2.95,
            description : 'Awesome!',
            canPurchase : true,
            soldOut: false, 
        }
       
            res.send(gem);
    });
}

