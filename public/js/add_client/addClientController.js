(function () {

  var module = angular.module('addClientModule', ['addClientServiceModule']);
  module.controller('AddClientController', ['$scope', 'AddClientStore', '$window',
    function ($scope, AddClientStore, $window) {

      $scope.clients = AddClientStore.getClientsConn.query({}, function() {
        console.log($scope.clients);
      });

      $scope.editing = {};

      $scope.onChange = function() {
          if ($scope.client){
            for(key in ($scope.client))
              $scope.editing[key] = $scope.client[key];
          } else {
            $scope.editing = {};
          }

          console.log($scope.editing);

      }

    // Regex for Canadian phone number.
    // TODO: This should be moved into some sort of regex
    // service with other regexes so we can make use of it
    // elsewhere throughout the application.
    $scope.phoneNumbr = /^\+?\d{3}[- ]?\d{3}[- ]?\d{4}$/

    // Data from the form comes back in the form of an array which we
    // will pass to the back end for processing.
    // [ "name", "industry", "country", "contact", "email", "phone" ]
    $scope.submit = function (clientData) {
      if($scope.client){

          console.log($scope.client);

                AddClientStore.updateClientsConn.save({ client : $scope.editing }, function() {
                    $scope.changeRoute('#/clients/');
                  });

      } else {

        AddClientStore.addClientConn.save({ client : $scope.editing }, function() {
            $scope.changeRoute('#/clients/');
          });
        }

    }

    // For re-routing the request.
    // TODO We use this routing function in other parts
    // of the application, like the regex it should be moved
    // to a more sensible spot within the application.
    $scope.changeRoute = function (url, forceReload) {
      $scope = $scope || angular.element(document).scope()
      if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
        window.location = url
      } else {
        $location.path(url)
        $scope.$apply()
      }
    }

  }])

})()
