( function() {

var module = angular.module('questionnaireServiceModule', ['ngResource']);

    module.service('QuestionStore', ['$http', '$resource', function($http, $resource) {
       this.allQuestionConn = $resource('/questions/1/1');
       this.responseConn = $resource('/responses');
       this.addAnswersConn = $resource('/addAnswers');
    }]);

})();
