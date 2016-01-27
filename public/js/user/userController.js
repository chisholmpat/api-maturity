(function() {

    var module = angular.module('userModule', ['userServiceModule']);

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

    // Controller for "add_clients.html", for adding clients to DB.
    module.controller('AddUserController', ['$scope', 'UserStore', '$window',
        function($scope, UserStore, $window) {

            $scope.result = "";

            $scope.editing = {}; // model to hold edited fields
            $scope.allUsers = UserStore.getUsers.query();
            $scope.defaultRoleID = "";
            $scope.roles = UserStore.getUserRoles.query({}, function(results) {
                $scope.defaultRoleID = results[0].id;
                $scope.editing.role_id = $scope.defaultRoleID
            });


            $scope.handlePatternPassword = (function() {
                var regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{6,20})/;
                return {
                    test: function(value) {
                        if (!$scope.editing.id) {
                            return (value.length > 0) ? regex.test(value) : true;
                        } else {
                            return true;
                        }
                    }
                };
            })();


            // Handles populating the "editing" model
            // with the proper fields from the selected
            // user in the select field or emptying it
            // if there is no user selected.
            $scope.onChange = function() {
                if ($scope.aUser) {
                    for (key in ($scope.aUser))
                        $scope.editing[key] = $scope.aUser[key];
                } else {
                    $scope.editing = {};
                    $scope.editing.role_id = $scope.defaultRoleID
                }
            }


            // Add or Update a client based on the content
            // of the select menu. If an existing client is
            // selected then it will update the client else
            // it will add it.
            $scope.submit = function(newUser) {


                if ($scope.aUser) {
                    // Handle Updating Client
                    UserStore.updateUser.save({
                        user: $scope.editing
                    }, function() {
                        $scope.allUsers = "";
                        $scope.allUsers = UserStore.getUsers.query();
                    })

                } else {
                    UserStore.addUser.save({
                        user: $scope.editing
                    }, function() {
                        $scope.result = "User Added";
                        $scope.allUsers = UserStore.getUsers.query();
                        $scope.editing = {};
                        $scope.editing.role_id = $scope.defaultRoleID
                        $scope.userform.$setPristine();
                        $scope.passwordConfirm = "";

                    });
                }
            }

        }
    ]);


module.controller('PasswordResetController', ['$scope', 'UserStore', '$location', '$routeParams',
        function($scope, UserStore, $location, $routeParams) {

            console.log($routeParams.token);

            UserStore.checkToken.query({
                token : $routeParams.token
            }, function(response) {
                    console.log('TOKEN RECOGNIZED');
            }, function(){
                   console.log('TOKEN NOT RECOGNIZED')
                   $location.url("/#/");
            });

            $scope.submit = function(){
                UserStore.updatePassword.save({
                  token: $routeParams.token,
                  password: newpwd.password,
                })
            }


        }]);


    module.controller('EditUserController', function($scope, $rootScope, $location, $window) {
        $rootScope.$watch('isLoggedIn', function() {
            if ($rootScope.isLoggedIn)
                $window.top.location = $window.location;
        });
    });
})();
