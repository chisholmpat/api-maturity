// Module for handling actions related to clients.
module.exports = function(app) {

    // dependencies
    var clientQueries = require('../querying/clientQuerying');
    var userQueries = require('../querying/usersQuerying');
    var dbUtils = require('../helpers/db_util');
    var err = "";

    // add client
    app.post('/insertClient', dbUtils.checkAuthenticated, function(req, res) {

        var user = {};
        var client = req.body.client;

        //insert client into Client table
        clientQueries.insertClient(req.body.client, req.user.email, res, function(err, res){});

        //add client to user-table
        user.username = user.email = client.email;
        user.firstname = user.lastname = client.name;
        user.role_id = 1;
        user.password = "default";
        userQueries.addUser(user, res, dbUtils.callbackNoReturn);


    });

    // update client
    app.post('/updateClient', dbUtils.checkAuthenticated, function(req, res) {
        dbUtils.userCanViewClient(req.body.client.id, req.user.email, function(err, permitted) {
            if (permitted)
                clientQueries.updateClient(req.body.client, res, dbUtils.callbackNoReturn);
            else
                res.send('403');
        })
    });

    // get all forms for a particular client
    app.get('/forms/:client_id', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getAllFormsByClient(req.params.client_id, req.email, res, dbUtils.callback);
    });

    // get a list of all the clients
    app.get('/clients', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getClients(req.user.email, res, dbUtils.callback);
    });

    // get a list of all user Email IDs
    app.get('/getAllUserEmails', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getAllUserEmails(res, dbUtils.callback);
    });

    // get a list of all user Email IDs and ClientIDs
    app.get('/getAllCliendIDsAndEmails', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getAllClientIDsAndEmails(res, dbUtils.callback);
    });

    //get a list of all clients owned by the user_email
    app.get('/getAllClientsOwnedByUser', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getAllClientsOwnedByUser(req.user.email, res, dbUtils.callback);
    });

    app.get('/clientDetailsOwnedByUser', dbUtils.checkAuthenticated, function(req, res){
        clientQueries.getAllClientInfoOwnedByUser(req.user.email, res, dbUtils.callback);
    });

    // add UserEmail and CliendID to the database
    app.get('/addUserToClient/:client_id/:user_email', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.addClientToUser(req.params.client_id, req.params.user_email, res, dbUtils.callback);
    });
    // used to set the status of the client to active or inactive
    app.post('/deleteClient', dbUtils.checkAuthenticated, function(req, res) {

        dbUtils.userCanViewClient(req.body.id, req.user.email, function(err, permitted) {
            if (permitted)
                clientQueries.setClientInactive(req.body.id, req.body.status, res, dbUtils.callbackNoReturn);
            else
                res.send('403');
        })
    });

    // get clientID from client table
    app.get('/getClientID/:client_name/', dbUtils.checkAuthenticated, function(req, res) {
        clientQueries.getClientID(req.params.client_name, res, dbUtils.callback);
    });

};
