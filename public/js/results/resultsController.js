(function() {

    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', 'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore',
        function($scope, $routeParams, ResultStore, GraphScoresDataStore, GraphingFunctionsStore, FileFormatsConversionStore) {

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" + $routeParams.form_id + "/csv";

            $scope.results = ResultStore.scoreConn.query({
                client_id: $routeParams.client_id,
                form_id: $routeParams.form_id
            }, function(results) {

                var valueWeightsArray = results;
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
                var SAGraphData = allGraphScores[categories.SA]; //SA does not get averaged or mapped

                //draw radar graph
                GraphingFunctionsStore.makeRadarGraph(QAGraphData, SAGraphData);
                
                //draw gauge graphs
                GraphingFunctionsStore.makeGaugeGraphs(QAGraphData, SAGraphData); //Only once charts loaded drawing charts is executed

            });
            $scope.getPDF = function(results) {
                FileFormatsConversionStore.convertToPDF($scope.results);
            }

        }
    ]);
})();
