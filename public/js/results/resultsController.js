

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

      array_length = results.length;
      console.log("graphScores");

      //Calculate Scores
      for(i=0; i<array_length; i++){
          results[i].score = calculateAllScores(results[i].value, results[i].weight);
          console.log(results[i]);
      }
      //Calcualte the final graph value based on the average of each group
      console.log("forAveragesArray");
    }



    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {

        var i=0;
        var array_length;
        var results;
        var forAveragesArray;
        var current_array;

        //Get the data
				$scope.results = ResultStore.scoreConn.query({
            client_id: $routeParams.client_id,
            form_id: $routeParams.form_id,
          },function(){
            getGraphScores($scope.results);
          }
        );

    }]);
})();
