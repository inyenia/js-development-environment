'use strict';

angular.module('myApp').controller('ContactEditController', function ($scope, $routeParams, $location, ContactService) {
	$scope.data = {};
	$scope.dataReceived = false;

	if($routeParams.id) {
		ContactService.get($routeParams.id).then(function (httpResponse) {
			$scope.data = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

    $scope.save = function () {
        if($location.path() === '/contact/new') {
            ContactService.add($scope.data).then(function () {
                $location.path('/contact');
            });
        } else {
            ContactService.update($scope.data).then(function () {
                    $location.path('/contact');
                }
            );
        }
    };

	$scope.cancel = function () {
		$location.path('/contact');
	};

});
