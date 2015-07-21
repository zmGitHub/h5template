angular.module('app')
    .controller('SampleCtrl', function($scope,$timeout, $log, $http,toastr,categories) {
        $scope.selectedSample = null;
        $scope.sample = {}

        var columnDefs = [{
            field: 'name',
            headerName: '样本',
        }];

        $scope.sampleOptions = {
            columnDefs: columnDefs,
            rowData: [],
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function(){
                    api.sizeColumnsToFit();
                },500)
            },
            selectionChanged: function() {
                var rows = $scope.sampleOptions.selectedRows;
                $log.log('selectedBrands:', rows);
                if(rows.length>0) {
                    $scope.sample = rows[0];
                    $scope.formTitle = '编辑';
                }else{
                    $scope.sample = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit sample */
        $scope.submit = function() {
            $scope.sample.categoryId =  $scope.category.id
            $log.log('submit:', $scope.sample)
            if ($scope.sample.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert sample */
        $scope.insert = function() {
            $http.post('/api/samples', $scope.sample)
                .success(function(resp, status, headers, config) {
                    $log.log('insert sample :', resp)
                    if (resp == 'null')
                        toastr.error('null','添加失败')
                    else if (resp.code > 0)
                        toastr.error( resp.message,'添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.sample = {};
                    }
                })
        }

        /*update sample */
        $scope.update = function() {
            $http.put('/api/samples', $scope.sample)
                .success(function(resp, status, headers, config) {
                    $log.log('update sample :', resp);
                    if (resp.code!=undefined)
                        toastr.error(resp.message,'修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.sampleOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete sample */
        $scope.delete = function() {
            $http.delete('/api/samples/'+$scope.sample.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete sample :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*query sample */
        $scope.query = function() {
            $http.get("/api/samples?categoryId=" + $scope.category.id)
                .success(function(resp, status, headers, config) {
                    $log.log('query sample :', resp)
                    if (resp.length > 0) {
                        $scope.hasData = true;
                    } else {
                        $scope.hasData = false;
                        $scope.formTitle = '添加';
                        $scope.editType = 'add';
                    }
                    $scope.sampleOptions.rowData = resp;
                    $scope.sampleOptions.api.onNewRows();
                })
        }


        var categoryCols = [{
            field: 'name',
            headerName: '产品分类',
            cellRenderer: {
                renderer: 'group',
                innerRenderer: innerCellRenderer
            }
        }];

        $scope.categoryOptions = {
            columnDefs: categoryCols,
            rowData: arrayToAgGridTree(categories),
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
                var rows = $scope.categoryOptions.selectedRows;
                $scope.category = rows[0];
                if(rows.length>0) {
                    $scope.query()
                }else{
                    $scope.sampleOptions.rowData = [];
                    $scope.sampleOptions.api.onNewRows();
                }
            }
        };

    })