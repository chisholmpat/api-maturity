(function () {
    var module = angular.module('clientsModule', ['clientsServiceModule'])

    module.controller('ClientsController', ['$scope', 'ClientsStore', function ($scope, ClientsStore) {

        $scope.clients = ClientsStore.getClientsConn.query({}, function(){ console.log($scope.clients)})
        $scope.forms = ClientsStore.formsConn.query({});

    }]);

})();
