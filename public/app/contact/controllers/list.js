'use strict';

angular.module('myApp').controller('ListCtrl', function ($scope, $location, ContactService) {

	$scope.contacts = [];


	$scope.addContact = function () {
		$location.path('/addContact');
	};

	$scope.edit = function (contact) {
		$location.path('/contact/edit/' + contact._id);
	};

	$scope.refresh = function () {
		$scope.dataReceived = false;
		var httpPromise = ContactService.getContactList();
		httpPromise.then(function(httpResponse) {
			$scope.contacts = httpResponse.data;
			$scope.dataReceived = true;
		});
	};

	$scope.refresh();

});