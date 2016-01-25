var module = angular.module('userDirectives', []);
module.directive('uniqueUsername',
    function($http) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope,
                element, attrs, ngModel) {
                element.bind('blur', function(e) {
                    ngModel.$setValidity('unique',
                        true);
                    $http.get("/checkUnique/" + element.val()).success(function(data) {
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
