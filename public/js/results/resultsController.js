(function(){

var module = angular.module('resultsModule', ['questionnaireServiceModule']);

module.controller('ResultsController', ['$scope', 'items', function($scope, items) {
	
	$scope.results = items.list();
	console.log(items.list());
}]);
		
})();

