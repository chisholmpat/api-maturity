

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

    function getAverages(groupedup_array){
      var i,j;
      var internalArrayLength = 0;
      var maxGraphPoints = 5;
      var total;
      var averages_array = [];
      for(i=0;i<maxGraphPoints;i++){
        internalArrayLength = groupedup_array[i].length;
        total =0;
        for(j=0;j<internalArrayLength;j++){
          total+=groupedup_array[i][j];
        }
        averages_array.push(total/(j+1));
      }
      return averages_array;
    }

    function getGraphInputs(averages_array){
      var graphInputsArray = [];
      var array_length = averages_array.length;
      var i;

      for(i=0; i<array_length; i++){
        if(averages_array[i] <1.1){
            graphInputsArray[i] =0;
        }
        else if(1<averages_array[i]<2.5){
            graphInputsArray[i] = 1;
        }
        else{
            graphInputsArray[i] = 2;
        }
      }
      return graphInputsArray;
    }


    function getGraphScores(results){

      var array_length = results.length;
      var groupedup_array_one = [[],[],[],[],[]];
      var averages_array_one =[];
      var graph_input_one =[];
      var graph_input_two =[];
      var group_name;

      //Calculate Scores
      for(i=0; i<array_length; i++){
          results[i].score = calculateAllScores(results[i].value, results[i].weight);
          if(results[i].category_id ==1){//Consider changing to category_name == "QA"
            groupedup_array_one[results[i].group_id -1].push(results[i].score);
          }
          else {
            graph_input_two.push(results[i].value);
          }
      }
      console.log(groupedup_array_one);
      //get the average for each group sharing a group_id and convert to graphInput for category_id =1
      averages_array_one = getAverages(groupedup_array_one);
      graph_input_one = getGraphInputs(averages_array_one);


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
