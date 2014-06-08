'use strict';

angular.module('myApp', [])
	.config(function ($routeProvider) {
		$routeProvider
            .when('/home', {
                templateUrl: 'views/home.html'
            }).when('/contact', {
				templateUrl: '../views/contact/list.html',
				controller: 'ListCtrl'
			}).when('/addContact', {
				templateUrl: '../views/contact/edit.html',
				controller: 'EditCtrl'
			}).when('/contact/edit/:contactId', {
				templateUrl: '../views/contact/edit.html',
				controller: 'EditCtrl'
			}).otherwise({
				redirectTo: '/home'
			});

	});

var protocol = 'http';
var domain = '127.0.0.1';
var port = '3000';
var context = '';
var apiDocs = '/api-docs';

var baseUrl = protocol + '://' + domain + (port ? (':' + port) : '');
var documentationUrl = context + apiDocs + "/contact";

angular.module('myApp').value('baseUrl', baseUrl);
angular.module('myApp').value('documentationUrl', documentationUrl);
