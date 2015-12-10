(function(){

var module = angular.module('resultsModule', ['questionnaireServiceModule']);

module.controller('ResultsController', ['$scope', 'items', function($scope, items) {

	$scope.list = items.list;
	console.log(items.list());
	
}]);

})();
