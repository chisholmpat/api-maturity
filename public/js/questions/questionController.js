(function(){
    var module = angular.module('questionsModule', [])

    module.controller('QuestionsController', function() {
        this.id =0;
        this.text = "";
        this.form_id = 0;
        this.category = "";
    });
})();
