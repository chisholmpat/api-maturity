// Feb 17 TODO: Make casing consistent; only database fields should be using underscore casing.
(function() {
    var module = angular.module('questionnaireModule', ['questionnaireServiceModule']);

    // Controller for handling filling out the form.
    module.controller('QuestionnaireController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$location',
        function($scope, QuestionStore, $window, $routeParams, $location) {

            // For determining which assessment we are on.
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;
            $scope.currentIndex = 0;
            $scope.currentCategoryIndex = 0;

            // Advance to the next form or navigate to the results page
            // for the current assessment if we're on the last survey.

            $scope.handleFormNavigation = function(formIndexIncrement){
                console.log("In handleFormNavigation");
                $scope.currentCategoryIndex = 0;
                //Save the responses to the current set of questions
                $scope.saveAnswers($scope.questions, $scope.unansweredQuestions);

                //Navigation
                switch($scope.currentIndex+formIndexIncrement) {
                    case -1:
                        //at first form, don't navigate back
                        console.log("-1 case");
                        formIndexIncrement =0;
                        break;
                    case $scope.forms.length:
                        //reached the last form, navigate to the list of resultsURL
                        console.log("forms.length case");
                        formIndexIncrement =0;
                        var resultsURL = '/clientforms/' + $scope.clientName + '/' + $scope.client_id + '/' + $scope.assessment_id;
                        $location.url(resultsURL);
                        break;
                    case $scope.currentIndex:
                        //an element picked from the list
                        console.log("form picekd at random");
                        $scope.currentIndex = document.getElementById("slectedFormID").selectedIndex;
                        break;
                    default:
                        //can navigate :)
                        console.log("default case");
                }

                //Update form to new form and category_id to new category_id
                var form_id = $scope.forms[$scope.currentIndex + formIndexIncrement].id;
                console.log(form_id);
                $scope.loadQuestions(form_id);
            }

            // Loads all the questions and responses for a given form id.
            // Used to page the questions using the arrow buttons on page.
            $scope.loadQuestions = function(form_id) {

                $scope.currentFormID = form_id;
                // Find out which index we're on based on the ID
                // of the requested form (form_id) matching up
                // to the array of forms in the controller.
                for (i = 0; i < $scope.forms.length; i++)
                    if ($scope.forms[i].id == form_id)
                        $scope.currentIndex = i;

                $scope.formName = $scope.forms[$scope.currentIndex].name;

                // Get assessment details for displaying information.
                QuestionStore.assessmentDetailsConn.query({
                        assessment_id: $routeParams.assessment_id
                    },
                    function(response) {
                        $scope.clientName = response[0].name;
                        $scope.assessmentDate = response[0].date;
                    }
                );

                // Get questions and responses from database. There is a
                // distinction between answered and unanswered questions
                // currently such that we need to pull them seperately
                // from the database and then combine them into a single
                // array of questions. Later they are split apart to
                // determine if the query is an update or insert query.
                $scope.questions = QuestionStore.allQuestionConn.query({
                    client_id: $scope.client_id,
                    form_id: form_id,
                    assessment_id: $scope.assessment_id
                }, function() {
                    $scope.unansweredQuestions = QuestionStore.allUnansweredQuestionConn.query({
                        client_id: $scope.client_id,
                        form_id: form_id,
                        assessment_id: $scope.assessment_id
                    }, function(data) {
                        Array.prototype.push.apply($scope.questions, data);
                    });
                });

                $scope.responses = QuestionStore.responseConn.query({},function(data){
                  $scope.responseIDs ={};
                  for (i = 0; i < data.length; i++)
                      $scope.responseIDs[data[i].response] = data[i].id;
                });
            };

            // Load the initial questions.
            $scope.forms = QuestionStore.formsConn.query({}, function() {
                var id = $routeParams.form_id ? $routeParams.form_id : $scope.forms[$scope.currentIndex].id;
                $scope.loadQuestions(id);
                $scope.currentFormID = parseInt(id, 10);
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
            $scope.saveAnswers = function(questions, unansweredQuestions) {
                var answers = separateAnswers(); // split into update and insert

                QuestionStore.addAnswersConn.save({
                    updated_answers: answers.updated_answers,
                    new_answers: answers.new_answers,
                    client_id: $routeParams.client_id,
                    assessment_id: $routeParams.assessment_id
                });
            };

            // Used to determine which answers are new and which
            // are being updated. This is done by creating two lists
            // one containing the newly answered and the other the
            // previously answered questions.
            function separateAnswers() {

                var answerGroups = {};
                answerGroups.updated_answers = [];
                answerGroups.new_answers = [];

                for (var i = 0; i < $scope.questions.length; i++) {
                    var found = false;
                    for (var j = 0; j < $scope.unansweredQuestions.length && !found; j++) {
                        if ($scope.questions[i].id == $scope.unansweredQuestions[j].id) {
                            answerGroups.new_answers.push($scope.questions[i]);
                            found = true;
                        }
                    }
                    if (!found)
                        answerGroups.updated_answers.push($scope.questions[i]);
                }

                return answerGroups;
            }
        }
    ]);


    // Controller for handling the questions editing form.
    module.controller('EditQuestionsController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$rootScope','$route',
        function($scope, QuestionStore, $window, $routeParams, $rootScope, $route) {

            // For toggling visibility of add question drop down
            $scope.addQuestion = {};
            $scope.addCategory = false;
            $scope.newQuestion = {};
            $scope.currentCategoryID = "";

            // Updates the question on the form.
            var refreshQuestions = function() {
                $scope.questions = QuestionStore.questionConn.query({
                    form_id: $routeParams.form_id
                });
            };

            // Onclick method for toggling visibility
            $scope.toggleAddQuestionVisibility = function(category_id) {
                $scope.addQuestion[category_id] = !$scope.addQuestion[category_id];
            };

            $scope.setCurrentCategory = function(currentCategoryID) {
                console.log(currentCategoryID);
                for(var i =0; i < $scope.categories.length;i++){
                    if($scope.categories[i].id == currentCategoryID){
                        $scope.category = $scope.categories[i];
                        break
                    }
                }
            }

            // Function for saving question
            $scope.saveQuestion = function(question, questionCategory) {

                // Call to the backend
                QuestionStore.addQuestionConn.save({
                    question: {
                        location : question.location,
                        text: question.text,
                        questioncategory_id: questionCategory,
                        recommendation: question.recommendation
                    }
                }, function() {
                    // Refresh the list and clear the input box
                    refreshQuestions();
                    alert("Question added!");
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

            // Function for handling submission of form.
            $scope.editQuestions = function(questions) {
                console.log(questions);
                QuestionStore.updateQuestionsConn.save({
                    questions: $scope.questions
                }, function() {
                    refreshQuestions();
                    alert("Question(s) updated.");
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

            // For adding new categories to the form.
            $scope.addCategory = function(){
                QuestionStore.addQuestionCategoryConn.save({
                    form_id: $routeParams.form_id,
                    category: $scope.newCategory
                }, function(response) {
                    alert("Category added!");
                    $route.reload();
                });
            }

        }
    ]);

    // Controller for handling listing all the forms.
    module.controller('EditFormsController', ['$scope', 'QuestionStore', '$window', '$routeParams', '$rootScope',
        function($scope, QuestionStore, $window, $routeParams, $rootScope) {

            // Retrive all forms from the database.
            $scope.forms = QuestionStore.formsConn.query();

            // Function for checking if the form name
            // that someone is entering does not already
            // exist in the database.
            $scope.isUnique = function() {
                console.log($scope.notUniqueFormName);
                var forms = $scope.forms
                var isFound = false;
                for (i = 0; i < $scope.forms.length; i++) {
                    if ($scope.newForm && $scope.newForm.text == $scope.forms[i].name) {
                        $scope.notUniqueFormName = true;
                        return true;
                    }
                }
                $scope.notUniqueFormName = false;
                return false;
            }


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
                }, function() {
                    // Update the forms array
                    refreshForms();
                });
            };
        }
    ]);

})();
