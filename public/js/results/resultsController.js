(function() {


    // Retrieve all information required to generate score.

    function calculateAllScores(response_value, question_weight) {

        if ((response_value == 1 || response_value == 2) && (question_weight == 1 || question_weight == 2)) {
            return response_value - 1;
        } else {
            return response_value;
        }
    }

    function getAverages(groupedup_array) {
        var key, j;
        var internalArrayLength = 0;
        var maxGraphPoints = 5;
        var total;
        var averages_array = {};

        for (key in groupedup_array) {
            internalArrayLength = groupedup_array[key].length;
            total = 0;
            for (j = 0; j < internalArrayLength; j++) {
                total += groupedup_array[key][j];
            }
            averages_array[key] = (total / (internalArrayLength));
        }
        return averages_array;
    }

    function getGraphInputs(averages_array) {
        var graphInputsArray = {};
        var key;

        for (key in averages_array) {
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


    function getGraphScores(results) {

        var array_length = results.length;
        var groupedup_array_one = {};
        var averages_array_one = {};
        var graph_input_one = {};
        var graph_input_two = {};


        //Calculate Scores
        for (i = 0; i < array_length; i++) {
            results[i].score = calculateAllScores(results[i].value, results[i].weight);
            if (results[i].category_id == 1) { //Consider changing to category_name == "QA"
                if (!groupedup_array_one[results[i].name]) { //making a hash-map, "gropuname": [array of numbers to be averaged]
                    groupedup_array_one[results[i].name] = [];
                }
                groupedup_array_one[results[i].name].push(results[i].score);
            } else {
                graph_input_two[results[i].name] = results[i].value;
            }
        }
        //get the average for each group sharing a group_id and convert to graphInput for category_id =1
        averages_array_one = getAverages(groupedup_array_one);
        graph_input_one = getGraphInputs(averages_array_one);

        results.radarGraphQA = graph_input_one;
        results.radarGraphSQ = graph_input_two;
        results.gaugeGraphQA = averages_array_one;
        results.gaugeGraphSQ = graph_input_two;

    }


    function makeRadarGraphs(graph_array, showGraph) {

        var keyArray = [];
        var dataArray = [];
        var key;
        var showGraphId;

        for (key in graph_array) {
            keyArray.push(key);
            dataArray.push(graph_array[key]);
        }

        // Radar chart data
        var graphData = {
            labels: keyArray,
            datasets: [{
                label: showGraph,
                fillColor: "rgba(172,194,132,0.4)",
                strokeColor: "#ACC26D",
                pointColor: "#fff",
                pointStrokeColor: "#9DB86D",
                data: dataArray
            }]
        }

        showGraphId = document.getElementById(showGraph);
        // get radar chart canvas
        var radarChart = document.getElementById(showGraph).getContext('2d');

        // draw radar chart
        new Chart(radarChart).Radar(graphData);


        // //hide the other canvas
        // showGraphId.style.display = "block";

    }

    function makeGaugeGraphs(graph_array, showGraph) {

        var graphData = [];
        var showGraphId;
        var max_val = 4;
        var key;

        graphData.push(['Label', 'Value']);
        for (key in graph_array) {
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

    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore',
        function($scope, $routeParams, ResultStore) {

            // URL for retrieving results as a CSV file
            $scope.csvURL = "questions/" + $routeParams.client_id + "/" + $routeParams.form_id + "/csv"

            $scope.results = ResultStore.scoreConn.query({
                client_id: $routeParams.client_id,
                form_id: $routeParams.form_id
            }, function() {
                graphingArray = getGraphScores($scope.results);
                $scope.graphingFunction = function() {
                    function drawCharts() {
                        makeGaugeGraphs($scope.results.gaugeGraphQA, 'QAgaugeGraph');
                        makeGaugeGraphs($scope.results.gaugeGraphSQ, 'SAgaugeGraph');
                    }

                    makeRadarGraphs($scope.results.radarGraphQA, 'QAgraph');
                    makeRadarGraphs($scope.results.radarGraphSQ, 'SAgraph');
                    google.charts.setOnLoadCallback(drawCharts); //Only once charts loaded drawing charts is executed, this takes care of page refresh

                }
            });
        }
    ]);
})();
