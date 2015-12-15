( function() {
var module = angular.module('userServiceModule', ['ngResource']);
    module.service('userStore', ['$http', '$resource', function($http, $resource) {
       this.userLogin = $resource('/userLogin');
    }]);

})();
