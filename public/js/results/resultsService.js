(function() {
    // Provides access to the end point which produces all values required to
    // geneate the score to be provided on the front end.
    var module = angular.module('resultsServiceModule', ['ngResource']);

    module.service('ResultStore', ['$http', '$resource', function($http, $resource) {
        this.scoreConn = $resource('/score/:client_id/:form_id');
    }]);

    module.service('GraphScoresStore', ['$http', '$resource', function($http, $resource, valueWeightsArray) {

        function calculateAllScores(response_value, question_weight) {

            if ((response_value == 1 || response_value == 2) && (question_weight == 1 || question_weight == 2)) {
                return response_value - 1;
            } else {
                return response_value;
            }
        }
        this.getGraphScores = function(valueWeightsArray){

          var score;
          var categories = {
              QA: 1,
              SA: 2
          };
          var scoresArray={};
          var categoryID;
          var formName;

          //Calculate Scores
          for (var i = 0; i < valueWeightsArray.length; i++) {
              categoryID = valueWeightsArray[i].category_id;
              formName = valueWeightsArray[i].name;

              if(!scoresArray[categoryID]){
                scoresArray[categoryID] =  {};
              }
              if (!scoresArray[categoryID][formName]) { //making a hash-map, "gropuname": [array of numbers to be averaged]
                  scoresArray[categoryID][formName] = [];
              }
              (categoryID == categories.SA) ? (score=valueWeightsArray[i].value) : (score = calculateAllScores(valueWeightsArray[i].value, valueWeightsArray[i].weight));
              scoresArray[categoryID][formName].push(score);
          }
          return scoresArray;
        }


    }]);

    module.service('AverageGraphScoresStore', ['$http', '$resource', function($http, $resource, graphScoresArray) {
        this.getAverageGraphScores = function(graphScoresArray){

            var total;
            var averages_array = {};
            var internalArrayLength = 0;

            for (var key in graphScoresArray) {
                total = 0;
                internalArrayLength = graphScoresArray[key].length;
                for (var j = 0; j < internalArrayLength; j++) {
                    total += graphScoresArray[key][j];
                }
                averages_array[key] = (total / (internalArrayLength));
            }
            return averages_array;
        }
    }]);

    module.service('MappedGraphScoresStore', ['$http', '$resource', function($http, $resource, averages_array) {
        this.getMappedGraphScoresScores = function(averages_array){

          var graphInputsArray = {};

          for (var key in averages_array) {
              if (averages_array[key] < 1.1) {
                  graphInputsArray[key] = 0;
              } else if (averages_array[key] > 1 && averages_array[key] < 2.5) {
                  graphInputsArray[key] = 1;
              } else {
                  graphInputsArray[key] = 2;
              }
          }
          return graphInputsArray;
        }
    }]);

    module.service('MakeRadarGraphService', ['$http', '$resource', function($http, $resource, qaGraphData, saGraphData) {
        this.makeRadarGraph = function(qaGraphData, saGraphData){

          var keyArray = [];
          var QAdataArray = [];
          var SAdataArray = [];
          var showGraphId;
          var canvasName = "radarGraph";
          var canvas = document.getElementById(canvasName);

          for (var key in qaGraphData) {
              keyArray.push(key);
              QAdataArray.push(qaGraphData[key]);
              SAdataArray.push(saGraphData[key]);
          }
          var graphData = {
              labels: keyArray,
              datasets: [
                  {
                      label: "QA-Graph",
                      fillColor: "rgba(220,220,220,0.2)",
                      strokeColor: "rgba(220,220,220,1)",
                      pointColor: "rgba(220,220,220,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(220,220,220,1)",
                      data: QAdataArray
                  },
                  {
                      label: "SA-Graph",
                      fillColor: "rgba(151,187,205,0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(151,187,205,1)",
                      data: SAdataArray
                  }
              ]
          };

          var myRadarChart = new Chart(document.getElementById(canvasName).getContext("2d")).Radar(graphData);
          document.getElementById("legendDiv").innerHTML = myRadarChart.generateLegend();
          return;
        }
    }]);

    module.service('MakeGaugeGraphService', ['$http', '$resource', function($http, $resource, QAGraphData, SAGraphData) {
        
        this.makeGaugeGraphs = function(QAGraphData, SAGraphData){

          var qaMaxVal = 4;
          var saMaxVal = 2;

          makeGaugeGraphs(QAGraphData, "QAgaugeGraph", qaMaxVal) ;
          makeGaugeGraphs(SAGraphData, "SAgaugeGraph", saMaxVal) ;
        }
        function makeGaugeGraphs(graph_array, showGraph, max_val) {

            var graphData = [];
            var showGraphId;

            graphData.push(['Label', 'Value']);
            for (var key in graph_array) {
                graphData.push([key, (graph_array[key] / max_val) * 100]); //converting the value to a percentage
            }

            var data = google.visualization.arrayToDataTable(graphData);

            var options = {
                width: 400,
                height: 120,
                redFrom: 90,
                redTo: 100,
                yellowFrom: 75,
                yellowTo: 90,
                minorTicks: 5
            };

            var chart = new google.visualization.Gauge(document.getElementById(showGraph));
            chart.draw(data, options);

        }
    }]);

})();

// //get the average for each group sharing a group_id and convert to graphInput for category_id =1
// averages_array_one = getAverages(groupedup_array_one);
// graph_input_one = getGraphInputs(averages_array_one);
//
// results.radarGraphQA = graph_input_one;
// results.radarGraphSQ = graph_input_two;
// results.gaugeGraphQA = averages_array_one;
// results.gaugeGraphSQ = graph_input_two;
