angular.module('app')
    .controller('OrganCtrl', function($scope, $timeout, $log, $state, $http, organs, regions, toastr) {
        $scope.formTitle = '新建';
        $scope.organ = {
            contact: {
                address: {
                    region: {}
                }
            }
        }
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
                $log.log('selectedOrgans:', rows)
                if (rows.length > 0) {
                    $scope.formTitle = '编辑'
                    $scope.organ = rows[0];
                    $scope.selectedOrgan = rows[0];

                    $log.log('regionTree',regionTree)
                    $log.log('xxx',[{id:rows[0].contact.address.regionId}])
                    selectTreeIndex(regionTree[0], [{id:rows[0].contact.address.regionId}],  $scope.regionOptions.api);
                } else {
                    $scope.formTitle = '新建'
                    $scope.organ = {
                        contact: {
                            address: {
                                region: {}
                            }
                        }
                    };
                    $scope.selectedOrgan = {
                        contact: {
                            address: {
                                region: {}
                            }
                        }
                    };
                }
            }

        };

        $scope.add = function() {
            $scope.formTitle = '新建';
            $scope.organ = {
                pId: $scope.selectedOrgan.id,
                contact: {
                    address: {
                        region: {}
                    }
                }
            };
        }

        $scope.edit = function() {
            $scope.formTitle = '编辑';
            $scope.organ = $scope.selectedOrgan;
        }

        /*submit organ */
        $scope.submit = function() {
            $log.log('submit:', $scope.organ)
            if ($scope.organ.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert organ */
        $scope.insert = function() {
            $http.post('/api/organs', $scope.organ)
                .success(function(resp, status, headers, config) {
                    $log.log('insert organ :', resp)
                    if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.organ = {
                            contact: {
                                address: {
                                    region: {}
                                }
                            }
                        };
                    }
                })
        }

        /*update organ */
        $scope.update = function() {
            $http.put('/api/organs', $scope.organ)
                .success(function(resp, status, headers, config) {
                    $log.log('update organ :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.organOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete organ */
        $scope.delete = function() {
            $http.delete('/api/organs/' + $scope.organ.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete organ :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }

        /*查询*/
        $scope.query = function() {
                $http.get("/api/organs")
                    .success(function(resp) {
                        var data = arrayToAgGridTree(resp)
                        $scope.organOptions.rowData = data;
                        $scope.organOptions.api.onNewRows();
                        $scope.organOptions.api.expandAll()
                    });
                // $state.reload()
            }
            // $scope.query();

        $scope.selectRegion = function() {
            $log.log('xxxxxxxxxxxxxxxxxxxx')
            $scope.selectedIndex = 1
        }

        $scope.search = function() {
            $log.log('搜索：', $scope.organOptions.quickFilterText)
        }


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
                    api.sizeColumnsToFit();
                // $timeout(function() {
                // }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.regionOptions.selectedRows;
                $log.log('selectedRegions:', $scope.organ)
                if (rows.length > 0) {
                    $scope.organ.contact.address.region = rows[0]
                    $scope.organ.contact.address.regionId = rows[0].id
                } else {
                    $scope.organ.contact.address.region= {}
                }
            }

        };
    })