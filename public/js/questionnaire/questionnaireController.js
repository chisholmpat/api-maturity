(function() {
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule'])

    // Controller for handling filling out the form.
    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', '$window', '$routeParams',
        function($scope, QuestionStore, $window, $routeParams) {

            // Get questions and responses from database
            $scope.questions = QuestionStore.allQuestionConn.query({
                client_id: $routeParams.client_id,
                form_id: $routeParams.form_id
            }, function() {});
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

            // Persist the information to the database.
            $scope.generateScore = function(questions) {
                console.log(questions);
                // QuestionStore.addAnswersConn.save({
                //         user_responses: questions,
                //         client_id: $routeParams.client_id
                //     },
                //     function() {
                //         $scope.changeRoute('#/results/' + $routeParams.client_id + '/' + $routeParams.form_id)
                //     });
            }
        }
    ]);

    // Controller for handling the questions editing form.
    module.controller('EditQuestionsController', ['$scope', 'QuestionStore', '$window', '$routeParams',
        function($scope, QuestionStore, $window, $routeParams) {

            // Get the questions belonging to the form.
            $scope.questions = QuestionStore.questionConn.query({
                form_id: $routeParams.form_id
            });

            // Get the potential groupings for the grouping select.
            $scope.groupings = QuestionStore.groupingsConn.query({}, function() {});

            // Function for handling submission of form.
            $scope.editQuestions = function() {
                QuestionStore.updateQuestionsConn.save({
                    questions: $scope.questions
                }, function() {
                    $scope.changeRoute('#/forms/');
                });

            }

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
        }
    ]);

    // Controller for handling listing all the forms.
    module.controller('ListFormsController', ['$scope', 'QuestionStore', '$window', '$routeParams',
        function($scope, QuestionStore, $window, $routeParams) {
            $scope.forms = QuestionStore.formsConn.query({}, function() {});
        }
    ]);

    // For handling key presses.
    module.directive("select", function() {
        return {
            restrict: "E",
            require: "?ngModel",
            scope: false,
            link: function(scope, element, attrs, ngModel) {
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
