angular.module('app')
    .controller('CategoryCtrl', function($scope, $timeout, $log, $http, toastr) {
        $scope.category = {}
        $scope.hasData = false;
        $scope.selectedRow = null;

        var rowData = [];
        var columnDefs = [{
            headerName: '产品分类',
            field: 'name',
            // width: 250,
            cellRenderer: {
                renderer: 'group',
                checkbox: true,
                innerRenderer: innerCellRenderer
            }
        }];

        $scope.categoryOptions = {
            columnDefs: columnDefs,
            rowData: rowData,
            rowSelection: 'single',
            rowsAlreadyGrouped: true,
            enableColResize: true,
            enableSorting: true,
            // rowHeight: 20,
            // icons: {
            //     groupExpanded: '<i class='fa fa-minus-square-o'/>',
            //     groupContracted: '<i class='fa fa-plus-square-o'/>'
            // },
            rowClicked: rowClicked,
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();

                },500)
            },
            selectionChanged: function() {
                var rows = $scope.categoryOptions.selectedRows;
                $log.log('selectionChanged category:', rows)
                if (rows.length > 0) {
                    $scope.formTitle = '编辑';
                    $scope.editType = 'edit'
                } else {
                    $scope.formTitle = null;
                    $scope.category = {}
                    $scope.selectedRow = null;
                }
            },
            rowSelected: function(row) {
                $log.log('rowSelected category:', row);
                $scope.selectedRow = row
                $scope.category = row;
            }
        };

        function rowClicked(params) {
            var node = params.node;
            var path = node.data.name;
            while (node.parent) {
                node = node.parent;
                path = node.data.name + '\\' + path;
            }
            $scope.selectedFile = path;
        }

        $scope.add = function() {
            $scope.formTitle = '新建';
            $scope.category = {
                pId: $scope.category.id
            };
            // $scope.categoryOptions.api.deselectAll();
        }

        $scope.edit = function() {
            $scope.formTitle = '编辑'
            $scope.editType = 'edit';
            $scope.category = $scope.selectedRow;
        }

        /*submit category */
        $scope.submit = function() {
            $log.log('submit:', $scope.category)
            if ($scope.category.id == undefined || $scope.category.id == 0)
                $scope.insert();
            else if ($scope.category.id > 0)
                $scope.update();
        }

        /*insert category */
        $scope.insert = function() {
            $http.post('/api/categories', $scope.category)
                .success(function(resp, status, headers, config) {
                    $log.log('insert category :', resp)
                    if (resp == 'null')
                        toastr.error('添加失败')
                    else if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.selectedRow = null;
                        $scope.category = null;
                        $scope.query();
                    }
                })
        }

        /*update category */
        $scope.update = function() {
            $http.put('/api/categories', $scope.category)
                .success(function(resp, status, headers, config) {
                    $log.log('update category :', resp);
                    if (resp.code > 0)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.categoryOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete category */
        $scope.delete = function() {
            $http.delete('/api/categories/' + $scope.selectedRow.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete category :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                        $scope.category = null;
                        $scope.selectedRow = null;
                    } else
                        toastr.error('删除失败')
                })
        }

        /*query category */
        $scope.query = function() {
            $http.get('/api/categories')
                .success(function(resp, status, headers, config) {
                    $log.log('query category :', resp)
                    if (resp.length > 0) {
                        $scope.hasData = true;
                    } else {

                        $scope.hasData = false;
                        $scope.formTitle = '添加一个根类';
                        $scope.editType = 'add';
                    }
                    var data = arrayToAgGridTree(resp)
                    $scope.categoryOptions.rowData = data;
                    $scope.categoryOptions.api.onNewRows();
                })
        }

        $scope.query()
    })