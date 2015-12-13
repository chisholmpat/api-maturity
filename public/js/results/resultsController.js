

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
      var key,j;
      var internalArrayLength = 0;
      var maxGraphPoints = 5;
      var total;
      var averages_array = {};
      for(key in groupedup_array){
        internalArrayLength = groupedup_array[key].length;
        total =0;
        for(j=0;j<internalArrayLength;j++){
          total+=groupedup_array[key][j];
        }
        averages_array[key] = (total/(j+1));
      }
      return averages_array;
    }

    function getGraphInputs(averages_array){
      var graphInputsArray = {};
      var key;

      for(key in averages_array ){
        if(averages_array[key] <1.1){
            graphInputsArray[key] =0;
        }
        else if(1<averages_array[i]<2.5){
            graphInputsArray[key] = 1;
        }
        else{
            graphInputsArray[key] = 2;
        }
      }
      return graphInputsArray;
    }


    function getGraphScores(results){

      var array_length = results.length;
      var groupedup_array_one = {};
      var averages_array_one ={};
      var graph_input_one ={};
      var graph_input_two ={};


      //Calculate Scores
      for(i=0; i<array_length; i++){
          results[i].score = calculateAllScores(results[i].value, results[i].weight);
          if(results[i].category_id ==1){//Consider changing to category_name == "QA"
            if(!groupedup_array_one[results[i].name]){//making a hash-map, "gropuname": [array of numbers to be averaged]
              groupedup_array_one[results[i].name] = [];
            }
            groupedup_array_one[results[i].name].push(results[i].score);
          }
          else {
            graph_input_two[results[i].name] = results[i].value;
          }
      }
      console.log(groupedup_array_one);
      //get the average for each group sharing a group_id and convert to graphInput for category_id =1
      averages_array_one = getAverages(groupedup_array_one);
      graph_input_one = getGraphInputs(averages_array_one);

      results.graphingArrayCategoryOne = graph_input_one;//QA's graph input
      results.graphingArrayCategoryTwo = graph_input_two; //SA'sgraph inpu

    }

    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {

        //Get the data
        console.log("Hi");
				$scope.results = ResultStore.scoreConn.query({
            client_id: $routeParams.client_id,
            form_id: $routeParams.form_id
          },function(){
            graphingArray = getGraphScores($scope.results);
            console.log($scope.results.graphingArrayCategoryOne);
            console.log($scope.results.graphingArrayCategoryTwo);
          }
        );
    }]);
})();
