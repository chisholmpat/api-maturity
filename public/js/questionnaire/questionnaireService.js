( function() {

var module = angular.module('questionnaireServiceModule', ['ngResource']);

    module.service('questionnaireServiceModule', ['$http', '$resource', function($http, $resource) {
       this.sampleDataConn = $resource('/data');
     
    }]);

})();
