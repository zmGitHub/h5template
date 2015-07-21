angular.module('app')
    .controller('PermissionCtrl', function($scope,$timeout, $log, $http,toastr) {
        $scope.permission = {}
        $scope.formTitle = '添加';
        var columnDefs = [{
            field: 'name',
            headerName: '名称',
        },{
            field: 'alias',
            headerName: '别名',
        }];

        $scope.permissionOptions = {
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
                var rows = $scope.permissionOptions.selectedRows;
                $log.log('selectedPermissions:', rows);
                if(rows.length>0) {
                    $scope.permission = rows[0];
                    $scope.formTitle = '编辑';
                }else{
                    $scope.permission = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit permission */
        $scope.submit = function() {
            $log.log('submit:', $scope.permission)
            if ($scope.permission.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert permission */
        $scope.insert = function() {
            $http.post('/api/permissions', $scope.permission)
                .success(function(resp, status, headers, config) {
                    $log.log('insert permission :', resp)
                    if (resp == 'null')
                        toastr.error('null','添加失败')
                    else if (resp.code > 0)
                        toastr.error( resp.message,'添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.permission = {};
                    }
                })
        }

        /*update permission */
        $scope.update = function() {
            $http.put('/api/permissions', $scope.permission)
                .success(function(resp, status, headers, config) {
                    $log.log('update permission :', resp);
                    if (resp.code!=undefined)
                        toastr.error(resp.message,'修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.permissionOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete permission */
        $scope.delete = function() {
            $http.delete('/api/permissions/'+$scope.permission.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete permission :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*query permission */
        $scope.query = function() {
            $http.get('/api/permissions')
                .success(function(resp, status, headers, config) {
                    $log.log('query permission :', resp)
                    $scope.permissionOptions.rowData = resp;
                    $scope.permissionOptions.api.onNewRows();
                })
        }

         $scope.query();
    })