( function() {
var module = angular.module('userServiceModule', ['ngResource']);
    module.service('UserStore', ['$http', '$resource', function($http, $resource) {
        this.addUser = $resource('/add_user');
        this.userLogin = $resource('/userLogin');
        this.getUsers = $resource('/users');
        this.updateUser = $resource('/update_user');
        this.getUserRoles = $resource('/roles');
        this.checkToken = $resource('/checkToken/:token');
        this.updatePassword = $resource('/updatepassword');
		this.sendPasswordEmail = $resource('/forgot', {}, { method: 'get', isArray:true});
    }]);
})();
