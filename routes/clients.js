module.exports = function(app) {

    var queries = require('../querying/clientQuerying');
    var dbUtils = require('../helpers/db_util');

    // add client
    app.post('/insertClient', function(req, res) {
        queries.insertClient(req.body.client, res, dbUtils.callback);
    });

    // update client
    app.post('/updateClient', function(req, res) {
        console.log(req.body.client);
        queries.updateClient(req.body.client, res, dbUtils.callback);
    });

    // get all forms for a particular client
    app.get('/forms/:client_id', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllFormsByClient(req.params.client_id, req.email, res, dbUtils.callback);
    });

    // get a list of all the clients
    app.get('/clients', dbUtils.checkAuthenticated, function(req, res) {
        console.log(req.email);
        queries.getClients(req.user.email, res, dbUtils.callback);
    });
};
