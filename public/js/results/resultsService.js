(function() {
    // Provides access to the end point which produces all values required to
    // geneate the score to be provided on the front end.
    var module = angular.module('resultsServiceModule', ['ngResource']);
    module.service('ResultStore', ['$http', '$resource', function($http, $resource) {
        this.scoreConn = $resource('/score/:client_id/:form_id');
    }]);
})();
