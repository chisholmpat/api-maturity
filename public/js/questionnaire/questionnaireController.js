(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', function($scope, QuestionStore) {
            $scope.message = QuestionStore.sampleDataConn.query();
    }]);
})();
