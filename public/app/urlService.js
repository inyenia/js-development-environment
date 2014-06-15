'use strict';

angular.module('myApp').service('UrlService', function (baseUrl, documentationUrl, $http) {
	var UrlService = {};

	var apiDoc = $http.get(baseUrl + documentationUrl);

	var getApi = function (apiDocumentation, description) {
		var api;
		if (apiDocumentation !== undefined) {
			api = _.findWhere(apiDocumentation.apis, { path: description });
		}
		return api ? baseUrl + "/api" + api.path : undefined;
	};

	UrlService.carrierAPI = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, '/carrier');
	});

    UrlService.contactAPI = apiDoc.then(function (apiDocumentation) {
        return getApi(apiDocumentation.data, '/contact');
    });

    UrlService.manufacturerAPI = apiDoc.then(function (apiDocumentation) {
        return getApi(apiDocumentation.data, '/manufacturer');
    });

    UrlService.phoneAPI = apiDoc.then(function (apiDocumentation) {
        return getApi(apiDocumentation.data, '/phone');
    });

	return UrlService;

});
