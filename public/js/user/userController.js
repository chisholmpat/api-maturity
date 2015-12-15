(function() {
    var module = angular.module('userModule', ['userServiceModule'])

    module.controller('userController', ['$scope', 'userStore', '$window','$routeParams', function($scope, userStore, $window, $routeParams) {

        // Authenticate the user
    	  $scope.users = userStore.userLogin.query();
    }]);

})();
