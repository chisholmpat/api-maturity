(function () {

    var module = angular.module('clientsServiceModule', ['ngResource']);
    module.service('ClientsStore', ['$http', '$resource', function ($http, $resource) {
        this.formsConn = $resource('/get_forms');
        this.getClientsConn = $resource('/get_clients');
        this.addClientConn = $resource('/insertClient');
        this.updateClientsConn = $resource('/updateClient');
    }]);

})();
