// The other controllers have to be defined in the HTML document which houses
// the angular application, index.html, or you'll get a missing controller error.
var myApp = angular.module('app', ['ngRoute', 'ngResource', 'questionnaireModule', 'resultsModule']);

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
        otherwise({
            redirectTo: '/home'
        });
    }]);

// Example of a controller in the same file.
myApp.controller('HomePageController', function ($scope) {
    $scope.message = 'This is the welcome page.';
});
