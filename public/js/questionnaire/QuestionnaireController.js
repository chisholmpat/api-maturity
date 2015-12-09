(function(){
    var module = angular.module('questionnaireModule', [])

    module.controller('QuestionnaireController', function($scope) {
            $scope.message = 'This is the questionnaire page.';
    });
})();
