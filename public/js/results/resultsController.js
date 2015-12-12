(function() {




	  // Retrieve all information required to generate score.
    var module = angular.module('resultsModule', ['resultsServiceModule']);
    module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {
				$scope.results = ResultStore.scoreConn.query({
            client_id: $routeParams.client_id,
            form_id: $routeParams.form_id
        }, function() {
                    $scope.results = calcScores($scope.results);

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



})();
