(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

module.controller('QuestionnaireController', ['$scope', 'QuestionStore', function($scope, QuestionStore) {
	
	// Get all questions from the backend.
	$scope.questions = QuestionStore.allQuestionConn.query();
        // These are just hard coded but will have to be generated from the database.
	$scope.responses = QuestionStore.responseConn.query();// [{ id : 1, text :'Don\'t do it'},{id : 2, text : 'Planned'},{id: 3, text : 'Response 3.'}];
	// Debug printing
        $scope.generateScore = function(questions) {                
                for(i = 0; i < questions.length; i++)
                    console.log(questions[i].response);
        }
    }]);

// Backend does not currently support this. Will implement tomorrow.
module.controller('QuestionController', ['$scope', 'QuestionStore', '$routeParams', function($scope, QuestionStore, $routeParams){
                console.log($routeParams.clientid);
}]);

})();
