'use strict';

angular.module('myApp').service('PhoneService', function ($http, $q, UrlService) {

	var PhoneService = {};

	var resourceUrl;
	var docUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the contacts API documention URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.phoneAPI.then(function (url) {
		docUrl = url.replace("api", "api-docs");
	});

	// When the documentation is received, getting the contacts resource URL and a promise to know when it's loaded.
	docUrlReceived.then(function () {
		resourceUrlReceived = $http.get(docUrl).success(function (response) {
			resourceUrl = response.basePath + "/api" + response.resourcePath;
		});
	});

	// Wrapper de fonction permettant de vérifier que l'URL de l'interface REST a bien été résolue avant de l'utiliser.
	// Function wrapper verifying URL is availble before any API call.
	var safeCall = function (functionToCall) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			var deferred = $q.defer();

			// When the doc URL is available.
			docUrlReceived.then(function () {
				// When the resource URL is available.
				resourceUrlReceived.then(function () {
					deferred.resolve(functionToCall.apply(this, args));
				});
			});

			return deferred.promise;
		};
	};

    PhoneService.list = safeCall(function () {
		return $http.get(resourceUrl);
	});

    PhoneService.get = safeCall(function (id) {
        return $http.get(resourceUrl + '/' + id);
	});

    PhoneService.add = safeCall(function (data) {
		return $http.post(resourceUrl, JSON.stringify(data));
	});

    PhoneService.update = safeCall(function (data) {
		return $http.put(resourceUrl + '?id=' + data._id, JSON.stringify(data));
	});

    PhoneService.delete = safeCall(function (data) {
        return $http.delete(resourceUrl + '?id=' + data._id);
    });

    return PhoneService;

});