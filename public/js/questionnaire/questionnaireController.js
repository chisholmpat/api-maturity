(function(){
    var module = angular.module('questionnaireModule', ['questionServiceModule'])

    module.controller('QuestionnaireController', function($scope) {
            $scope.message = 'This is the questionnaire page.';
    });
})();
