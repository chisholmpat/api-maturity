var module = angular.module('directives', []);

// Directive for ensuring that two passewords match
module.directive('pwdMatch', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var me = $parse(attrs.ngModel);
            var matchTo = $parse(attrs.pwdMatch);

            scope.$watchGroup([me, matchTo], function(newValues,oldValues){
                ctrl.$setValidity('matched', me(scope) === matchTo(scope) );
            }, true);
        }
    }
});

module.directive('uniqueValue', function($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope,
            element, attrs, ngModel) {
            element.bind('blur', function(e) {
                console.log("Blurring!");
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
