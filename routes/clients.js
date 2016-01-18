module.exports = function(app) {

    var queries = require('../querying/clientQuerying');
    var userQueries = require('../querying/usersQuerying');
    var dbUtils = require('../helpers/db_util');

    // add client
    app.post('/insertClient', dbUtils.checkAuthenticated, function(req, res) {
        queries.insertClient(req.body.client, res, dbUtils.callback);
    });

    // update client
    app.post('/updateClient', dbUtils.checkAuthenticated, function(req, res) {
        console.log('Incoming data!');
        
        dbUtils.userCanViewClient(req.body.client.id, req.user.email, function(err, permitted) {
            if (permitted)
                queries.updateClient(req.body.client, res, dbUtils.callbackNoReturn);
            else
                res.send('403');
        })
    });

    // get all forms for a particular client
    app.get('/forms/:client_id', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllFormsByClient(req.params.client_id, req.email, res, dbUtils.callback);
    });

    // get a list of all the clients
    app.get('/clients', dbUtils.checkAuthenticated, function(req, res) {
        queries.getClients(req.user.email, res, dbUtils.callback);
    });
};
