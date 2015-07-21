angular.module('app')
    .controller('RegionCtrl', function($scope, $timeout, $log, $state, $http, regions, toastr) {
        $scope.formTitle = '新建';
        $scope.regionOptions = {
            columnDefs: regionCols,
            rowData: arrayToAgGridTree(regions),
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
                $log.log('selectedRegions:', rows)
                if (rows.length > 0) {
                    $scope.formTitle = '编辑'
                    $scope.region = rows[0];
                    $scope.selectedRegion = rows[0];
                } else {
                    $scope.formTitle = '新建'
                    $scope.region = {};
                    $scope.selectedRegion = {};
                }
            }

        };

        $scope.region = {}
        $scope.add = function() {
            $scope.formTitle = '新建';
            $scope.region = {
                pId: $scope.selectedRegion.id
            };
        }

        $scope.edit = function() {
            $scope.formTitle = '编辑';
            $scope.region = $scope.selectedRegion;
        }

        /*submit region */
        $scope.submit = function() {
            $log.log('submit:', $scope.region)
            if ($scope.region.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert region */
        $scope.insert = function() {
            $http.post('/api/regions', $scope.region)
                .success(function(resp, status, headers, config) {
                    $log.log('insert region :', resp)
                    if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.region = {};
                    }
                })
        }

        /*update region */
        $scope.update = function() {
            $http.put('/api/regions', $scope.region)
                .success(function(resp, status, headers, config) {
                    $log.log('update region :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.regionOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete region */
        $scope.delete = function() {
            $http.delete('/api/regions/' + $scope.region.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete region :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*查询*/
        $scope.query = function() {
                $http.get("/api/regions")
                    .success(function(resp) {
                        var data = arrayToAgGridTree(resp)
                        $scope.regionOptions.rowData = data;
                        $scope.regionOptions.api.onNewRows();
                        $scope.regionOptions.api.expandAll()
                    });
                // $state.reload()
            }
            // $scope.query();

        $scope.search = function() {
            $log.log('搜索：', $scope.regionOptions.quickFilterText)
        }
    })