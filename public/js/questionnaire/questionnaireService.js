( function() {

var module = angular.module('questionnaireServiceModule', ['ngResource']);
    module.service('QuestionStore', ['$http', '$resource', function($http, $resource) {
       this.allQuestionConn = $resource('/questions/:client_id/:form_id');
       this.responseConn = $resource('/responses');
       this.addAnswersConn = $resource('/addAnswers');
    }]);

})();
