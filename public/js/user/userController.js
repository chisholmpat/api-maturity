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


    // Controller for "add_clients.html", for adding clients to DB.
    module.controller('AddUserController_', ['$scope', 'UserStore', '$window',
        function($scope, ClientsStore, $window) {
                
            $scope.editing = {}; // model to hold edited fields
            $scope.users = UserStore.getUsers.query();            
            // Handles populating the "editing" model
            // with the proper fields from the selected
            // client in the select field or emptying it
            // if there is not client selected.
            $scope.onChange = function() {
                if ($scope.newUser) {
                    for (key in ($scope.newUser))
                        $scope.editing[key] = $scope.newUser[key];
                } else {
                    $scope.editing = {};
                }

            }

            // Data from the form comes back in the form of an array which we
            // will pass to the back end for processing.
            // [ "name", "industry", "country", "contact", "email", "phone" ]
            $scope.submit = function(newUser) {
                
                if ($scope.newUser) {
                    
                    // Handle Updating Client
                    //ClientsStore.updateClientsConn.save({
                    //    client: $scope.editing
                    //}, function() {
                    //    $scope.changeRoute('#/clients/');
                    //});

                } else {
                    UserStore.addUser.save({
                        client: $scope.editing
                    }, function() {
                        console.log("User saved!");
                    });
                }
            }


            // For re-routing the request.
            // TODO We use this routing function in other parts
            // of the application, like the regex it should be moved
            // to a more sensible spot within the application.
            //$scope.changeRoute = function(url, forceReload) {
            //    $scope = $scope || angular.element(document).scope()
            //   if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            //        window.location = url
            //    } else {
            //        $location.path(url)
            //        $scope.$apply()
            //    }
            //}
            
        });

        


    module.controller('EditUserController', function($scope, $rootScope, $location, $window){
      $rootScope.$watch('isLoggedIn', function() {
           if($rootScope.isLoggedIn)
            $window.top.location = $window.location;
       });
    });
})();
