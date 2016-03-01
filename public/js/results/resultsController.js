(function() {

    var module = angular.module('resultsModule', ['resultsServiceModule', 'ngResource']);

    // Controller for handling the displaying of results.
    module.controller('ResultsController', ['$scope', '$rootScope', '$http', '$routeParams', 'ResultStore',
        'GraphScoresDataService', 'GraphingFunctionsService', 'FileFormatsConversionService', '$resource', '$window', '$route',
        function($scope, $rootScope, $http, $routeParams, ResultStore, GraphScoresDataService,
            GraphingFunctionsService, FileFormatsConversionService, $resource, $window, $route) {

            $scope.forms = [];
            $scope.form_id = $routeParams.form_id;
            $scope.selectedForm = parseInt($scope.form_id, 10);

            // Generate forms for drop down on page and sort them.
            $resource('/forms').query({}, function(response) {
              
              $scope.forms = response;

              $scope.forms.sort(function(a, b) {
                    return a.id - b.id;
                });
            });

            $scope.nextForm = function() {
                var currentIndex = getCurrentIndex();
                if (currentIndex < $scope.forms.length - 1)
                    changePage(currentIndex + 1);
            };

            $scope.prevForm = function() {
                var currentIndex = getCurrentIndex();
                if (currentIndex > 0)
                    changePage(currentIndex - 1);
            };


            // Change the page based on the form selected
            // in the drop down box.
            $scope.changeFormByID = function() {
                for (i = 0; i < $scope.forms.length; i++)
                    if ($scope.forms[i].id == $scope.selectedForm)
                        changePage(i);
            }


            function changePage(newIndex) {
                var resultsURL = '#/results/' + $scope.client_name + '/' +
                    $scope.forms[newIndex].name + '/' + $scope.client_id +
                    '/' + $scope.forms[newIndex].id + '/' + $scope.assessment_id;
                $window.location.assign(resultsURL);
            }


            function getCurrentIndex() {
                for (i = 0; i < $scope.forms.length; i++)
                    if ($scope.forms[i].id == $routeParams.form_id)
                        return i;
            }

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" +
                $routeParams.form_id + "/" + $routeParams.assessment_id + "/csv";

            // Setting properties from params.

            $scope.client_name = $routeParams.client_name;
            $scope.form_name = $routeParams.form_name;
            $scope.form_id = $routeParams.form_id;
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;

        }
    ]);

    module.controller('ApiMaturityResultsController', ['$scope', '$rootScope', '$http', '$routeParams', 'ResultStore',
        'GraphScoresDataService', 'GraphingFunctionsService', 'FileFormatsConversionService', '$window',
        function($scope, $rootScope, $http, $routeParams, ResultStore, GraphScoresDataService, GraphingFunctionsService, FileFormatsConversionService, $window) {
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
                client_id: $scope.$parent.client_id,
                form_id: $scope.$parent.form_id,
                assessment_id: $scope.$parent.assessment_id
            }, function() {

                if ($scope.results.length === 0 && confirm('No results for form. Would you like to start the form now?')) {
                    var url = '/#/questionnaire/' + $routeParams.client_id + '/' + $routeParams.assessment_id;
                    $window.location.href = (url + "?form_id=" + $routeParams.form_id);
                }

                var QAfinalGraphData = [];
                var SAfinalGraphData = [];
                var valueWeightsArray = $scope.results;
                var graphTitles = [];
                var categories = {
                    QA: $rootScope.categoryIDs.QA,
                    SA: $rootScope.categoryIDs.SA
                };

                //obtain all graph scores
                var allGraphScores = GraphScoresDataService.getGraphScores(valueWeightsArray);
                $scope.results = valueWeightsArray;
                var QAaverages = GraphScoresDataService.getAverageGraphScores(allGraphScores[categories.QA]);
                var QAmappedValues = GraphScoresDataService.getMappedGraphScoresScores(QAaverages);

                //get final data for the graphs
                var QAGraphData = QAmappedValues;
                //SA does not get averaged or mapped but using the averages function will convert from single element array to just a value
                var SAGraphData = GraphScoresDataService.getAverageGraphScores(allGraphScores[categories.SA]);


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
                GraphingFunctionsService.makeRadarGraph(QAfinalGraphData, SAfinalGraphData, graphTitles);

                //draw gauge graphs
                //The gauge graphs need to be more detailed then radar, use the averages values as opposed to mapping to a lower value.
                // Load the Visualization API and the gauge charts package if it hassn't been loaded aready
                if (!google.visualization) {
                    google.charts.load('current', {
                        'packages': ['gauge']
                    });
                    google.charts.setOnLoadCallback(function() {
                        // Set a callback to run when the Google Visualization API is loaded.
                        GraphingFunctionsService.makeGaugeGraphs(QAaverages, SAGraphData); //Only once charts loaded drawing charts is executed
                    });
                } else {
                    GraphingFunctionsService.makeGaugeGraphs(QAaverages, SAGraphData); //Only once charts loaded drawing charts is execute
                }
            });
            $scope.getPDF = function() {
                FileFormatsConversionService.convertToPDF($scope.$parent.client_name, $scope.$parent.form_name);
            };

            $scope.getWordFile = function() {
                FileFormatsConversionService.convertToDOCX($http, $scope.$parent.client_name, $scope.$parent.form_name);
            };
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
