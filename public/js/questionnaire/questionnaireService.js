(function() {
    var module = angular.module('questionnaireServiceModule', ['ngResource']);
    module.service('QuestionStore', ['$http', '$resource',
        function($http, $resource) {
            this.allQuestionConn = $resource('/questions/:client_id/:form_id/:assessment_id');
            this.allUnansweredQuestionConn = $resource('/unansweredQuestions/:client_id/:form_id/:assessment_id');
            this.responseConn = $resource('/responses');
            this.addAnswersConn = $resource('/insertAnswers');
            this.questionConn = $resource('/questions/:form_id');
            this.groupingsConn = $resource('/groupings');
            this.formsConn = $resource('/forms');
            this.updateQuestionsConn = $resource('/update_questions');
            this.deleteQuestionConn = $resource('/deleteQuestion');
            this.addFormConn = $resource('/addForm');
            this.deleteFormConn = $resource('/deleteForm');
            this.addQuestionConn = $resource('/addQuestion');
            this.assessmentCategoryConn = $resource('/assessment_category/:assessment_id');
            this.assessmentDetailsConn = $resource('/assmentdetails/:assessment_id');
        }
    ]);


})();
