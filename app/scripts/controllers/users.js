'use strict';

angular.module('app')
	.controller('UserCtrl', function($scope, $log, $http, $timeout, toastr, users, roles, permissions, regions, organs, resources) {
		var columnDefs = [{
			field: 'name',
			headerName: '姓名'
		}, {
			field: 'email',
			headerName: '邮箱'
		}, {
			field: 'mobile',
			headerName: '手机'
		}, {
			valueGetter: function(params) {
				if (params.data.organ=== "" || params.data.organ === undefined || params.data.organ === null)
					return null;
				return params.data.organ.name;
			},
			headerName: '公司'
		}, {
			valueGetter: function(params) {
				if (params.data.contact.address.region === "" || params.data.contact.address.region === undefined || params.data.contact.address.region === null)
					return null;
				return params.data.contact.address.region.name;
			},
			headerGroup: '地址',
			headerName: '地区'
		}, {
			valueGetter: function(params) {
				if (params.data.contact.address.address === "" || params.data.contact.address.address === undefined || params.data.contact.address.address === null)
					return null;
				return params.data.contact.address.address;
			},
			headerGroup: '地址',
			headerName: '街道地址'
		}, ];

		$scope.formTitle = '添加';
		$scope.user = {
			contact: {
				address: {
					region: {}
				}
			}
		}
		$scope.userOptions = {
			columnDefs: columnDefs,
			rowData: users,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'single',
			// groupHeaders: true,
			ready: function(api) {
				$timeout(function() {
					api.sizeColumnsToFit();
				}, 500)
			},
			// angularCompileFilters: true,
			// rowSelection: 'multiple',
			// suppressRowClickSelection : true,
			selectionChanged: function() {
				var rows = $scope.userOptions.selectedRows;
				$log.log('selectedUserRows:', rows)
					// $scope.$emit('userSelectionChanged', rows); //向父类通知

				// $scope.roleOptions.api.deselectAll()
				// $scope.organOptions.api.deselectAll()
				// $scope.regionOptions.api.deselectAll()

				if (rows.length > 0) {
					$scope.user = rows[0];
					$scope.formTitle = '编辑';

					$scope.selectGridIndex()
					
				} else {
					$scope.user = {
						contact: {
							address: {
								region: {}
							}
						}
					}
					$scope.formTitle = '添加';

					
				}
			}
		};

		$scope.query = function() {
			$http.get('/api/users')
				.success(function(resp) {
					$scope.userOptions.rowData = resp;
					$scope.userOptions.api.onNewRows();
				})
		}


		$scope.selectGridIndex = function() {
			var user = $scope.userOptions.selectedRows[0];
			if(user ==undefined)
				return
			switch($scope.selectedIndex) {
				case 1:
					selectArrayIndex($scope.roleOptions.rowData, user.roles, $scope.roleOptions.api);
				break;
				case 2:
					selectTreeIndex(organTree[0], [user.organ], $scope.organOptions.api)
				break;
				case 3:
					selectTreeIndex(regionTree[0], [user.contact.address.region], $scope.regionOptions.api)
				break;
			}
		}

		$scope.$watch('selectedIndex',function(index){
			$scope.selectGridIndex(index)
		})

		/*submit user */
		$scope.submit = function() {
			$log.log('submit:', $scope.user)
			if ($scope.user.id == undefined)
				$scope.insert();
			else
				$scope.update();
		}

		/*insert user */
		$scope.insert = function() {
			$http.post('/api/users', $scope.user)
				.success(function(resp, status, headers, config) {
					$log.log('insert user :', resp)
					if (resp.code != undefined)
						toastr.error(resp.message, '添加失败')
					else {
						toastr.success('添加成功');
						$scope.query();
						$scope.user = {};
					}
				})
		}

		/*update user */
		$scope.update = function() {
			$http.put('/api/users', $scope.user)
				.success(function(resp, status, headers, config) {
					$log.log('update user :', resp)
					if (resp.code != undefined || resp<1)
						toastr.error(resp.message, '更新失败')
					else {
						toastr.success('更新成功');
						$scope.userOptions.api.refreshView();
					}
				})
		}


		$scope.selectRegion = function() {
			$scope.selectedIndex = 5
		}
		$scope.selectOrgan = function() {
			$scope.selectedIndex = 4
		}

		$scope.add = function() {
			$scope.userOptions.api.deselectAll()
		}



		//////////////
		///Roles
		//////////////
		$scope.roleOptions = {
			columnDefs: roleCols,
			rowData: roles,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'multiple',
			ready: function(api) {
				$timeout(function() {
						api.sizeColumnsToFit();
					}, 500)
					// selectArrayIndex(Role.data, RoleRole.data, api);
			},
			selectionChanged: function() {
				var rows = $scope.roleOptions.selectedRows;
				$log.log('selectedRoles:', rows);
			}
		};
		$scope.addRoles = function() {
			var rows = $scope.roleOptions.selectedRows;
			var roleIds = [];
			angular.forEach(rows, function(row) {
				roleIds.push(row.id)
			});
			$http.post('/api/users/roles', {
					userId: $scope.user.id,
					roleIds: roleIds
				})
				.success(function(resp, status, headers, config) {
					$log.log('add to role :', resp)
					if (resp == 'success')
						toastr.success('添加成功');
					else if (resp.code != undefined)
						toastr.error(resp.message, '添加失败')
				})
		}

		//////////////
		///Permissions
		//////////////
		$scope.permissionOptions = {
			columnDefs: roleCols,
			rowData: permissions,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'multiple',
			ready: function(api) {
				$timeout(function() {
						api.sizeColumnsToFit();
					}, 500)
					// selectArrayIndex(permissions, rolePermissions.data, api);
			},
			selectionChanged: function() {
				var rows = $scope.permissionOptions.selectedRows;
				$log.log('selectedPermissions:', rows);
			}
		};

		//////////////
		///Resources
		//////////////
		$scope.resourceOptions = {
			columnDefs: resourceCols,
			rowData: arrayToAgGridTree(resources),
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'multiple',
			rowsAlreadyGrouped: true,
			groupSelectsChildren: true,
			ready: function(api) {
				api.sizeColumnsToFit();
				// selectTreeIndex(tree[0], roleResources.data, api);
			},
			selectionChanged: function() {
				var rows = $scope.resourceOptions.selectedRows;
				$log.log('selectedResources:', rows);
			}
		};


		///////////
		//organ
		//////////
		var organCols = [{
			field: 'name',
			headerName: '公司',
			cellRenderer: {
				renderer: 'group',
				innerRenderer: innerCellRenderer
			}
		}];

		var organTree= arrayToAgGridTree(organs)
		$scope.organOptions = {
			columnDefs: organCols,
			rowData: organTree,
			rowsAlreadyGrouped: true,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'single',
			ready: function(api) {
				$timeout(function() {
					api.sizeColumnsToFit();
				}, 500)
			},
			selectionChanged: function() {
				var rows = $scope.organOptions.selectedRows;
				$scope.user.organ = rows[0]
				$log.log('selectionChanged organ:',rows[0])
				if (rows.length>0) 
					$scope.user.organId=rows[0].id
				else
					$scope.user.organId=undefined
				
			}

		};



		var regionCols = [{
			field: 'name',
			headerName: '行政区域',
			cellRenderer: {
				renderer: 'group',
				innerRenderer: innerCellRenderer
			}
		}];

		var regionTree = arrayToAgGridTree(regions)
		$scope.regionOptions = {
			columnDefs: regionCols,
			rowData: regionTree,
			rowsAlreadyGrouped: true,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'single',
			ready: function(api) {
				$timeout(function() {
					api.sizeColumnsToFit();
				}, 500)
			},
			selectionChanged: function() {
				var rows = $scope.regionOptions.selectedRows;
				$scope.user.contact.address.region = rows[0]
				$log.log('selectionChanged region:',rows[0])
				if (rows.length>0)
					$scope.user.contact.address.regionId = rows[0].id
				else
					$scope.user.contact.address.regionId = undefined
			}

		};
	})
	.controller('SignupCtrl', function($scope, $log, $http, toastr) {
		$scope.showCountdown = false;
		$scope.btnText = '获取验证码';
		$scope.d = false
		$scope.getCode = function() {
			$scope.btnText = '正在获取验证码...';
			$scope.d = true
			$http.get('/api/users/code?email=' + $scope.user.email)
				.success(function(resp) {
					if (resp.code != undefined)
						toastr.error(resp.message, '获取验证码')
					else {
						$scope.showCountdown = true;
						$scope.countdown = resp
						$scope.$broadcast('timer-set-countdown', resp);
					}
					$scope.d = false
				})
		}
		$scope.$on('timer-stopped', function() {
			$log.log('stoped')
			$scope.showCountdown = false;
			$scope.btnText = '获取验证码';
		});

		$scope.submit = function() {
			$http.put('/api/users/signup', $scope.user)
				.success(function(resp) {
					if (resp.code != undefined)
						toastr.error(resp.message, '用户注册')
					else {
						$log.log('注册成功')
					}
				})
		}
	})
	.controller('SigninCtrl', function($scope, $log, toastr, $http) {
		$scope.captchaUrl = "/api/captcha/next";
		$scope.nextCaptcha = function() {
			$scope.captchaUrl = "/api/captcha/next?_=" + new Date().getTime();
		}

		$scope.submit = function() {
			$http.post('/api/users/signin', $scope.user)
				.success(function(resp, status, headers, config) {
					if (resp.code != undefined)
						toastr.error(resp.message, '登录失败')
					else
						toastr.success('登录成功')
				})
		}
	})