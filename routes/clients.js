module.exports = function(app) {

    var queries = require('../querying/clientQuerying');
    var userQueries = require('../querying/usersQuerying');
    var dbUtils = require('../helpers/db_util');

    // add client
    app.post('/insertClient', dbUtils.checkAuthenticated, function(req, res) {
        queries.insertClient(req.body.client, req.user.email, res, dbUtils.callbackNoReturn);
    });

    // update client
    app.post('/updateClient', dbUtils.checkAuthenticated, function(req, res) {

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

    // get a list of all user Email IDs
    app.get('/getAllUserEmails', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllUserEmails(res, dbUtils.callback);
    });

    // get a list of all user Email IDs and ClientIDs
    app.get('/getAllCliendIDsAndEmails', dbUtils.checkAuthenticated, function(req, res) {
        queries.getAllClientIDsAndEmails(res, dbUtils.callback);
    });

    // add UserEmail and CliendID to the database
    app.get('/addUserToClient/:client_id/:user_email', dbUtils.checkAuthenticated, function(req, res) {
        queries.addClientToUser(req.params.client_id, req.params.user_email, res, dbUtils.callback);
    });
    // used to set the status of the client to active or inactive
    app.post('/deleteClient', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.body.id, req.user.email, function(err, permitted) {
            if (permitted)
                queries.setClientInactive(req.body.id, req.body.status, res, dbUtils.callbackNoReturn);
            else
                res.send('403');
        })
    });
    // get clientID from client table
    app.get('/getClientID/:client_name/', dbUtils.checkAuthenticated, function(req, res) {
        queries.getClientID(req.params.client_name, res, dbUtils.callback);
    });

};
