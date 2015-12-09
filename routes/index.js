module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/questions', function(req, res) {
              
         var questions = [{ 
            id : 1, 
            text : 'Capture Business and Technical API measurements or metrics',
            form_id : 1
        }, 
         {
            id : 2,
            text : 'Do you have Categories of Business and Technical API measurements or metrics',
            form_id : 1
         },
        {
            id : 3,
            text : 'Capture KPIs that determine the business value of applications',
            form_id : 1
        }
        ];
       
            res.send(questions);
    });
}

