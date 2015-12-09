module.exports = function(app) {
    app.get('/', function(req, res, next) {
      res.sendFile('__dirname' + '/public/index.html');
    });

    app.get('/greg-questions', function(req, res) {


         var responses = [{
            id : 1,
            text :'Don\'t do it'
         },
        {
            id : 2,
            text : 'Planned'
        },
        {
            id: 3,
            text : 'Rose Smells.'
        }
         ];

         var questions = [{
            id : 1,
            text : 'Capture Business and Technical API measurements or metrics',
            form_id : 1,
            response : responses
        },
         {
            id : 2,
            text : 'Do you have Categories of Business and Technical API measurements or metrics',
            form_id : 1,
            response : responses
         },
        {
            id : 3,
            text : 'Capture KPIs that determine the business value of applications',
            form_id : 1,
            response : responses
        }
        ];

            res.send(questions);
    });
}

