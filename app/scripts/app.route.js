  'use strict';

  angular
    .module('app')
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('main', {
          url: '',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          resolve: {
            resources: function(Resource) {
              return Resource.query().$promise;
            },
            users: function($resource) {
              return $resource('/api/users/profile').query().$promise;
            },
          }
        })
        .state('signin', {
          url: '/signin',
          templateUrl: 'views/signin.html',
          controller: 'SigninCtrl'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: 'views/signup.html',
          controller: 'SignupCtrl'
        })
        .state('main.users', {
          url: '/users/index',
          templateUrl: 'views/users/users.html',
          controller: 'UserCtrl',
          resolve: {
            users: function(User) {
              return User.query().$promise;
            },
            roles: function(Role) {
              return Role.query().$promise;
            },
            permissions: function(Permission) {
              return Permission.query().$promise;
            },
            resources: function(Resource) {
              return Resource.query().$promise;
            },
            organs: function(Organ) {
              return Organ.query().$promise;
            },
            regions: function(Region) {
              return Region.query().$promise;
            }
          }
        })
        .state('main.profile', {
          url: '/users/profile',
          templateUrl: 'views/users/profile.html',
          controller: 'UserCtrl',
          resolve: {
            users: function($resource) {
              return $resource('/api/users/profile').query().$promise;
            },
            organs: function(Organ) {
              return Organ.query().$promise;
            },
            regions: function(Region) {
              return Region.query().$promise;
            },
            roles: function() {
              return []
            },
            permissions: function() {
              return []
            },
            resources: function() {
              return []
            }
          }
        })
        .state('main.roles', {
          abtract: true,
          url: '/roles',
          templateUrl: 'views/users/roles.html',
          controller: 'RoleCtrl',
          resolve: {
            roles: function(Role) {
              return Role.query().$promise;
            }
          },
          onEnter: function() {
            // console.log("enter roles.html");
          }
        })
        .state('main.roles.add', {
          url: '/add',
          templateUrl: 'views/users/roles-edit.html',
        })
        .state('main.roles.edit', {
          url: '/edit/:roleId',
          templateUrl: 'views/users/roles-edit.html',
        })
        .state('main.roles.permissions', {
          url: '/permissions/:roleId',
          templateUrl: 'views/users/roles-permissions.html',
          controller: 'RolePermissionCtrl',
          resolve: {
            roleId: function($stateParams) {
              return $stateParams.roleId;
            },
            permissions: function(Permission) {
              return Permission.query().$promise;
            },
            rolePermissions: function($http, $stateParams) {
              return $http.get('/api/permissions/roles/' + $stateParams.roleId);
            }
          }
        })
        .state('main.roles.resources', {
          url: '/resources/:roleId',
          templateUrl: 'views/users/roles-resources.html',
          controller: 'RoleResourceCtrl',
          resolve: {
            roleId: function($stateParams) {
              return $stateParams.roleId;
            },
            resources: function(Resource) {
              return Resource.query().$promise;
            },
            roleResources: function($http, $stateParams) {
              return $http.get('/api/resources/roles/' + $stateParams.roleId);
            }
          }
        })
        .state('main.permissions', {
          url: '/permissions/index',
          templateUrl: 'views/users/permissions.html',
          controller: 'PermissionCtrl'
        }).state('main.resources', {
          url: '/resources/index',
          templateUrl: 'views/users/resources.html',
          controller: 'ResourceCtrl'
        })
        .state('main.regions', {
          url: '/regions/index',
          templateUrl: 'views/regions.html',
          controller: 'RegionCtrl',
          resolve: {
            regions: function(Region) {
              return Region.query().$promise;
            }
          }
        }).state('main.organs', {
          url: '/organs/index',
          templateUrl: 'views/organs.html',
          controller: 'OrganCtrl',
          resolve: {
            organs: function(Organ) {
              return Organ.query().$promise;
            },
            regions: function(Region) {
              return Region.query().$promise;
            }
          }
        }).state('main.categories', {
          url: '/categories/index',
          templateUrl: 'views/products/categories.html',
          controller: 'CategoryCtrl',
          resolve: {
            categories: function(Category) {
              return Category.query().$promise;
            }
          }
        })
        .state('main.samples', {
          url: '/samples/index',
          templateUrl: '/views/products/samples.html',
          controller: 'SampleCtrl',
          resolve: {
            categories: function(Category) {
              return Category.query().$promise;
            }
          }
        })
        .state('main.brands', {
          url: '/brands/index',
          templateUrl: '/views/products/brands.html',
          controller: 'BrandCtrl'
        })
        .state('main.products', {
          url: '/products/index',
          templateUrl: '/views/products/products.html',
          controller: 'ProductCtrl',
          resolve: {
            products: function($http) {
              return $http.get("/api/products")
            },
            samples: function($http) {
              return $http.get("/api/samples")
            },
            brands: function($http) {
              return $http.get("/api/brands")
            }
          }
        })
        .state('main.agent', {
          url: '/agent',
          templateUrl: '/views/products/product.agent.html',
          controller: 'AgentCtrl',
          resolve: {
            list: function(Organ) {
              return Organ.query().$promise;
            },
            organs: function(list) {
              var organs = []
              angular.forEach(list, function(organ) {
                if (organ.flag == 1 || organ.id == 1)
                  organs.push(organ)
              })
              return organs
            },
            brands: function(Brand) {
              return Brand.query().$promise;
            },
            samples: function(Sample) {
              return Sample.query().$promise;
            },
          }
        })
        .state('main.import', {
          url: '/import',
          templateUrl: '/views/products/product.import.html',
          controller: 'ImportCtrl',
          resolve: {
            brands: function(Brand) {
              return Brand.query().$promise;
            },
            samples: function(Sample) {
              return Sample.query().$promise;
            },
          }
        })
        .state('main.test', {
          url: '/test',
          templateUrl: 'public/test/index.html',
          controller: 'TestCtrl'
        })
        .state('main.projects', {
          url: '/projects/create',
          templateUrl: '/views/projects/create.html',
          controller: 'ProjectCtrl',
          resolve: {
            regions: function(Region) {
              return Region.query().$promise;
            },
            users: function($http) {
              return $http.get('/api/users/organs');
            },
          }
        })
        .state('main.allot', {
          url: '/projects/allot',
          templateUrl: '/views/projects/allot.html',
          controller: 'AllotCtrl',
          resolve: {
            regions: function(Region) {
              return Region.query().$promise;
            },
            users: function($http) {
              return $http.get('/api/users/organs');
            },
          }
        })
        .state('main.audit', {
          url: '/projects/audit',
          templateUrl: '/projects/audit',
          controller: 'AuditCtrl'
        })
        .state('main.assign', {
          url: '/projects/assign',
          templateUrl: '/projects/assign',
          controller: 'AssignCtrl'
        })
        .state('main.drawings', {
          url: '/projects/drawings',
          templateUrl: '/projects/drawings',
          controller: 'DrawingCtrl'
        })
        .state('main.dc', {
          url: '/projects/categories',
          templateUrl: '/projects/categories',
          controller: 'DrawingCategoryCtrl'
        })
        .state('main.bills', {
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