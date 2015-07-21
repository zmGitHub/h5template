'use strict';

/**
 * @ngdoc service
 * @name app.Users
 * @description
 * # Users
 * Service in the app.
 */
angular.module('app')
  .service('User', function ($resource) {
  	return $resource('/api/users');
  })
  .service('Role', function($resource){
  	return $resource('/api/roles');
  })
  .service('Permission', function($resource){
  	return $resource('/api/permissions');
  })
  .service('Resource', function($resource){
  	return $resource('/api/resources');
  })
  .service('Region', function($resource){
    return $resource('/api/regions');
  })
  .service('Organ', function($resource){
    return $resource('/api/organs');
  })
    .service('Brand', function($resource){
    return $resource('/api/brands');
  })
     .service('Sample', function($resource){
    return $resource('/api/samples');
  })
  .service('Category', function($resource){
    return $resource('/api/categories');
  })