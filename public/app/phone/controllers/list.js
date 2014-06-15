'use strict';

angular.module('myApp').controller('PhoneListController', function ($scope, $location, PhoneService) {

	$scope.dataSource = [];


	$scope.add = function () {
		$location.path('/phone/new');
	};

	$scope.edit = function (data) {
		$location.path('/phone/edit/' + data._id);
	};

    $scope.delete = function (data) {
        PhoneService.delete(data).then(function () {
                $scope.refresh();
            }
        );
    };

    $scope.refresh = function () {
		$scope.dataReceived = false;
		var httpPromise = PhoneService.list();
		httpPromise.then(function(httpResponse) {
			$scope.dataSource = httpResponse.data;
			$scope.dataReceived = true;
		});
	};

	$scope.refresh();

});