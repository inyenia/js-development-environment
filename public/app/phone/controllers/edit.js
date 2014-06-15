'use strict';

angular.module('myApp').controller('PhoneEditController', function ($scope, $routeParams, $location, PhoneService) {
	$scope.data = {};
	$scope.dataReceived = false;

	if($routeParams.id) {
		PhoneService.get($routeParams.id).then(function (httpResponse) {
			$scope.data = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

    $scope.save = function () {
        if($location.path() === '/phone/new') {
            PhoneService.add($scope.data).then(function () {
                $location.path('/phone');
            });
        } else {
            PhoneService.update($scope.data).then(function () {
                    $location.path('/phone');
                }
            );
        }
    };

	$scope.cancel = function () {
		$location.path('/phone');
	};

});
