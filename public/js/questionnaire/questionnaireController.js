(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

module.controller('QuestionnaireController', ['$scope', 'QuestionStore', function($scope, QuestionStore) {
            $scope.questions = QuestionStore.allQuestionConn.query();

        $scope.responses = [{
            id : 1,
            text :'Don\'t do it'
         },
         {
            id : 2,
            text : 'Planned'
         },
         {
            id: 3,
            text : 'Rose Smells.'
         }
         ];

        $scope.generateScore = function(questions) {                
                for(i = 0; i < questions.length; i++)
                    console.log(questions[i].response);
        }
    }]);

module.controller('QuestionController', ['$scope', 'QuestionStore', '$routeParams', function($scope, QuestionStore, $routeParams){
                console.log($routeParams.clientid);
}]);

})();
