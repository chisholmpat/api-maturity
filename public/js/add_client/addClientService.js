( function() {

var module = angular.module('addClientServiceModule', ['ngResource']);
    module.service('AddClientStore', ['$http', '$resource', function($http, $resource) {
        this.addClientConn = $resource('/insertClient');
        this.getClientsConn = $resource('/get_clients');
        this.updateClientsConn = $resource('/updateClient');

    }]);

})();
