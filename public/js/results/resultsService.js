( function() {

var module = angular.module('resultsServiceModule', ['ngResource']);
    module.service('ResultStore', ['$http', '$resource', function($http, $resource) {
       this.scoreConn = $resource('/score/:client_id/:form_id');
    }]);

})();
