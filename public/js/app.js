// The other controllers have to be defined in the HTML document which houses
// the angular application, index.html, or you'll get a missing controller error.
<<<<<<< HEAD
var myApp = angular.module('app', ['ngRoute', 'ngResource', 'questionnaireModule', 'clientsModule', 'resultsModule', 'userModule']);
=======
var myApp = angular.module('app', ['ngRoute', 'ngResource', 'questionnaireModule', 'clientsModule', 'resultsModule', 'addClientModule']);
>>>>>>> master

// Configure the views/controller for each of the pages within the application.
myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: '/views/welcome/welcome.html',
            controller: 'HomePageController'
        }).
        when('/home', {
            templateUrl: '/views/welcome/welcome.html',
            controller: 'HomePageController'
        }).
        when('/questionnaire/:client_id/:form_id', {
            templateUrl: '/views/questionnaire/questionnaire.html',
            controller: 'QuestionnaireController'
        }).
        when('/results/:client_id/:form_id', {
            templateUrl: '/views/results/results.html',
            controller: 'ResultsController'
        }).
        when('/questionnaire/:clientid/:formid', {
            templateUrl: '/views/questionnaire/questionnaire.html',
            controller: 'QuestionController' // For testing route parameters.
        }).
        when('/clients', {
            templateUrl: '/views/clients/clients.html',
            controller: 'ClientsController'
        }).=
        when('/userLogin', {
            templateUrl: '/views/user/user.html',
            controller: 'userController'
        when('/add_client', {
          templateUrl: '/views/add_client/add_client.html',
          controller: 'AddClientController'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

// Example of a controller in the same file.
myApp.controller('HomePageController', function ($scope) {
    $scope.message = 'This is the welcome page.';
});
