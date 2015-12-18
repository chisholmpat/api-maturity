(function() {
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', '$window','$routeParams', function($scope, QuestionStore, $window, $routeParams) {


        console.log($routeParams.client_id + $routeParams.form_id);

        // Get questions and responses from database
    $scope.questions = QuestionStore.allQuestionConn.query({client_id: $routeParams.client_id, form_id : $routeParams.form_id}, function() {     console.log($scope.questions);});
	$scope.responses = QuestionStore.responseConn.query();

  // For Creating a numeric range for the weight option
  $scope.Range = function(start, end) {
    var result = [];
    for (var i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};

        // For re-routing the request
        $scope.changeRoute = function(url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
                window.location = url;
            } else {
                $location.path(url);
                $scope.$apply();
            }
        };

        $scope.generateScore = function(questions) {
            QuestionStore.addAnswersConn.save({ user_responses : questions, client_id : $routeParams.client_id} ,
                function(){
                $scope.changeRoute('#/results/' + $routeParams.client_id + '/' + $routeParams.form_id)});
        }
    }]);

    module.controller('EditQuestionsController', ['$scope', 'QuestionStore', '$window', '$routeParams', function($scope, QuestionStore, $window, $routeParams) {
        $scope.questions = QuestionStore.questionConn.query({form_id: $routeParams.form_id }, function() {
            console.log($scope.questions)
        })
    }]);



    // For handling key presses.
    module.directive("select", function() {
        return {
            restrict: "E",
            require: "?ngModel",
            scope: false,
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                element.bind("keyup", function() {
                    element.triggerHandler("change");
                })
            }
        }
    })

})();
