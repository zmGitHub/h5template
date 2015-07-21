'use strict';
var roleCols = [{
	field: 'name',
	headerName: '角色',
	filter: 'set',
	cellRenderer: {
		renderer: 'group',
		checkbox: true,
	}
}, {
	field: 'alias',
	headerName: '别名',
	filter: 'set',
}];
var resourceCols = [{
	field: 'name',
	headerName: '资源',
	cellRenderer: {
		renderer: 'group',
		checkbox: true,
		innerRenderer: innerCellRenderer
	}
}, {
	field: 'url',
	headerName: '链接'
}, {
	field: 'description',
	headerName: '描述'
}];
var regionCols = [{
	field: 'name',
	headerName: '行政区域',
	cellRenderer: {
		renderer: 'group',
		checkbox: true,
		innerRenderer: innerCellRenderer
	}
}];
var organCols = [{
	field: 'name',
	headerName: '公司',
	cellRenderer: {
		renderer: 'group',
		checkbox: true,
		innerRenderer: innerCellRenderer
	}
}];

function fillAggrid($timeout, api) {
	$timeout(function() {
		api.sizeColumnsToFit();
	}, 500)
}

function innerCellRenderer(params) {
	if (params.value === "" || params.value === undefined || params.value === null)
		return null;
	return params.data.name;
}

// function navs(more,less) {
// 	var map={},parents=[]

// 	for (var i = 0; i < more.length; i++) {
// 		map[more[i].id] = more[i]
// 	};

// 	for (var i = 0; i < less.length; i++) {
// 		var item = less[i]
// 		getParents(map,item.pId,parents)
// 	};
// 	console.log('parents:::',parents)
// 	return less.concat(parents)
// }

// function getParents(map,pId,parents) {
// 	var parent = map[pId]
// 	var b= false
// 	for (var i = 0; i < parents.length; i++) {

// 		if(!b&& parents[i].id ==parent.id){
// 			b = true
// 			break
// 		}

			
// 	};
// 	if(!b)
// 		parents.push(parent)
// 	else{
// 		// console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
// 	}
// 	// console.log('p',pId,':::',parent)
// 	if(parent.pId!=undefined && parent.pId!=0)
// 		getParents(map,parent.pId,parents)

// 	return parents
// }


function arrayToTree(arr) {
	var map = {},root

	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];
		item.children = []
		map[item.id] = i;

	};

	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];
		var pId = item.pId
		console.log('p',pId,':::',arr[map[pId]])
		if (pId != undefined && pId != 0){
			arr[map[pId]].children.push(item)
		}
		else
			root = item
	};
	return root;
}

function arrayToAgGridTree(nodes) {
	var map = {},
		node, roots = [];
	for (var i = 0; i < nodes.length; i++) {
		node = {
			data: nodes[i],
			children: [],
			group: false,
			expanded: false
		};

		map[node.data.id] = i; // use map to look-up the parents

		var pId = node.data.pId
		nodes[i] = node;
		if (pId != undefined && pId != 0) {
			nodes[map[pId]].children.push(node);

			nodes[map[pId]].group = true
			nodes[map[pId]].expanded = true
		} else {

			roots.push(node);
		}
	}
	return roots
}

function selectArrayIndex(more, less, api) {
	for (var i = 0; i < more.length; i++) {
		var obj = more[i];
		for (var j = 0; j < less.length; j++) {
			var o = less[j];
			// console.log(obj, o)
			if (obj.id == o.id) {
				// more[i].checked = true;
				api.selectIndex(i, true, true)
				break;
			}
		};
	};
}

function selectTreeIndex(tree, arr, api) {
	// console.log('tree:', tree)
	for (var i = 0; i < arr.length; i++) {
		// console.log(arr[i], '|||', tree.data.id)
		if (arr[i] != undefined && arr[i] != null && arr[i].id == tree.data.id) {
			// console.log('yes yes')
			api.selectNode(tree, true, true);
			break;
		}

	};
	var children = tree.children;
	if (children != undefined && children.length > 0) {
		for (var i = 0; i < children.length; i++) {
			tree = children[i];
			selectTreeIndex(tree, arr, api)
		};
	}
}