(function() {


	  // Retrieve all information required to generate score.
    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {
				$scope.results = ResultStore.scoreConn.query({
            client_id: $routeParams.client_id,
            form_id: $routeParams.form_id
        }, function() {
                    $scope.results = calcScores($scope.results);
                    $scope.averages = calcAverages($scope.results);

                });
    }]);


    // Calculate Scores
    function calcScores (results) {
        for(i=0; i<results.length; i++){
            if((results[i].value == 1 || results[i].value == 2)
                && (results[i].weight == 1 || results.weight == 2))
                results[i].score = results[i].value - 1;
            else
                results[i].score = results[i].value;
        }

        return results;
    };

    function calcAverages(results){


        SA = {};
        QA = {};
        averages = [];

        for(i = 0; i < results.length;i++){
            SA[results[i].name] = {group_id : results[i].group_id, name: results[i].name,  total: 0, count: 0};
            QA[results[i].name] = {group_id : results[i].group_id, name: results[i].name, total: 0, count: 0};
        }

        for(i = 0; i < results.length;i++) {
            if(results[i].category_id == 1)
                var group = QA[results[i].name];
            else
                var group = SA[results[i].name];

            group.total += results[i].score;
            group.count += 1;
        }

        for(group in QA) {
           averages.push( {name :QA[group].name, category_id : 1, average : QA[group].total / QA[group].count })
        }

        for(group in SA) {
            averages.push( {name :SA[group].name, category_id : 2, average : SA[group].total / SA[group].count })
        }

        console.log(averages);

        return averages;

    }



})();
