(function(){

var module = angular.module('resultsModule', ['resultsServiceModule']);

module.controller('ResultsController', ['$scope', '$routeParams', 'ResultStore', function($scope, $routeParams, ResultStore) {

	$scope.answers = ResultStore.scoreConn.get({client_id: $routeParams.client_id, form_id : $routeParams.form_id});
	console.log($scope.answers);

}]);

})();
