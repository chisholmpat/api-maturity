(function() {

    var module = angular.module('clientsModule', ['clientsServiceModule'])

    // Controller for "clients.html", for viewing the list of clients.
    module.controller('ClientsController', ['$scope', 'ClientsStore',
        function($scope, ClientsStore) {
            $scope.oneAtATime = true;
            $scope.collapsed = true;
            $scope.clients = ClientsStore.getClientsConn.query({});
            $scope.forms = ClientsStore.formsConn.query({});
            $scope.deleteClient = function(client) {

                if (confirm('Are you sure you want to delete this?')) {
                    ClientsStore.deleteClientConn.save({
                        id: client.id,
                        status: 0
                    }, function() {
                        var index = $scope.clients.indexOf(client);
                        $scope.clients.splice(index, 1);
                    });
                }
            }
        }
    ]);


    // Controller for "add_clients.html", for adding clients to DB.
    module.controller('AddClientController', ['$scope', 'ClientsStore', '$window',
        function($scope, ClientsStore, $window) {

            $scope.clients = ClientsStore.getClientsConn.query();
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

            }

            // Regex for Canadian phone number.
            // TODO: This should be moved into some sort of regex
            // service with other regexes so we can make use of it
            // elsewhere throughout the application.
            $scope.phoneNumbr = /^\+?\d{3}[- ]?\d{3}[- ]?\d{4}$/

            // Data from the form comes back in the form of an array which we
            // will pass to the back end for processing.
            // [ "name", "industry", "country", "contact", "email", "phone" ]
            $scope.submit = function(clientData) {

                if ($scope.client) {
                    console.log("Updating Client");
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
            }


            // For re-routing the request.
            // TODO We use this routing function in other parts
            // of the application, like the regex it should be moved
            // to a more sensible spot within the application.
            $scope.changeRoute = function(url, forceReload) {
                $scope = $scope || angular.element(document).scope()
                if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
                    window.location = url
                } else {
                    $location.path(url)
                    $scope.$apply()
                }
            }

        }
    ])

})();
