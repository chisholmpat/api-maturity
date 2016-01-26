var module = angular.module('passwordDirectives', []);
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
})
