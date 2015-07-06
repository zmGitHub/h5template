'use strict';
angular
  .module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
  	'ngMaterial',
    'toastr',
    'ngFileUpload',
    'ui.router',
    'FBAngular',
    'angularGrid'
  ])
  .constant('eidtName','编辑')
  .constant('plusName','添加')
  .constant('delName','删除')
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
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
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
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('responseInterceptor')
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('users', {
        url: '/users/index',
        templateUrl: 'views/users/users.html',
        controller: 'UserCtrl'
      })
      .state('roles', {
        url: '/roles/index',
        templateUrl: 'views/users/roles.html',
        controller: 'RoleCtrl'
      })
      .state('permissions', {
        url: '/permissions/index',
        templateUrl: 'views/users/permissions.html',
        controller: 'PermissionCtrl'
      })
      .state('regions', {
        url: '/regions/index',
        templateUrl: '/regions/index',
        controller: 'RegionCtrl'
      }).state('categories', {
        url: '/categories/index',
        templateUrl: '/categories/index',
        controller: 'CategoryCtrl'
      })
      .state('samples', {
        url: '/samples/index',
        templateUrl: '/samples/index',
        controller: 'SampleCtrl'
      })
      .state('brands', {
        url: '/brands/index',
        templateUrl: '/brands/index',
        controller: 'BrandCtrl'
      })
      .state('products', {
        url: '/products/index',
        templateUrl: '/products/index',
        controller: 'ProductCtrl'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'public/test/index.html',
        controller: 'TestCtrl'
      })
      .state('projects', {
        url: '/projects/create',
        templateUrl: '/projects/create',
        controller: 'ProjectCtrl'
      })
      .state('audit', {
        url: '/projects/audit',
        templateUrl: '/projects/audit',
        controller: 'AuditCtrl'
      })
      .state('assign', {
        url: '/projects/assign',
        templateUrl: '/projects/assign',
        controller: 'AssignCtrl'
      })
      .state('drawings', {
        url: '/projects/drawings',
        templateUrl: '/projects/drawings',
        controller: 'DrawingCtrl'
      })
      .state('dc', {
        url: '/projects/categories',
        templateUrl: '/projects/categories',
        controller: 'DrawingCategoryCtrl'
      })
      .state('bills', {
        abtract: true,
        url: '/projects/bills',
        templateUrl: '/projects/bills',
        controller: 'BillCtrl'
      })
      // .state("bills.dc", {
      //  url: "/dc",
      //  templateUrl: "dc.html",
      //  controller:'BDcCtrl'
      // })
      // .state("bills.list", {
      //  url: "/list",
      //  templateUrl: "list.html"
      // })
    $urlRouterProvider.otherwise('/');
  })
  .controller('AppCtrl', function ($scope,Fullscreen, $log, $http) {
    $scope.isFull = false
    $scope.fullscreen = function () {
          if (Fullscreen.isEnabled()){
            Fullscreen.cancel();
            $scope.isFull = false;
          }
          else{
            Fullscreen.all();
            $scope.isFull = true;
          }

       }
    $log.log('AppCtrl')
    $http.get('/api/categories');
  })