(function() {
    var module = angular.module('userModule', ['userServiceModule'])

    module.controller('UserController', function($scope, $rootScope, $http, $location) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function() {
            $http.post('/login', {
                    username: $scope.user.username,
                    password: $scope.user.password,
                })
                .success(function(user) {
                    // No error: authentication OK
                    $rootScope.message = 'Authentication successful!';
                    $location.url('/home');
                })
                .error(function() {
                    // Error: authentication failed
                    $rootScope.message = 'Authentication failed.';
                    $location.url('/login');
                });
        };
    });

    // Controller for adding users
    module.controller('AddUserController', function($scope, UserStore){ 
          
            $scope.roles = ['admin', 'user'];
            
            $scope.saveStatus = "";
            $scope.saveUser = function(newUser){
                console.log(newUser);
                UserStore.addUser.save({
                    user : newUser
                }, function() {
                    console.log("Success!");
                }, function(err) {
                   console.log("Attempting to save user!");
                   console.log(err);
                   $scope.saveStatus = "Fail!";
                }); 
            }; 
    });

    module.controller('EditUserController', function($scope, UserStore){

    });
})();
