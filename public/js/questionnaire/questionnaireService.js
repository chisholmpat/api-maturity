( function() {

var module = angular.module('questionnaireServiceModule', ['ngResource']);

    module.service('QuestionStore', ['$http', '$resource', function($http, $resource) {
       this.allQuestionConn = $resource('/questions');
       this.responseConn = $resource('/responses');
       this.addAnswersConn = $resource('/addAnswers');
    }]);

})();
