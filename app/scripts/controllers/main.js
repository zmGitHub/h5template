'use strict';

angular.module('app')
	.controller('MainCtrl', function($scope, $http, $mdSidenav, $mdUtil, $log, resources, users) {
		// var arr = navs(resources,users[0].resources)
		// $log.log('arr：',arr)
		$scope.resources = arrayToTree(resources).children
		// $log.log($scope.resources)
	})