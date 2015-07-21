angular.module('app')
    .controller('ResourceCtrl', function($scope,$timeout, $log, $http, toastr) {
        $scope.formTitle = '新建';
        $scope.resourceOptions = {
            columnDefs: resourceCols,
            rowData: [],
            rowsAlreadyGrouped: true,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function(){
                    api.sizeColumnsToFit();
                },500)
            },
            selectionChanged: function() {
                var rows = $scope.resourceOptions.selectedRows;
                $log.log('selectedResources:', rows)
                if (rows.length > 0) {
                    $scope.formTitle = '编辑'
                    $scope.resource = rows[0];
                    $scope.selectedResource = rows[0];
                } else {
                    $scope.formTitle = '新建'
                    $scope.resource = {};
                    $scope.selectedResource = {};
                }
            }

        };

        $scope.resource = {}
        $scope.add = function() {
            $scope.formTitle = '新建';
            $scope.resource = {
                pId: $scope.selectedResource.id
            };
        }

        $scope.edit = function() {
            $scope.formTitle = '编辑';
            $scope.resource = $scope.selectedResource;
        }

        /*submit resource */
        $scope.submit = function() {
            $log.log('submit:', $scope.resource)
            if ($scope.resource.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert resource */
        $scope.insert = function() {
            $http.post('/api/resources', $scope.resource)
                .success(function(resp, status, headers, config) {
                    $log.log('insert resource :', resp)
                    if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.resource = {};
                    }
                })
        }

        /*update resource */
        $scope.update = function() {
            $http.put('/api/resources', $scope.resource)
                .success(function(resp, status, headers, config) {
                    $log.log('update resource :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.resourceOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete resource */
        $scope.delete = function() {
                $http.delete('/api/resources/' + $scope.resource.id)
                    .success(function(resp, status, headers, config) {
                        $log.log('delete resource :', resp);
                        if (resp > 0) {
                            toastr.success('删除成功')
                            $scope.query();
                        } else
                            toastr.error('删除失败')
                    })
            }

        /*查询*/
        $scope.query = function() {
            $http.get("/api/resources")
                .success(function(resp) {
                    var data = arrayToAgGridTree(resp)
                    $scope.resourceOptions.rowData = data;
                    $scope.resourceOptions.api.onNewRows();
                    $scope.resourceOptions.api.expandAll()
                });
        }
        $scope.query();

        $scope.search = function() {
            $log.log('搜索：', $scope.resourceOptions.quickFilterText)
        }
    })