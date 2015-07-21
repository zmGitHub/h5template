angular.module('app')
    .controller('RoleCtrl', function($scope, $rootScope, $state, $log, $http, $timeout, roles, $state, toastr, $stateParams) {
        $scope.role = {}
        $scope.formTitle = '添加';
        // $log.log('roles',roles)
        var data = roles
        $scope.roleOptions = {
            columnDefs: roleCols,
            rowData: roles,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                // $log.log('ready');
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
                var roleId = $rootScope.$stateParams.roleId
                // $log.log('roleId:xx', roleId)
                if (roleId != undefined) {
                    angular.forEach(roles, function(row, index) {
                        if (row.id == roleId)
                            api.selectIndex(index, true, false)
                    })
                }
            },
            selectionChanged: function() {
                var rows = $scope.roleOptions.selectedRows;
                // $log.log('selectedRoles:', rows);
                if (rows.length > 0) {
                    $scope.role = rows[0];
                    $scope.formTitle = '编辑';
                    $state.go('main.roles.edit', {
                            roleId: $scope.role.id
                        })
                    // if ($state.current.name == 'main.roles.add') {
                    //     $log.log('coming.........')
                        
                    // }
                } else {
                    $scope.role = {};
                    $scope.formTitle = '添加';
                    $state.go('main.roles.add')
                }
            }
        };


        /*submit role */
        $scope.submit = function() {
            $log.log('submit:', $scope.role)
            if ($scope.role.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert role */
        $scope.insert = function() {
            $http.post('/api/roles', $scope.role)
                .success(function(resp, status, headers, config) {
                    $log.log('insert role :', resp)
                    if (resp == 'null')
                        toastr.error('null', '添加失败')
                    else if (resp.code != undefined)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.role = {};
                    }
                })
        }
        $scope.query = function() {
                $http.get('/api/roles')
                    .success(function(resp){
                        $scope.roleOptions.rowData = resp;
                        $scope.roleOptions.api.onNewRows();
                    }) 
            }
            /*update role */
        $scope.update = function() {
            $http.put('/api/roles', $scope.role)
                .success(function(resp, status, headers, config) {
                    $log.log('update role :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.roleOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete role */
        $scope.delete = function() {
            $http.delete('/api/roles/' + $scope.role.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete role :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }



        $scope.add = function() {
            $state.go('main.roles.add');
            $scope.roleOptions.api.deselectAll()
        }

        $scope.edit = function() {
            $state.go('main.roles.edit', {
                roleId: $scope.role.id
            });
        }

        $scope.rolePermissions = function() {
            $state.go('main.roles.permissions', {
                roleId: $scope.role.id
            });
        }
        $scope.roleResources = function() {
            $state.go('main.roles.resources', {
                roleId: $scope.role.id
            });
        }

    })
    .controller('RolePermissionCtrl', function(permissions, rolePermissions, roleId, $scope, $log, $http, $timeout, toastr) {

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
                selectArrayIndex(permissions, rolePermissions.data, api);
            },
            selectionChanged: function() {
                var rows = $scope.permissionOptions.selectedRows;
                $log.log('selectedPermissions:', rows);
            }
        };
        $scope.addPermissions = function() {
            var rows = $scope.permissionOptions.selectedRows;
            var permissionIds = [];
            angular.forEach(rows, function(row) {
                permissionIds.push(row.id)
            });
            $http.post('/api/authority/roles', {
                    roleId: roleId,
                    permissionIds: permissionIds
                })
                .success(function(resp, status, headers, config) {
                    $log.log('add to role :', resp)
                    if (resp.code != undefined)
                        toastr.error(resp.message, '添加失败')
                    else
                        toastr.success('添加成功');
                })
        }
    })
    .controller('RoleResourceCtrl', function(resources, roleResources, roleId, $scope, $log, $http, toastr) {
        var tree = arrayToAgGridTree(resources)
        $scope.resourceOptions = {
            columnDefs: resourceCols,
            rowData: tree,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'multiple',
            rowsAlreadyGrouped: true,
            groupSelectsChildren: true,
            ready: function(api) {
                api.sizeColumnsToFit();
                selectTreeIndex(tree[0], roleResources.data, api);
            },
            selectionChanged: function() {
                var rows = $scope.resourceOptions.selectedRows;
            }
        };
        $scope.addResources = function() {
            var rows = $scope.resourceOptions.selectedRows;
            var resourceIds = [];
            angular.forEach(rows, function(row) {
                // $log.log(row.name,row.id)
                resourceIds.push(row.id)
            });

            $http.post('/api/authority/roles', {
                    roleId: roleId,
                    resourceIds: resourceIds
                })
                .success(function(resp, status, headers, config) {
                    $log.log('add to role :', resp)
                    if (resp.code != undefined)
                        toastr.error(resp.message, '添加失败')
                    else
                        toastr.success('添加成功');
                })
        }
    })