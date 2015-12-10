(function(){
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

module.controller('QuestionnaireController', ['$scope', 'QuestionStore', 'items', function($scope, QuestionStore, items) {
	
	
	console.log(items.list());
	// Get all questions from the backend.
	$scope.questions = QuestionStore.allQuestionConn.query();
        // These are just hard coded but will have to be generated from the database.
	$scope.responses = QuestionStore.responseConn.query();// [{ id : 1, text :'Don\'t do it'},{id : 2, text : 'Planned'},{id: 3, text : 'Response 3.'}];
	
	// Debug printing
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
                for(i = 0; i < questions.length; i++)
                    console.log(questions);
		    items.add(questions);
		    $scope.changeRoute('#/results')
        }
    }]);

// Backend does not currently support this. Will implement tomorrow.
module.controller('QuestionController', ['$scope', 'QuestionStore', '$routeParams', function($scope, QuestionStore, $routeParams){
                console.log($routeParams.clientid);
}]);

})();
