(function() {
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', 'items','$routeParams', function($scope, QuestionStore, items, $routeParams) {

        console.log($routeParams.client_id + $routeParams.form_id);
        // Get questions and responses from database
        $scope.questions = QuestionStore.allQuestionConn.query({client_id: $routeParams.client_id, form_id : $routeParams.form_id});
        $scope.responses = QuestionStore.responseConn.query();

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
            items.add(questions);
            QuestionStore.addAnswersConn.save({ user_responses : questions, client_id : $routeParams.client_id});
            $scope.changeRoute('#/results/' + $routeParams.client_id + '/' + $routeParams.form_id)
        }
    }]);

    // Backend does not currently support this. Will implement tomorrow.
    module.controller('QuestionController', ['$scope', 'QuestionStore', '$routeParams', function($scope, QuestionStore, $routeParams) {
        console.log($routeParams.clientid);
    }]);

})();
