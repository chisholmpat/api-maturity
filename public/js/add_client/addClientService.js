( function() {

var module = angular.module('addClientServiceModule', ['ngResource']);
    module.service('AddClientStore', ['$http', '$resource', function($http, $resource) {
        this.addClientConn = $resource('/insertClient');
    }]);

})();
