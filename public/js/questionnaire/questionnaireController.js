(function() {
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule']);

    // Controller for handling filling out the form.
    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$location',
        function($scope, QuestionStore, $window, $routeParams, $location) {

            $scope.category = $routeParams.category_id;

            // For determining which assessment we are on.
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;
            $scope.currentIndex = 0;

            // Advance to the next form.
            $scope.nextForm = function() {
                console.log("Checking");
                if ($scope.currentIndex < $scope.forms.length - 1) {
                    $scope.generateScore($scope.questions, $scope.unansweredQuestions, true);
                    $scope.loadQuestions($scope.forms[$scope.currentIndex + 1].id);
                } else {
                    alert("WAITING FOR ROSE TO FINISH RESULTS PAGE");
                }
                    
            };

            // Go to a previous form.
            $scope.prevForm = function() {
                if ($scope.currentIndex > 0) {
                    $scope.loadQuestions($scope.forms[$scope.currentIndex - 1].id);
                }
            };

            // Loads all the questions and responses for 
            // a given form id. Used to page the questions.
            $scope.loadQuestions = function(form_id) {

                for (i = 0; i < $scope.forms.length; i++)
                    if ($scope.forms[i].id == form_id)
                        $scope.currentIndex = i;

                // Set the current form name
                $scope.formName = $scope.forms[$scope.currentIndex].name;

                // Get questions and responses from database
                $scope.questions = QuestionStore.allQuestionConn.query({
                    client_id: $scope.client_id,
                    form_id: form_id,
                    assessment_id: $scope.assessment_id
                }, function() {
                
                    // Get unanswered questions and responses from database
                    $scope.unansweredQuestions = QuestionStore.allUnansweredQuestionConn.query({
                        client_id: $scope.client_id,
                        form_id: form_id,
                        assessment_id: $scope.assessment_id
                    }, function(data) {
                        Array.prototype.push.apply($scope.questions, data);
                    });
                
                });
                
                $scope.responses = QuestionStore.responseConn.query({}, function(data){
                
    
                });
            };

            // Load the initial questions.
            $scope.forms = QuestionStore.formsByCategoryConn.query({
                category_id: $scope.category
            }, function() {
                $scope.loadQuestions($scope.forms[$scope.currentIndex].id);
            });

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
            $scope.generateScore = function(questions, unansweredQuestions, stayOnPage) {
            
                var answers = separateAnswers(); // split into update and insert
                
                QuestionStore.addAnswersConn.save({
                        answersToUpdate: answers.answersToUpdate,
                        answersToAdd: answers.answersToAdd,
                        clientID: $routeParams.client_id,
                        assessmentID: $routeParams.assessment_id
                    });
            };
            
            // Used to determine which answers are new and which
            // are being updated. This is done by creating two lists
            // one containing the newly answered and the other the 
            // previously answered questions.
            function separateAnswers () {

                var answerGroups = {};
                answerGroups.answersToUpdate = [];
                answerGroups.answersToAdd = [];
                
                for (var i = 0; i < $scope.questions.length; i++) {
                    var found = false;
                    for (var j = 0; j < $scope.unansweredQuestions.length && !found; j++) {
                        if ($scope.questions[i].id == $scope.unansweredQuestions[j].id) {
                            answerGroups.answersToAdd.push($scope.unansweredQuestions[j]);
                            found = true;
                        }
                    }

                    if (!found)
                        answerGroups.answersToUpdate.push($scope.questions[i]);
                }
                
                return answerGroups;
            }
            
    
    }]);


    // Controller for handling the questions editing form.
    module.controller('EditQuestionsController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$rootScope',
        function($scope, QuestionStore, $window, $routeParams, $rootScope) {

            // For toggling visibility of add question drop down
            $scope.addQuestion = false;

            // Updates the question on the form.
            var refreshQuestions = function() {
                $scope.questions = QuestionStore.questionConn.query({
                    form_id: $routeParams.form_id
                });
            };

            // Onclick method for toggling visibility
            $scope.toggleAddQuestionVisibility = function() {
                $scope.addQuestion = !$scope.addQuestion;
            };

            // Function for saving question
            $scope.saveQuestion = function(question) {

                question.form_id = $routeParams.form_id;

                // Currently there are only two types of question. This will
                // obviously become a problem when more question types are added.
                if($scope.questions[0].category_id == $rootScope.categoryIDs.QA){
                    question.category_id = $rootScope.categoryIDs.QA;
                    question.group_id = 1;
                } else {
                    question.category_id = $rootScope.categoryIDs.BMIX;
                }

                // Call to the backend
                QuestionStore.addQuestionConn.save({
                    question: question

                }, function() {
                    // Refresh the list and clear the input box
                    refreshQuestions();
                    $scope.addQuestion = false;
                    $scope.newQuestion.text = "";
                });
            };

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

            refreshQuestions();

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
        }
    ]);

    // Controller for handling listing all the forms.
    module.controller('ListFormsController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$rootScope',
        function($scope, QuestionStore, $window, $routeParams, $rootScope) {

            // Retrive all Forms
            $scope.forms = QuestionStore.formsConn.query({}, function() {});

            // Sets a form's active field to inactive
            $scope.deleteForm = function(form) {
                if (confirm('Are you sure you want to delete this form ?')) {
                    QuestionStore.deleteFormConn.save({
                        id: form.id
                    }, function() {
                        var index = $scope.forms.indexOf(form);
                        $scope.forms.splice(index, 1);
                    });
                }
            };

            $scope.categories = [
              { 
                name: "Bluemix Affinity",
                id: $rootScope.categoryIDs.BMIX
              },
              {
                name: "API Maturity",
                id: $rootScope.categoryIDs.API

              }
            ]

            // For toggling visibility of add question drop down
            $scope.addForm = false;

            // Updates the question on the form.
            var refreshForms = function() {
                $scope.forms = QuestionStore.formsConn.query({});
                // Refresh the list and clear the input box
                $scope.addForm = false;
                $scope.newForm.text = "";
            };

            // Onclick method for toggling visibility
            $scope.toggleAddFormVisibility = function() {
                $scope.addForm = !$scope.addForm;
            };

            // Function for saving a new form
            $scope.saveForm = function(newForm) {
                
              // Call to the backend
                QuestionStore.addFormConn.save({
                    formName: newForm.text,
                    category_id: newForm.category_id,
                    is_api: newForm.category_id == $rootScope.categoryIDs.API
                }, function() {
                    // Update the forms array
                    refreshForms();
                }); 
            };
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
                });
            }
        };
    });

})();
