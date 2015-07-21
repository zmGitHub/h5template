'use strict';

angular.module('app')
	.controller('ProfileCtrl', function($scope, $log, $http, $timeout, toastr, users, regions, organs, resources) {
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
				if (params.data === "" || params.data === undefined || params.data === null)
					return null;
				return params.data.organ.name;
			},
			headerName: '公司'
		}, {
			valueGetter: function(params) {
				if (params.data === "" || params.data === undefined || params.data === null)
					return null;
				return params.data.contact.address.region.name;
			},
			headerGroup: '地址',
			headerName: '地区'
		}, {
			valueGetter: function(params) {
				if (params.data === "" || params.data === undefined || params.data === null)
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
				if (rows.length > 0) {
					$scope.user = rows[0];
					$scope.formTitle = '编辑';
					// if ($state.current.name == 'main.roles.add') {
					//     $log.log('coming.........')

					// }
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

		// $scope.query()

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
			$log.log('update user:',$scope.user)
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
		$scope.organOptions = {
			columnDefs: organCols,
			rowData: arrayToAgGridTree(organs),
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
				$scope.user.organId=rows[0].id
				$scope.selectedIndex = 0
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
				$scope.user.contact.address.regionId = rows[0].id
				$scope.selectedIndex = 0
			}

		};
	})
