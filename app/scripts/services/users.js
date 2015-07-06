'use strict';

/**
 * @ngdoc service
 * @name app.Users
 * @description
 * # Users
 * Service in the app.
 */
angular.module('app')
  .service('Users', function ($resource) {
  	var rows = [{
				name:'Young',
				email:'ohoh.co@qq.com'
			},{
				name:'Young',
				email:'ohoh.co@qq.com'
			},{
				name:'Young',
				email:'ohoh.co@qq.com'
			},]
  	$resource.query = rows
  	return $resource('/api/users');
  });
