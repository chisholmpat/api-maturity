(function () {
    var module = angular.module('questionnaireServiceModule', ['ngResource']);
    module.service('QuestionStore', ['$http', '$resource', function ($http, $resource) {
        this.allQuestionConn = $resource('/questions/:client_id/:form_id');
        this.responseConn = $resource('/responses');
        this.addAnswersConn = $resource('/insertAnswers');
        this.questionConn = $resource('/questions/:form_id');
        this.groupingsConn = $resource('/groupings');
        this.formsConn = $resource('/forms');
    }]);

})();
