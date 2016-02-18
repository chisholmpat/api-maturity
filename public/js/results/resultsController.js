(function() {

    var module = angular.module('resultsModule', ['resultsServiceModule', 'ngResource']);

    // Controller for handling the displaying of results.
    module.controller('ResultsController', ['$scope', '$rootScope', '$http', '$routeParams', 'ResultStore',
        'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore', '$resource', '$window', '$route',
        function($scope, $rootScope, $http, $routeParams, ResultStore, GraphScoresDataStore,
            GraphingFunctionsStore, FileFormatsConversionStore, $resource, $window, $route) {

            $scope.forms = [];
            $scope.form_id = $routeParams.form_id;
            $scope.selectedForm = $scope.form_id;
            $scope.client_name = $routeParams.client_name;
            $scope.form_name = $routeParams.form_name;
            $scope.form_id = $routeParams.form_id;
            $scope.client_id = $routeParams.client_id;
            $scope.assessment_id = $routeParams.assessment_id;
            $scope.category = $routeParams.category_id;

            // Generate forms for drop down on page and sort them.
            $resource('/forms').query({}, function(response) {
                
                // Parse out the forms which do not belong to 
                // the category of the page.
                for (form of response) {
                    if (form.category_id == $routeParams.category_id)
                        $scope.forms.push(form);
                }

                // Sort the forms so that the paging can be done
                // in a consistent manner based on the index of 
                // the form you're currently on.
                $scope.forms.sort(function(a, b) {
                    return a.id - b.id;
                });
            });

            // Page back by one form.
            $scope.nextForm = function() {
                var currentIndex = getCurrentIndex();
                if (currentIndex < $scope.forms.length - 1)
                    changePage(currentIndex + 1);
            };

            // Page ahead by one form.
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

            // Change the page based on the index of the collection of
            // forms. Used to page forward, back and from the select menu.
            function changePage(newIndex) {
                var resultsURL = '#/results/' + $scope.client_name + '/' +
                    $scope.forms[newIndex].name + '/' + $scope.category + '/' + $scope.client_id +
                    '/' + $scope.forms[newIndex].id + '/' + $scope.assessment_id;
                $window.location.assign(resultsURL);
            }


            // Utility function used to find out what the current index is
            // so we know where in the collection of forms we currently are.
            function getCurrentIndex() {
                for (i = 0; i < $scope.forms.length; i++)
                    if ($scope.forms[i].id == $routeParams.form_id)
                        return i;
                    return 0;
            }

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" +
                $routeParams.form_id + "/" + $routeParams.assessment_id + "/csv";


        }
    ]);

    module.controller('ApiMaturityResultsController', ['$scope', '$rootScope', '$http', '$routeParams', 'ResultStore',
        'GraphScoresDataStore', 'GraphingFunctionsStore', 'FileFormatsConversionStore',
        function($scope, $rootScope, $http, $routeParams, ResultStore, GraphScoresDataStore, GraphingFunctionsStore, FileFormatsConversionStore) {
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

                var QAfinalGraphData = [];
                var SAfinalGraphData = [];
                var valueWeightsArray = $scope.results;
                var graphTitles = [];
                var categories = {
                    QA: $rootScope.categoryIDs.QA,
                    SA: $rootScope.categoryIDs.SA
                };

                //obtain all graph scores
                var allGraphScores = GraphScoresDataStore.getGraphScores(valueWeightsArray);
                $scope.results = valueWeightsArray;
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
            $scope.getPDF = function() {
                FileFormatsConversionStore.convertToPDF($scope.$parent.client_name, $scope.$parent.form_name);
            };

            $scope.getWordFile = function() {
                FileFormatsConversionStore.convertToDOCX($http, $scope.$parent.client_name, $scope.$parent.form_name);
            };
        }
    ]);

    module.controller('BmixResultsController', [

        function() {
            console.log('BmixResultsController');
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
