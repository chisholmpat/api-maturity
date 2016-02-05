(function() {

    var module = angular.module('resultsModule', ['resultsServiceModule', 'ngResource']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', 'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore',
        function($scope, $routeParams, ResultStore, GraphScoresDataStore, GraphingFunctionsStore, FileFormatsConversionStore) {

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" + $routeParams.form_id + "/csv";

            $scope.results = ResultStore.scoreConn.query({
                client_id: $routeParams.client_id,
                form_id: $routeParams.form_id,
                assessment_id: $routeParams.assessment_id
            }, function(results) {

                var QAfinalGraphData = [];
                var SAfinalGraphData = [];
                var valueWeightsArray = results;
                var graphTitles = [];
                var categories = {
                    QA: 1,
                    SA: 2
                };

                //obtain all graph scores
                var allGraphScores = GraphScoresDataStore.getGraphScores(valueWeightsArray);
                var QAaverages = GraphScoresDataStore.getAverageGraphScores(allGraphScores[categories.QA]);
                var QAmappedValues = GraphScoresDataStore.getMappedGraphScoresScores(QAaverages);

                //get final data for the graphs
                var QAGraphData = QAmappedValues;
                //SA does not get averaged or mapped but using the averages function will convert from single element array to just a value
                var SAGraphData = GraphScoresDataStore.getAverageGraphScores(allGraphScores[categories.SA]);


                //Get a list of all possible keys
                var qaKeys = Object.keys(QAGraphData);
                var saKeys = Object.keys(SAGraphData);
                var keysArray = qaKeys.concat(saKeys); // Merges both arrays

                for(var i=0; i< keysArray.length; i++){
                  var key = keysArray[i];
                  if(graphTitles.indexOf(key)==-1){
                    QAfinalGraphData.push(QAGraphData[key] || 0); //radar graph
                    SAfinalGraphData.push(SAGraphData[key] || 0); //radar graph
                    QAGraphData[key] =  (QAGraphData[key]  || 0); //gauge graph
                    SAGraphData[key] =  (SAGraphData[key]  || 0); //gauge graph
                    graphTitles.push(key);
                  }
                }

                //draw radar graph
                GraphingFunctionsStore.makeRadarGraph(QAfinalGraphData, SAfinalGraphData, graphTitles);

                //draw gauge graphs
                GraphingFunctionsStore.makeGaugeGraphs(QAGraphData, SAGraphData); //Only once charts loaded drawing charts is executed
            });

            $scope.getPDF = function() {
                FileFormatsConversionStore.convertToPDF();
            }
        }
    ]);

    module.controller('ResultsListController',['$scope', '$routeParams', '$resource', function($scope, $routeParams, $resource){
          $scope.clientName = $resource('/results/:assessment_id').query({
            assessment_id : $routeParams.assessment_id,
          });

          $scope.forms = $resource('/forms').query({});

    }]);

})();
