(function() {

    var module = angular.module('resultsModule', ['resultsServiceModule', 'ngResource']);

    // Controller for handling the displaying of results.
    module.controller('ResultsController', ['$scope', '$http', '$routeParams', 'ResultStore',
        'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore',
        function($scope, $http, $routeParams, ResultStore, GraphScoresDataStore, GraphingFunctionsStore,
            FileFormatsConversionStore) {

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" +
                $routeParams.form_id + "/" + $routeParams.assessment_id + "/csv";

            // Setting properties from params. 
            $scope.client_name = $routeParams.client_name;
            $scope.form_name = $routeParams.form_name;
            $scope.form_id = $routeParams.form_id;
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;
            $scope.category = $routeParams.category_id;

            // Getting display information for the page from 
            // the assessment in the database.
            ResultStore.assessmentDetailsConn.query({
                    assessment_id: $routeParams.assessment_id
                },
                function(response) {
                    $scope.client_name = response[0].name;
                    $scope.assessment_date = response[0].date;
                });

            // Get results for processing.
            $scope.results = ResultStore.scoreConn.query({
                client_id: $scope.client_id,
                form_id: $scope.form_id,
                assessment_id: $scope.assessment_id
            });


            $scope.getPDF = function() {
                FileFormatsConversionStore.convertToPDF();
            };

            $scope.getWordFile = function() {
                FileFormatsConversionStore.convertToDOCX($http);
            };
        }
    ]);
    module.controller('APIMaturityResultsController', ['$scope', '$routeParams', 'ResultStore',
        'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore', '$rootScope',
        function($scope, $routeParams, ResultStore, GraphScoresDataStore, GraphingFunctionsStore,
            FileFormatsConversionStore, $rootScope) {

            $scope.results = ResultStore.scoreConn.query({
                client_id: $scope.$parent.client_id,
                form_id: $scope.$parent.form_id,
                assessment_id: $scope.$parent.assessment_id
            }, function(results) {

                var QAfinalGraphData = [];
                var SAfinalGraphData = [];
                var valueWeightsArray = results
                var graphTitles = [];
                var categories = {
                    QA: $rootScope.categoryIDs.QA,
                    SA: $rootScope.categoryIDs.SA
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

                for (var i = 0; i < keysArray.length; i++) {
                    var key = keysArray[i];
                    if (graphTitles.indexOf(key) == -1) {
                        QAfinalGraphData.push(QAGraphData[key] || 0); //radar graph
                        SAfinalGraphData.push(SAGraphData[key] || 0); //radar graph
                        QAaverages[key] = (QAaverages[key] || 0); //gauge graph
                        SAGraphData[key] = (SAGraphData[key] || 0); //gauge graph
                        graphTitles.push(key);
                    }
                }

                //draw radar graph
                GraphingFunctionsStore.makeRadarGraph(QAfinalGraphData, SAfinalGraphData, graphTitles);

                //draw gauge graphs
                //The gauge graphs need to be more detailed then radar, use the averages values as opposed to mapping to a lower value.
                // Load the Visualization API and the gauge charts package if it hassn't been loaded aready
                if (!google.visualization) {
                    google.charts.load('current', {
                        'packages': ['gauge']
                    });
                    google.charts.setOnLoadCallback(function() {
                        // Set a callback to run when the Google Visualization API is loaded.
                        GraphingFunctionsStore.makeGaugeGraphs(QAaverages, SAGraphData); //Only once charts loaded drawing charts is executed
                    });
                } else {
                    GraphingFunctionsStore.makeGaugeGraphs(QAaverages, SAGraphData); //Only once charts loaded drawing charts is execute
                }
            });

        }
    ]);

    module.controller('BMIXtoolController', ['$scope',
        function($scope) {
            console.log('BMIXtoolController');
        }
    ]);

    module.controller('ResultsListController', ['$scope', '$routeParams', '$resource',
        function($scope, $routeParams, $resource) {
            $scope.clientName = $resource('/results/:assessment_id').query({
                assessment_id: $routeParams.assessment_id,
            });

            $scope.forms = $resource('/forms').query({});

        }
    ]);

})();
