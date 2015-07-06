'use strict';

angular.module('app')
  .controller('UserCtrl', function ($scope,$log, Users) {
    $scope.data = {
      selectedIndex: 0,
      secondLocked:  true,
      secondLabel:   "Item Two",
      bottom:        false
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

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
				if (params.value === "" || params.value === undefined || params.value === null)
					return null;
				return params.data.organ.name;
			},
			headerName: '公司'
		}, {
			valueGetter: function(params) {
				if (params.value === "" || params.value === undefined || params.value === null)
					return null;
				return params.data.organ.region.name;
			},
			headerGroup:'地址',
			headerName: '地区'
		}, {
			valueGetter: function(params) {
				if (params.value === "" || params.value === undefined || params.value === null)
					return null;
				return params.data.contact.address.address;
			},
			headerGroup:'地址',
			headerName: '街道地址'
		}, ];
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
		$scope.gridOptions = {
			columnDefs: columnDefs,
			rowData: rows,
			rowDeselection: true,
			enableFilter: true,
			rowSelection: 'single',
			groupHeaders: true,
			ready: function(api) {
				api.sizeColumnsToFit();
			},
			// angularCompileFilters: true,
			// rowSelection: 'multiple',
			// suppressRowClickSelection : true,
			selectionChanged: function() {
				var rows = $scope.gridOptions.selectedRows;
				$log.log('selectedrows:', rows)
				// $scope.$emit('userSelectionChanged', rows); //向父类通知
			},
			rowSelected: function(row) {
				$log.log('row:', row)
			}
		};

		$scope.query = function() {
			$log.log(Users.query())
			
			$scope.gridOptions.rowData = rows;
            $scope.gridOptions.api.onNewRows();
		}

		// $scope.query()
    
  });
