(function() {

      var module = angular.module('clientsModule', ['clientsServiceModule'])

      // Controller for "clients.html", for viewing the list of clients.
      module.controller('ClientsController', ['$scope', 'ClientsStore',

          function($scope, ClientsStore) {

              var idsToEmails = [];

              $scope.oneAtATime = true;
              $scope.collapsed = true;
              $scope.clients = ClientsStore.getClientsConn.query({}, function() {});
              $scope.forms = ClientsStore.formsConn.query({});
              $scope.allUsers = ClientsStore.getUserEmailsConn.query({});
              $scope.allClientIDsAndEmails = ClientsStore.getAllCliendIDsAndEmails.query({}, function(){
                ///map all the emailIDs belonging to a CliendID
                for(var i=0; i < $scope.allClientIDsAndEmails.length; i++){
                  if(!idsToEmails[$scope.allClientIDsAndEmails[i].client_id])
                      idsToEmails[$scope.allClientIDsAndEmails[i].client_id] = [];

                  if(idsToEmails[$scope.allClientIDsAndEmails[i].client_id].indexOf($scope.allClientIDsAndEmails[i].email) <0)//email doens't exit for the client ID
                      idsToEmails[$scope.allClientIDsAndEmails[i].client_id].push($scope.allClientIDsAndEmails[i].email);
                }

              });


              $scope.addUserToClient = function(isValid, clientID, divId) {
                if(isValid){
                  var txtbox = document.getElementById(divId);
                  var email = txtbox.value;

                  //if email not assigned to the client, then add it in
                  if(idsToEmails[clientID].indexOf(email) <0){
                    $scope.questions = ClientsStore.addUserToClient.query({
                      client_id: clientID,
                      user_email: email
                    }, function() {
                      window.alert("The client has been added to user "+ email);
                    });
                  }else{
                      window.alert("The client is already assigned to user "+ email);
                  }
                }
              }
              $scope.deleteClient = function(client) {
                  if (confirm('Are you sure you want to delete this?')) {
                      console.log(client.id);
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
      ]);
})();
