

(function() {
    // Retrieve all information required to generate score.

    function calculateAllScores(response_value, question_weight){

        if( (response_value==1||response_value==2) && (question_weight==1||question_weight==2) ){
            return response_value-1;
        }
        else{
            return response_value;
        }
    }

    function getGraphScores(results){

        var array_length = results.length;
        var groupedup_array_one = [[],[],[],[],[]];
        var groupedup_array_two = [[],[],[],[],[]];
        var group_name;

        //Calculate Scores
        for(i=0; i<array_length; i++){
            results[i].score = calculateAllScores(results[i].value, results[i].weight);
            if(results[i].category_id ==1){
                groupedup_array_one[results[i].group_id -1].push(results[i].score);
            }
            else {
                groupedup_array_two[results[i].group_id -1].push(results[i].score);
            }
        }
        //get the average for each group sharing a group_id


    }



    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {

        var i=0;
        var array_length;
        var results;
        var forAveragesArray;
        var current_array;

        //Get the data
        console.log("Hi");
        $scope.results = ResultStore.scoreConn.query({
                client_id: $routeParams.client_id,
                form_id: $routeParams.form_id,
            },function(){
                getGraphScores($scope.results);
            }
        );
    }]);
})();
