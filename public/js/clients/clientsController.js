(function() {

    var module = angular.module('clientsModule', ['clientsServiceModule']);

    module.controller('AssessmentController', ['$scope', 'ClientsStore', '$routeParams',
        function($scope, ClientsStore, $routeParams) {
            $scope.forms = ClientsStore.formsConn.query({});
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;
        }
    ]);

    // Controller to list form names and provide hyperlinks to form results
    // for an individual client assessment.
    module.controller('IndividualClientController', ['$scope', 'ClientsStore', '$routeParams',
        function($scope, ClientsStore, $routeParams) {
            $scope.forms = ClientsStore.formsConn.query({});
            $scope.category_id =  $routeParams.category_id ;
            $scope.assesment_id = $routeParams.assessment_id;
            $scope.client_id = $routeParams.client_id;
            $scope.client_name = $routeParams.client_name;
            $scope.assessment_date = $routeParams.assessment_date;
        }
    ]);

    // Controller for "clients.html", for viewing the list of clients.
    module.controller('ClientsController', ['$scope', 'ClientsStore', '$routeParams', '$location',

        function($scope, ClientsStore, $routeParams, $location) {
            
            $scope.isAff = false;

            // Check to see if this is a Bluemix survey or 
            // if it's an API maturity survey.
            $scope.category = $routeParams.category_id;

            // Handles editing functionality of the client.
            $scope.isOwner = false;

            var idsToEmails = [];
            var allClientIDs = [];

            // For controlling the UI elements.
            $scope.oneAtATime = true;
            $scope.collapsed = true;

            // Getting model information.
            $scope.clients = ClientsStore.getClientsConn.query({}, function() {});
            $scope.forms = ClientsStore.formsConn.query({});
            $scope.allUsers = ClientsStore.getUserEmailsConn.query({});
            $scope.assessments = ClientsStore.getAllAssessmentsConn.query({
                category_id: $scope.category
            }, function(res) {
                console.log(res);

            });

            //use idToEmails to avoid adding duplicates of user_email-client ID combination
            $scope.allClientIDsAndEmails = ClientsStore.getAllCliendIDsAndEmailsConn.query({}, function() {
                ///map all the emailIDs belonging to a CliendID
                for (var i = 0; i < $scope.allClientIDsAndEmails.length; i++) {
                    idsToEmails.push($scope.allClientIDsAndEmails[i].email + $scope.allClientIDsAndEmails[i].client_id);
                }
            });

            //use allClients to ensure only client owner is allowed to edit and delete client
            var allClientsOwnedByUser = ClientsStore.allClientsOwnedByUserConn.query({}, function() {
                ///map all the emailIDs belonging to a CliendID
                for (var i = 0; i < allClientsOwnedByUser.length; i++) {
                    allClientIDs.push(allClientsOwnedByUser[i].client_id);
                }
            });

            $scope.allClients = allClientIDs;

            //Assign user to ClientID
            $scope.addUserToClient = function(isValid, clientID, divId) {
                if (isValid) {
                    var txtbox = document.getElementById(divId);
                    var email = txtbox.value;
                    var search_str = email + clientID;

                    //if email not assigned to the client, then add it in
                    if (idsToEmails.indexOf(search_str) < 0) {
                        $scope.questions = ClientsStore.addUserToClient.query({
                            client_id: clientID,
                            user_email: email
                        }, function() {
                            idsToEmails.push(search_str);
                            window.alert("The client has been added to user " + email);
                        });
                    }
                    //user-email already assinged to the client
                    else {
                        window.alert("The client is already assigned to user " + email);
                    }
                }
            };

            // Method for deleting a client from the database.
            $scope.deleteClient = function(client) {
                if (confirm('Are you sure you want to delete this?')) {
                    client.status = 0;

                    for (var i = $scope.clients.length - 1; i >= 0; i--) {
                        if ($scope.clients[i].status == 0)
                            $scope.clients.splice(i, 1);
                    }

                    ClientsStore.deleteClientConn.save({
                        id: client.id,
                        status: 0
                    }, function() {});
                }
            };
            
        $scope.newAssessment = function(clientID) {
            ClientsStore.createNewAssessmentConn.save({
                client_id : clientID,
                category_id : $scope.category
            }, function(result){
                console.log(result);
                $location.url('/questionnaire/' + $scope.category + '/'  + clientID 
                + '/' + $scope.category);
            });
        };
            
        }
        
        
 
    ]);

    // Controller for "add_clients.html", for adding clients to DB.
    module.controller('AddClientController', ['$scope', 'ClientsStore', '$window',
        function($scope, ClientsStore, $window) {

            $scope.clients = ClientsStore.allClientInfoOwnedByUserConn.query({});
            $scope.editing = {}; // model to hold edited fields
            $scope.integerval = /^\d*$/;
            // Handles populating the "editing" model
            // with the proper fields from the selected
            // client in the select field or emptying it
            // if there is not client selected.
            $scope.onChange = function() {
                if ($scope.client) {
                    for (key in ($scope.client))
                        $scope.editing[key] = $scope.client[key];
                } else {
                    $scope.editing = {};
                }

            };

            // Regex for Canadian phone number.
            // TODO: This should be moved into some sort of regex
            // service with other regexes so we can make use of it
            // elsewhere throughout the application.
            $scope.phoneNumbr = /^\+?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

            // Data from the form comes back in the form of an array which we
            // will pass to the back end for processing.
            // [ "name", "industry", "country", "contact", "email", "phone" ]
            $scope.submit = function(clientData) {

                if ($scope.client) {
                    ClientsStore.updateClientsConn.save({
                        client: $scope.editing
                    }, function() {
                        $scope.changeRoute('#/clients/');
                    });
                } else {
                    ClientsStore.addClientConn.save({
                        client: $scope.editing
                    }, function() {
                        $scope.changeRoute('#/clients/');
                    });
                }
            };


            // For re-routing the request.
            // TODO We use this routing function in other parts
            // of the application, like the regex it should be moved
            // to a more sensible spot within the application.
            $scope.changeRoute = function(url, forceReload) {
                $scope = $scope || angular.element(document).scope();
                if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
                    window.location = url;
                } else {
                    $location.path(url);
                    $scope.$apply();
                }
            };
        }
    ]);
})();
