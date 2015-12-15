(function() {
    var module = angular.module('addClientModule', ['addClientServiceModule'])

    module.controller('AddClientController', ['$scope', 'AddClientStore', '$window', function($scope, AddClientStore, $window) {


        // For re-routing the request
        $scope.changeRoute = function(url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
                window.location = url;
            } else {
                $location.path(url);
                $scope.$apply();
            }
        };

        $scope.add = function(client) {
            AddClientStore.addClientConn.save({ name : client.name} ,
                function(){
                    $scope.changeRoute('#/clients/')});
        }
    }]);


})();
