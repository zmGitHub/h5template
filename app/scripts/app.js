'use strict';
angular
	.module('app', [
		'ngAnimate',
		'ngResource',
		'ngMaterial',
		'toastr',
		'ngFileUpload',
		'ui.router',
		'FBAngular',
		'timer',
		'angularGrid'
	])
	.factory('authInterceptor', function($location, $q) {
		return {
			request: function(config) {
				config.headers = config.headers || {};
				if (localStorage.auth_token) {
					config.headers.token = localStorage.auth_token;
				}
				return config;
			},
			responseError: function(response) {
				if (response.status === 401) {
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	})
	.factory('responseInterceptor', function($q, $location, $log) {
		return {
			responseError: function(resp, status, headers, config) { //请求错误时调用
				console.log('response:', resp);
				if (resp.status === 401) {
					// $location.path('/login')
				} else if (resp.status === 404) {
					console.log('404 error')
				} else if (resp.status === 302) {
					$log.log(headers)
					$location.href = headers.Location
				};
				return $q.reject(resp);
			}
		};
	})
	.run(function($rootScope, $state, $stateParams) {

		// It's very handy to add references to $state and $stateParams to the $rootScope
		// so that you can access them from any scope within your applications.For example,
		// <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
		// to active whenever 'contacts.list' or one of its decendents is active.
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	})
	.controller('AppCtrl', function($scope, Fullscreen, $log, $http) {
		$scope.fullscreenClass = 'fullscreen';
		$scope.fullscreen = function() {
				if (Fullscreen.isEnabled()) {
					Fullscreen.cancel();
					$scope.fullscreenClass = 'fullscreen';
				} else {
					Fullscreen.all();
					$scope.fullscreenClass = 'fullscreen_exit';
				}

			}
			// $log.log('AppCtrl')
			// $http.get('/api/categories');

		$scope.toggleNav = function() {

		}

		//监听表格选中行
		$scope.$on('selectedrows', function(e, rows) {
			$scope.showToolbar = rows.length > 0 ? true : false;
			//向子类发送选中行指令

		})
	})