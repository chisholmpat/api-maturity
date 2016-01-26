var module = angular.module('userDirectives', []);
module.directive('uniqueUsername', function($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope,
            element, attrs, ngModel) {
            element.bind('blur', function(e) {
                ngModel.$setValidity('unique', true);
                console.log(attrs);
                console.log(attrs.url);
                $http.get(attrs.url + element.val()).success(function(data) {
                    console.log(data);
                    if (data) {
                        console.log(ngModel.$valid);
                        ngModel.$setValidity('unique', false);
                        console.log(ngModel.$valid);
                    }
                });
            });
        }
    };
})
