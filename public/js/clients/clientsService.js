(function() {
    // Service supporting client database operations.
    var module = angular.module('clientsServiceModule', ['ngResource']);
    module.service('ClientsStore', ['$http', '$resource',
        function($http, $resource) {
            this.formsConn = $resource('/forms');
            this.getClientsConn = $resource('/clients');
            this.addClientConn = $resource('/insertClient');
            this.updateClientsConn = $resource('/updateClient');
            this.getUserEmailsConn = $resource('/getAllUserEmails');
            this.addUserToClient = $resource('/addUserToClient/:client_id/:user_email');
            this.deleteClientConn = $resource('/deleteClient');
            this.getAllCliendIDsAndEmailsConn = $resource('/getAllCliendIDsAndEmails');
            this.allClientsOwnedByUserConn = $resource('/getAllClientsOwnedByUser');
            this.allClientInfoOwnedByUserConn = $resource('/clientDetailsOwnedByUser');
            this.getAllAssessmentsConn = $resource('/assessments/:category_id');
        }
    ]);
})();
