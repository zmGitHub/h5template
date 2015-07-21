angular.module('app')
    .controller('ProjectCtrl', function($scope, $timeout, $log, $http, toastr, regions,users) {
        $scope.project = {}
        $scope.formTitle = '添加';
        $scope.locked = true
        var columnDefs = [{
            field: 'name',
            headerName: '名称',
        }, {
            field: '',
            headerName: '审核人',
        }, {
            field: 'createTime',
            headerName: '创建时间',
        }];

        $scope.projectOptions = {
            columnDefs: columnDefs,
            rowData: [],
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.projectOptions.selectedRows;
                $log.log('selectedProjects:', rows);
                if (rows.length > 0) {
                    $scope.project = rows[0];
                    $scope.formTitle = '编辑';
                } else {
                    $scope.project = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit project */
        $scope.submit = function() {
            $log.log('submit:', $scope.project)
            if ($scope.project.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert project */
        $scope.insert = function() {
            $http.post('/api/projects', $scope.project)
                .success(function(resp, status, headers, config) {
                    $log.log('insert project :', resp)
                    if (resp == 'null')
                        toastr.error('null', '添加失败')
                    else if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.project = {};
                    }
                })
        }

        /*update project */
        $scope.update = function() {
            $http.put('/api/projects', $scope.project)
                .success(function(resp, status, headers, config) {
                    $log.log('update project :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.projectOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete project */
        $scope.delete = function() {
            $http.delete('/api/projects/' + $scope.project.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete project :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*query project */
        $scope.query = function() {
            $http.get('/api/projects')
                .success(function(resp, status, headers, config) {
                    $log.log('query project :', resp)
                    $scope.projectOptions.rowData = resp;
                    $scope.projectOptions.api.onNewRows();
                })
        }

        $scope.query();

        $scope.selectRegion = function() {
            $scope.selectedIndex = 1
        }

        $scope.selectUser = function() {
            $scope.locked = false
            $scope.selectedIndex = 2
        }
        $scope.$watch('selectedIndex',function(index){
            if(index!=2)
                $scope.locked = true
        })

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
                $scope.project.address.region = rows[0]
                $scope.selectedIndex = 0
            }

        };

        var columnDefs = [{
            field: 'name',
            headerName: '姓名'
        }];

        $scope.userOptions = {
            columnDefs: columnDefs,
            rowData: users.data,
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
                if (rows.length > 0) {
                    
                } else {
 
                }
            }
        };
    })
    .controller('AllotCtrl', function($scope, $timeout, $log, $http, toastr, regions) {
        $scope.project = {}
        $scope.formTitle = '添加';
        var columnDefs = [{
            field: 'name',
            headerName: '名称',
        }, {
            field: '',
            headerName: '审核人',
        }, {
            field: 'createTime',
            headerName: '创建时间',
        }];

        $scope.projectOptions = {
            columnDefs: columnDefs,
            rowData: [],
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.projectOptions.selectedRows;
                $log.log('selectedProjects:', rows);
                if (rows.length > 0) {
                    $scope.project = rows[0];
                    $scope.formTitle = '编辑';
                } else {
                    $scope.project = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit project */
        $scope.submit = function() {
            $log.log('submit:', $scope.project)
                $scope.update();
        }



        /*update project */
        $scope.update = function() {
            $http.put('/api/projects', $scope.project)
                .success(function(resp, status, headers, config) {
                    $log.log('update project :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.projectOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*query project */
        $scope.query = function() {
            $http.get('/api/projects')
                .success(function(resp, status, headers, config) {
                    $log.log('query project :', resp)
                    $scope.projectOptions.rowData = resp;
                    $scope.projectOptions.api.onNewRows();
                })
        }

        $scope.query();

        $scope.selectUser = function() {
            $scope.selectedIndex = 2
        }


        
    })