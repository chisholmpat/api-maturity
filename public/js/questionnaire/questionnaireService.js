( function() {

var module = angular.module('questionnaireServiceModule', ['ngResource']);

    module.service('QuestionStore', ['$http', '$resource', function($http, $resource) {
       this.sampleDataConn = $resource('/data');
     
    }]);

})();
