(function() {

    var module = angular.module('userModule', ['userServiceModule']);

    // Controller for login operations, both SSO and database backed logins.
    module.controller('UserLoginController', function($scope, $rootScope, $http, $location, $window) {

        // Redirect the location if already logged in.
        $rootScope.$watch('isLoggedIn', function() {
            if ($rootScope.isLoggedIn)
                $window.top.location = $window.location;
        });

        // This object will be filled by the form
        $scope.user = {};

        // The login function
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
    module.controller('EditUserController', ['$scope', 'UserStore', '$window',
        function($scope, UserStore, $window) {

            $scope.result = ""; // 
            $scope.editing = {};
            $scope.defaultRoleID = "";

            // Get a list of all the available users
            $scope.allUsers = UserStore.getUsers.query();

            // Retrieve roles for use in the dropdown
            $scope.roles = UserStore.getUserRoles.query({}, function(results) {
                $scope.defaultRoleID = results[0].id;
                $scope.editing.role_id = $scope.defaultRoleID;
            });

            // Ensure that the password is appropriate.
            $scope.handlePatternPassword = (function() {
                var regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{6,20})/; // Number/L.Case/U.Case/Symbol!@#$%
                return {
                    test: function(value) {
                        if (!$scope.editing.id)
                            return (value.length > 0) ? regex.test(value) : true;
                        else
                            return true;
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
                    $scope.editing.role_id = $scope.defaultRoleID;
                }
            };


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
                    });

                } else {
                    UserStore.addUser.save({
                        user: $scope.editing
                    }, function() {
                        $scope.result = "User Added";
                        // Clear the form
                        $scope.editing = {};
                        $scope.editing.role_id = $scope.defaultRoleID;
                        $scope.passwordConfirm = "";
                        $scope.userform.$setPristine();
                        // Refresh from the database
                        $scope.allUsers = UserStore.getUsers.query();

                    });
                }
            };

        }
    ]);

    // Controller for handling the actual resetting of the password.
    module.controller('PasswordResetController', ['$scope', 'UserStore', '$location', '$routeParams',
        function($scope, UserStore, $location, $routeParams) {




            // Checks to see if a token for password reset
            // actually exists in the user table. Used to avoid
            // wrong token addresses or old tokens.
            UserStore.checkToken.query({
                token: $routeParams.token
            }, function(response) {}, function() {
                $location.url("/#/");
            });

            // Used to update the password in the database.
            $scope.submit = function() {
                UserStore.updatePassword.save({
                    token: $routeParams.token,
                    password: $scope.pw1,
                }, function() {
                    $location.url("/#/");
                });
            };


            $scope.handlePatternPassword = (function() {
                var regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{6,20})/; // Number/L.Case/U.Case/Symbol!@#$%
                return {
                    test: function(value) {
                            return (value.length > 0) ? regex.test(value) : true;
                    }
                };
            })();

        }
    ]);

    // Controller responsible for sending the email to the registed user's email account.
    module.controller('SendPasswordController', ['$scope', 'UserStore', '$location', '$routeParams', '$window',
        function($scope, UserStore, $location, $routeParams, $window) {

            $scope.submit = function() {
                UserStore.sendPasswordEmail.save({
                    email: $scope.email
                }, function() {
                    window.alert("Email send to " + $scope.email);
                    $location.url("/#/");

                }, function() {
                    $scope.emailMessage = "Email not recognized.";
                });
            };
        }
    ]);


})();
