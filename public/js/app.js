var myApp = angular.module('app', ['ngRoute', 'ngResource', 'questionnaireModule']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/welcome/welcome.html',
        controller: 'HomePageController'
      }). 
      when('/home', {
        templateUrl: 'views/welcome/welcome.html',
        controller: 'HomePageController'
      }).
      when('/questionnaire', {
        templateUrl: 'views/questionnaire/questionnaire.html',
        controller: 'QuestionnaireController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

myApp.controller('HomePageController', function($scope) {
    $scope.message = 'This is the welcome page.';
});

    




