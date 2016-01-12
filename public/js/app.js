// The other controllers have to be defined in the HTML document which houses
// the angular application, index.html, or you'll get a missing controller error.
var myApp = angular.module('app', ['ngRoute', 'ngResource', , 'ui.bootstrap', 'questionnaireModule', 'clientsModule', 'resultsModule', 'userModule']);

// Logic for handling login.
myApp.config(function($routeProvider, $locationProvider, $httpProvider) {

    // Function which gits the backend in order to get credentials.
    // For more information about promises checkout this blog entry.
    // http://johnmunsch.com/2013/07/17/angularjs-services-and-promises/
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

        var deferred = $q.defer(); // expose the promise object

        // Perform a call to the backend to see if the user
        // credentials match those within the session.
        $http.get('/loggedin').success(function(user) {

            // Authenticated
            if (user !== '0') {
                deferred.resolve();
                $rootScope.message = "Login Successful"
                $rootScope.role = user.role;
                console.log(user.role);
                $rootScope.isLoggedIn = true;
            }

            // Not Authenticated
            else {
                $rootScope.message = 'You need to log in.';
                deferred.reject();
                $rootScope.isLoggedIn = false;
                $location.url('/login');
            }
        });

        // Return the promise
        return deferred.promise;
    };

    // INTERCEPTOR
    // The interceptor takes the promise object and returns
    // the resolved promise (think of it as sort of like a callback.
    // Below an interceptor is added to the array of interceptors.
    // You can see in the route configuration that on each httpRequest
    // what is being resolved is the return value of checkLoggedIn which
    // is a promise.
    $httpProvider.interceptors.push(function($q, $location) {
        return {
            response: function(response) {
                // do something on success
                return response;
            },
            responseerror: function(response) {
                if (response.status === 401)
                    $location.url('/login');
                return $q.reject(response);
            }
        };
    });

    // ROUTES
    $routeProvider.
    when('/', {
        templateUrl: '/views/welcome/welcome.html',
        controller: 'HomePageController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/home', {
        templateUrl: '/views/welcome/welcome.html',
        controller: 'HomePageController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/questionnaire/:client_id/:form_id', {
        templateUrl: '/views/questionnaire/questionnaire.html',
        controller: 'QuestionnaireController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/results/:client_id/:form_id', {
        templateUrl: '/views/results/results.html',
        controller: 'ResultsController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/questionnaire/:clientid/:formid', {
        templateUrl: '/views/questionnaire/questionnaire.html',
        controller: 'QuestionController', // For testing route parameters.
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/clients', {
        templateUrl: '/views/clients/clients.html',
        controller: 'ClientsController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/login', {
        templateUrl: '/views/user/user.html',
        controller: 'UserController'
    }).
    when('/IBMlogin', {
        templateUrl: '/views/user/user.html',
        controller: 'UserController'
    }).
    when('/add_client', {
        templateUrl: '/views/clients/add_client.html',
        controller: 'AddClientController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/edit_questions/:form_id', {
        templateUrl: '/views/questionnaire/edit_questions.html',
        controller: 'EditQuestionsController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/add_user/', {
        templateUrl: '/views/user/add_user.html',
        controller: 'AddUserController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/forms/', {
        templateUrl: '/views/questionnaire/list_forms.html',
        controller: 'ListFormsController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    when('/howto/', {
        templateUrl: '/views/welcome/howto.html',
        controller: 'HomePageController',
        resolve: {
            loggedin: checkLoggedin
        }
    }).
    otherwise({
        redirectTo: '/home'
    });
// http://stackoverflow.com/questions/20663076/angularjs-app-run-documentation
}).run(function($rootScope, $http) {
    $rootScope.logout = function() {
        $http.post('/logout');
    };
});

// Controller for handling the collapsing of index menu page.
myApp.controller('MenuController', function($scope) {
    $scope.isCollapsed = true;
});
// Example of a controller in the same file.
myApp.controller('HomePageController', function($scope) {
    $scope.message = 'This is the welcome page.';
});
