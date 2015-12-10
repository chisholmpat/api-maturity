(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

module.controller('QuestionnaireController', ['$scope', 'QuestionStore', 'items', function($scope, QuestionStore, items) {
	
	// Get the questions and responses from the data base.
    $scope.questions = QuestionStore.allQuestionConn.query();
	$scope.responses = QuestionStore.responseConn.query();// [{ id : 1, text :'Don\'t do it'},{id : 2, text : 'Planned'},{id: 3, text : 'Response 3.'}];
	
	// For re-routing the request
    $scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };
	
    $scope.generateScore = function(questions) {                
        // For viewing contents of questions
        for(i = 0; i < questions.length; i++)
                console.log(questions);
		// Store the answered questions in our service (for now).
        items.add(questions);
        // Redirect to our results page.
		$scope.changeRoute('#/results')
        }
    }]);

// Backend does not currently support this. Will implement tomorrow.
module.controller('QuestionController', ['$scope', 'QuestionStore', '$routeParams', function($scope, QuestionStore, $routeParams){
                console.log($routeParams.clientid);
}]);

})();
