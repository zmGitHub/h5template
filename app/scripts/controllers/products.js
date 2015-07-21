angular.module('app')
    .controller('ProductCtrl', function($scope, $timeout, $log, $http, $mdDialog, toastr, products, samples, brands) {
        $scope.product = {}
        $scope.brands = brands.data
        $scope.samples = samples.data
        var columnDefs = [{
            field: 'name',
            headerName: '产品',
        }, {
            field: 'price',
            headerName: '价格',
        }, {
            field: 'unit',
            headerName: '个',
        }, {
            field: 'sampleName',
            headerName: '样本',
            filter: 'set',
        }, {
            field: 'brandName',
            headerName: '品牌',
            filter: 'set',
        }, {
            field: 'status',
            headerName: '状态',
            filter: 'number',
        }];

        $scope.productOptions = {
            columnDefs: columnDefs,
            rowData: products.data,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.productOptions.selectedRows;
                $log.log('selectedBrands:', rows);
                if (rows.length > 0) {
                    $scope.product = rows[0];
                    $scope.formTitle = '编辑';
                } else {
                    $scope.product = {};
                    $scope.formTitle = '添加';
                }
            }
        };


        /*submit product */
        $scope.submit = function() {
            $log.log('submit:', $scope.product)
            if ($scope.product.id == undefined)
                $scope.insert();
            else
                $scope.update();
        }

        /*insert product */
        $scope.insert = function() {
            $http.post('/api/products', $scope.product)
                .success(function(resp, status, headers, config) {
                    $log.log('insert product :', resp)
                    if (resp == 'null')
                        toastr.error('null', '添加失败')
                    else if (resp.code > 0)
                        toastr.error(resp.message, '添加失败')
                    else {
                        toastr.success('添加成功');
                        $scope.query();
                        $scope.product = {};
                    }
                })
        }

        /*update product */
        $scope.update = function() {
            $http.put('/api/products', $scope.product)
                .success(function(resp, status, headers, config) {
                    $log.log('update product :', resp);
                    if (resp.code != undefined)
                        toastr.error(resp.message, '修改失败')
                    else if (resp > 0) {
                        toastr.success('修改成功')
                        $scope.productOptions.api.refreshView();
                    } else
                        toastr.error('修改失败')
                })
        }

        /*delete product */
        $scope.delete = function() {
            $http.delete('/api/products/' + $scope.product.id)
                .success(function(resp, status, headers, config) {
                    $log.log('delete product :', resp);
                    if (resp > 0) {
                        toastr.success('删除成功')
                        $scope.query();
                    } else
                        toastr.error('删除失败')
                })
        }
        $scope.productStatus = 1
            /*query product */
        $scope.query = function() {
            $http.get("/api/products")
                .success(function(resp, status, headers, config) {
                    $scope.productOptions.rowData = resp;
                    $scope.productOptions.api.onNewRows();
                    $scope.filterProducts()
                })
        }

        $scope.$watch('productStatus', function(newValue, oldValue, scope) {
            $scope.filterProducts()
            $scope.productOptions.api.deselectAll()
        });

        $scope.filterProducts = function() {
            var filterApi = $scope.productOptions.api.getFilterApi('status');
            // var model = [];
            filterApi.setFilter($scope.productStatus);
            $scope.productOptions.api.onFilterChanged();

        }



    })
    .controller('ImportCtrl', function($scope, $timeout, $log, $http, toastr, Upload,samples,brands) {
        var sampleCols = [{
            field: 'name',
            headerName: '样本'
        }];

        $scope.sampleOptions = {
            columnDefs: sampleCols,
            rowData: samples,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.sampleOptions.selectedRows;
                $scope.sample = rows[0]
            }
        };

        var brandCols = [{
            field: 'name',
            headerName: '品牌'
        }];

        $scope.brandOptions = {
            columnDefs: brandCols,
            rowData: brands,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.brandOptions.selectedRows;
                $scope.brand = rows[0]
            }
        };

        //文件上传
        $scope.$watch('files', function() {
            $scope.upload($scope.files);
        });

        $scope.upload = function(files) {
            $scope.progressPer = -10;
            $scope.status = null;
            if (files && files.length) {
                $scope.showProgress = true
                var file = files[0];
                Upload.upload({
                    url: '/api/products/upload',
                    fields: {
                        brandId: $scope.brand.id,
                        sampleId: $scope.sample.id
                    },
                    file: file
                }).progress(function(evt) {
                    $scope.progressPer = parseInt(100.0 * evt.loaded / evt.total);
                    if ($scope.progressPer == 100) {
                        $scope.status = '文件上传成功，正在导入数据...'
                    }
                }).success(function(resp, status, headers, config) {
                    if (resp.code != undefined) {
                        if (resp.errors != undefined) {
                            angular.forEach(resp.errors, function(error) {
                                toastr.error(error.message, '数据导入')
                            })
                        } else {
                            toastr.error(resp.message, '数据导入出错')
                        }
                    } else {
                        toastr.success('Excel数据已成功导入', '导入产品');
                    }
                    $scope.status = null

                });
            }
        };
    })
    .controller('AgentCtrl', function($scope, $timeout, $log, $http, toastr, $mdDialog, $timeout, organs, brands, samples) {

        $scope.onChange = function(allSelected) {
            if (allSelected)
                $scope.productOptions.api.selectAll()
            else
                $scope.productOptions.api.deselectAll()
        }

        $scope.organOptions = {
            columnDefs: [{
                field: 'name',
                headerName: '公司',
                cellRenderer: {
                    renderer: 'group',
                    innerRenderer: innerCellRenderer
                }
            }],
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
                $scope.organ = rows[0]
                if (rows.length > 0) {
                    $scope.queryProducts();
                } else {
                    $scope.productOptions.rowData = [];
                    $scope.productOptions.api.onNewRows();
                }
            }

        };

        var columnDefs = [{
            field: 'name',
            headerName: '产品',
            width: 150,
            cellRenderer: {
                checkbox: true,
                renderer: 'group',
            }
        }, {
            field: 'price',
            headerName: '价格',
            width: 80
        }, {
            field: 'unit',
            headerName: '个',
            width: 50
        }, {
            field: 'sampleName',
            headerName: '样本',
            width: 80,
            filter: 'set',
        }, {
            field: 'brandName',
            headerName: '品牌',
            width: 80,
            filter: 'set',
        }, {
            field: 'status',
            headerName: '状态',
            width: 100,
            filter: 'number',
        }];

        $scope.productOptions = {
            columnDefs: columnDefs,
            rowData: [],
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'multiple',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.productOptions.selectedRows;
                var ids = []
                angular.forEach(rows, function(row) {
                    ids.push(row.id)
                })

                $scope.productIds = ids
            }
        };

        $scope.queryProducts = function() {
            $http.get('/api/products/organs/noagent?organId=' + $scope.organ.id)
                .then(function(resp) {
                    $log.log(resp)
                    $scope.productOptions.rowData = resp.data;
                    $scope.productOptions.api.onNewRows();
                    fillAggrid($timeout, $scope.productOptions.api)
                })
        }


        $scope.dialog = function($event) {
            $mdDialog.show({
                    controller: 'ProductDialogCtrl',
                    templateUrl: '/views/products/product.dialog.html',
                    resolve: {
                        productIds: function() {
                            return $scope.productIds
                        },
                        brands: function() {
                            return brands
                        },
                        samples: function() {
                            return samples
                        }
                    },
                    parent: angular.element(document.body),
                    targetEvent: $event,
                })
                .then(function(resp) {
                    $log.log('dialog:', resp);
                    if (resp == 'success') {
                        $scope.productStatus = 3
                    }

                });
        };
    })
    .controller('ProductDialogCtrl', function($scope, $timeout, $log,$mdDialog, $http, toastr, $timeout, productIds, brands, samples) {
        var sampleCols = [{
            field: 'name',
            headerName: '样本'
        }];

        $scope.sampleOptions = {
            columnDefs: sampleCols,
            rowData: samples,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.sampleOptions.selectedRows;

            }
        };

        var brandCols = [{
            field: 'name',
            headerName: '品牌'
        }];

        $scope.brandOptions = {
            columnDefs: brandCols,
            rowData: brands,
            rowDeselection: true,
            enableFilter: true,
            rowSelection: 'single',
            ready: function(api) {
                $timeout(function() {
                    api.sizeColumnsToFit();
                }, 500)
            },
            selectionChanged: function() {
                var rows = $scope.brandOptions.selectedRows;

            }
        };

        $scope.agent = function() {
            var data = {
                ids:productIds,
                brandId:$scope.brandOptions.selectedRows[0].id,
                sampleId:$scope.sampleOptions.selectedRows[0].id,
            }
            $log.log('data:',data)
            $http.post('/api/products/agent',data)
            .success(function(resp){

            })
        }

        $scope.close = function() {
            $mdDialog.cancel();
        };
    })