angular.module('app')
    .controller('BrandCtrl', function($scope,$timeout, $log, $http,toastr) {
        $scope.brand = {}
        $scope.formTitle = '添加';
        var columnDefs = [{
            field: 'name',
            headerName: '名称',
        },{
            field: 'alias',
            headerName: '别名',
        }];

        $scope.brandOptions = {
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
                var rows = $scope.brandOptions.selectedRows;
                $log.log('selectedBrands:', rows);
                if(rows.length>0) {
                    $scope.brand = rows[0];
                    $scope.formTitle = '编辑';
                }else{
                    $scope.brand = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit brand */
        $scope.submit = function() {
            $log.log('submit:', $scope.brand)
            if ($scope.brand.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert brand */
        $scope.insert = function() {
            $http.post('/api/brands', $scope.brand)
                .success(function(resp, status, headers, config) {
                    $log.log('insert brand :', resp)
                    if (resp == 'null')
                        toastr.error('null','添加失败')
                    else if (resp.code > 0)
                        toastr.error( resp.message,'添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.brand = {};
                    }
                })
        }

        /*update brand */
        $scope.update = function() {
            $http.put('/api/brands', $scope.brand)
                .success(function(resp, status, headers, config) {
                    $log.log('update brand :', resp);
                    if (resp.code!=undefined)
                        toastr.error(resp.message,'修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.brandOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete brand */
        $scope.delete = function() {
            $http.delete('/api/brands/'+$scope.brand.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete brand :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*query brand */
        $scope.query = function() {
            $http.get('/api/brands')
                .success(function(resp, status, headers, config) {
                    $log.log('query brand :', resp)
                    $scope.brandOptions.rowData = resp;
                    $scope.brandOptions.api.onNewRows();
                })
        }

         $scope.query();
    })