var util = require("util");

function flat2tree(pathes){
	
	setProperty = function(object,path,value){
		path = path.split(".");
		current = object;
		path.forEach(function(item, index){
				current[item] = (index == path.length-1) ? value : current[item] || {};
				current = current[item];
		});
	}
	result = {};
	pathes.forEach(function(item){
		setProperty(result,item.path,item.value)
	});
	return result;
} 

function tree2flat(tree){
	var result = [];
	var getTaskList = function(node){
		result.push(node);
		if(node.children){
			for(child in node.children){
				getTaskList(node.children[child])
			} 
		}
	}	
	getTaskList(tree);
	result.forEach(function(item){
		delete item.children;
	})
	return result;
} 



var index;

var makeParams = function (node){
	if(!node) return
	node.index = index++;
	node.id = node.id.split(".children.").join(".");
	if(!node.children){
		node.taskCount = 1;
		node.childs = [];
		if(node.end){
		}else{
			node.isOpen = true;
		}	
		return
	}
	for(child in node.children) makeParams(node.children[child]);
	node.taskCount = 1;
	node.childs = [];
	node.isOpen = false;
	var isOpenInterval = false;
	var childPoints = [];
	for(child in node.children){
		childPoints.push(node.children[child].start)
		if(!node.children[child].isOpen){
			childPoints.push(node.children[child].end)
		} 
		node.taskCount += node.children[child].taskCount;
		node.childs = node.childs.concat(node.children[child].childs.map(function(item){return item}))
		node.childs.push(node.children[child].index);
		node.isOpen  |= (node.children[child].isOpen == true);
	}

	node.childs.sort(function(a,b){return a-b})
	childPoints.sort(function(a,b){return a-b})
	node.start = childPoints[0];//node.serie[0].x;
	if(!node.isOpen) node.end = childPoints[childPoints.length-1]//node.serie[node.serie.length-1].x;
}

var makeSeries = function(node, xmin , xmax){

	if(node.children){
		for(child in node.children){
			node.children[child].parents = node.parents.map(function(item){return item});
			node.children[child].parents.push(node.index);
		}
	}
	
	if(node.children){
		for(child in node.children){
			makeSeries(node.children[child],xmin,xmax);
		}
	}
}


var parseSerie = function(str){
	return str.split(",")
		.map(function(item){
			var point = item.trim()
							.split(":")
							.map(function(p){
								return p.trim()
							})
			// return {x:new Number(point[0]),y:new Number(point[1]),marker:point[2]}		
			return {x:point[0]*1,y:point[1]*1,marker:point[2]}			
		})
}

var parseCauses = function(taskList,task){
	return task.causes.split(",")
			.map(function(item){
				var rec = item.split(":")
						.map(function (v){return v.trim()})
				
				// var ti = new Number(taskList.filter(function(t){return t.id == rec[1]})[0].index)		
				var ti = taskList.filter(function(t){return t.id == rec[1]})[0].index		

				// return {type:rec[3], src:{x:new Number(rec[0]),  "task":ti, type:rec[3]}, target:{x:new Number(rec[2]),"task":new Number(task.index),type:rec[3]}}
				return {type:rec[3], src:{x:rec[0]*1,  "task":ti*1, type:rec[3]}, target:{x:rec[2]*1,"task":task.index*1,type:rec[3]}}
			})
}

exports.createSerie = 
	function(data,title,note,timeDomain){
		data = data.map(function(item){
			item.id = item.id.split(".").join(".children.");
			return item;
		})

		data.forEach(function(item,index){
			item.timeDomain = timeDomain; 
			if(item.income){
				item.incomeStr = item.income 
				item.income = parseSerie(item.income,index)
			}
			if(item.expenditure){
				item.expenditureStr = item.expenditure 
				item.expenditure = parseSerie(item.expenditure, index)
			}	
		})
		

		var taskTree;

		var tree = flat2tree(data.map(function(item){return {path:item.id, value:item}}))
		var c = 0;
		for(var i in tree){
			c++;
		}

		if(c==1){
			for(var i in tree){
				taskTree = tree[i];
				break; 
			}
		} else {
			taskTree = {
				id: "root",
				"timeDomain" : timeDomain, 
				"title": title,
				"note": note,
				children :flat2tree(data.map(function(item){return {path:item.id, value:item}}))
			} 		
		}

		index = 0;

		makeParams(taskTree);
		taskTree.parents = [];
		makeSeries(taskTree,timeDomain[0],timeDomain[1]);
		taskTree = tree2flat(taskTree);
		
		taskTree.forEach(function(item, ind){
			if(item.causes){
				item.causes = parseCauses(taskTree,item)
			}
			if(item.expenditure){
				// if(item.expenditure[0].x > item.timeDomain[0]){
				// 	item.expenditure = [{x:item.timeDomain[0], y:item.expenditure[0].y}].concat(item.expenditure)
				// }
				// if(item.expenditure[item.expenditure.length-1].x < item.timeDomain[1]){
				// 	item.expenditure.push({x:item.timeDomain[1], y:item.expenditure[item.expenditure.length-1].y})
				// }
				item.expenditure.forEach(function(p){p.index = ind; p.type="expenditure"})
			}
			if(item.income){
				// if(item.income[0].x > item.timeDomain[0]){
				// 	item.income = [{x:item.timeDomain[0], y:item.income[0].y}].concat(item.income)
				// }
				// if(item.income[item.income.length-1].x < item.timeDomain[1]){
				// 	item.income.push({x:item.timeDomain[1], y:item.income[item.income.length-1].y})
				// }
				item.income.forEach(function(p){p.index = ind; p.type="income"})
		
			}
		})
		return taskTree;
	}
