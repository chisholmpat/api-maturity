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
                QuestionStore.addAnswersConn.save({
                        user_responses: questions,
                        client_id: $routeParams.client_id
                    },
                    function() {
                        console.log("Testing!");
                        $scope.changeRoute('#/results/' + $routeParams.client_id + '/' + $routeParams.form_id)
                    });
            }
        }
    ]);

    // Controller for handling the questions editing form.
    module.controller('EditQuestionsController', ['$scope', 'QuestionStore', '$window', '$routeParams',
        function($scope, QuestionStore, $window, $routeParams) {

            // for toggling visibility of add question drop down 
            $scope.addQuestion = false;


            $scope.toggleAddQuestionVisibility = function() {
                $scope.addQuestion = !$scope.addQuestion;
            };

            $scope.saveQuestion = function(question) {
                console.log(question);

                question.category_id=1;
                question.form_id = $routeParams.form_id;
                $window.alert(question.text);

                QuestionStore.addQuestionConn.save({
                    question: question

                }, function() {
                    $scope.addQuestion = false;
                    $scope.newQuestion.group_id = 1;
                    $scope.newQuestion.category_id = 1;
                    $scope.newQuestion.text = "";
                    $scope.questions.push(question);
                })
            };


            // Get the questions belonging to the form.
            $scope.questions = QuestionStore.questionConn.query({
                form_id: $routeParams.form_id
            });

            // Sets a questions's active field to inactive
            $scope.deleteQuestion = function(question) {
                if (confirm('Are you sure you want to delete this?')) {
                    QuestionStore.deleteQuestionConn.save({
                        id: question.id
                    }, function() {
                        var index = $scope.questions.indexOf(question);
                        $scope.questions.splice(index, 1);
                    });
                }
            };


            // Get the potential groupings for the grouping select.
            $scope.groupings = QuestionStore.groupingsConn.query({}, function() {

            });

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
