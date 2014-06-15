'use strict';

angular.module('myApp', [])
	.config(function ($routeProvider) {
		$routeProvider
            .when('/home', {
                templateUrl: '/app/home/index.html'
            }).when('/contact', {
				templateUrl: '/app/contact/views/list.html',
				controller: 'ContactListController'
			}).when('/contact/new', {
				templateUrl: '/app/contact/views/edit.html',
				controller: 'ContactEditController'
			}).when('/contact/edit/:id', {
				templateUrl: '/app/contact/views/edit.html',
				controller: 'ContactEditController'
			}).when('/phone', {
                templateUrl: '/app/phone/views/list.html',
                controller: 'PhoneListController'
            }).when('/phone/new', {
                templateUrl: '/app/phone/views/edit.html',
                controller: 'PhoneEditController'
            }).when('/phone/edit/:id', {
                templateUrl: '/app/phone/views/edit.html',
                controller: 'PhoneEditController'
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
var documentationUrl = context + apiDocs;

angular.module('myApp').value('baseUrl', baseUrl);
angular.module('myApp').value('documentationUrl', documentationUrl);

function HeaderController($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) != -1;
    };
}
