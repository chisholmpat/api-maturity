(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', function($scope, QuestionStore) {
            $scope.questions = QuestionStore.allQuestionConn.query();
    }]);
})();
