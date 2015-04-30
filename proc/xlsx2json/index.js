var XLSX = require('xlsx');
var XLS = require('xlsjs');

var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


var getDimIDs = function(def,dimensionLabel){
	var indexes = def[dimensionLabel].category.index;
	var result = [];
	for(var f in indexes){
		result[indexes[f]] = f;
	}
	return result;
}

exports.getJSONSTAT = function(str) {
	var result = [];
	try {
		var json = JSON.parse(str);

		for(val in json) {
			var dims = json[val]['dimension']['id'];
			indexes = [];
			dims.forEach(function(id){
				indexes.push({id:id,index:getDimIDs(json[val]['dimension'],id)});
			})
			
			var data = json[val]['value'];
			var result = [];

			var getDataValue = function(current){
		
				var q = data.filter(function(item){
					var result = true;
					current.forEach(function(ci,index){
						result &= item['#'+indexes[index].id] == indexes[index].index[ci];
					})
					return result;
				})

				 return (q.length == 0) ? null : q[0]['#value'];    
			}
			
			var forEachIndexes = function (level,size,current){
			    if(size.length == current.length){
			        result.push(getDataValue(current));
			        return;
			    }
			    var currentValue = 0;
			    while (currentValue < size[level]){
			        current.push(currentValue);
			        forEachIndexes(level+1,size,current);
			        current.pop();
			        currentValue++;
			    }
			}

			forEachIndexes(0,json[val]['dimension']['size'] ,[]);

			json[val]['value'] = result;
			return JSON.stringify(json);}
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(10);}
	return null;
}

exports.toJSONSTAT = function(obj) {
	return exports.getJSONSTAT(exports.toJSON(obj));
}
exports.toJSON = function(obj) {
	var result = {};
	try{
		result[obj['name']] = {};
		for(val in obj['metadata']) {
			result[obj['name']][val] = obj['metadata'][val];}
		result[obj['name']]['value'] = obj['value'];
		return JSON.stringify(result);
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(11);}
	return null;
}
exports.getOBJECT = function(str) {
	var result = {};
	try {
		var json = JSON.parse(str);
		for(obj in json) {
			result = {};
			result['name'] = obj;
			result['metadata'] = {};
			result['value'] = [];
			for(val in json[obj]) {
				if (val == 'value') { result['value'] = json[obj][val];}
				else { result['metadata'][val] = json[obj][val];}}
			return result;}
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(12);}
	return null;
}
exports.toJSONSTAT = function(obj) {
	return exports.getJSONSTAT(exports.toJSON(obj));
}
exports.toJSON = function(obj) {
	var result = {};
	try{
		result[obj['name']] = {};
		for(val in obj['metadata']) {
			result[obj['name']][val] = obj['metadata'][val];}
		result[obj['name']]['value'] = obj['value'];
		return JSON.stringify(result);
	} catch(e) {
		console.log(e);}
	return null;
}
exports.getOBJECT = function(str) {
	var result = {};
	try {
		var json = JSON.parse(str);
		for(obj in json) {
			result = {};
			result['name'] = obj;
			result['metadata'] = {};
			result['value'] = [];
			for(val in json[obj]) {
				if (val == 'value') { result['value'] = json[obj][val];}
				else { result['metadata'][val] = json[obj][val];}}
			return result;}
	} catch(e) {
		console.log(e);}
	return null;
}
exports.readJSONSTAT = function(filename) {
	exports.getJSONSTAT(exports.readJSON(filename));
}
exports.readJSON = function(filename) {
	console.time(filename);
	var workbook, worksheet, datasheet;
	try {
		var name = filename.split('.');
		if (name[name.length - 1] == 'xlsx')
			workbook = XLSX.readFile(filename);
		else workbook = XLS.readFile(filename);
		var datasheet = workbook.Sheets['data'];
		var worksheet = workbook.Sheets['metadata'];
		if (datasheet == null || worksheet == null) {
			process.stderr.write("Can't read sheets from file!");
			process.exit(13);
			return null;}
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(14);
		return null;}
	var result = {};
	try {
		var dataset_name = GetValue(worksheet, 'dataset');
		result[dataset_name] = {};
		result[dataset_name]['note'] = GetValue(worksheet, 'dataset.note');
		result[dataset_name]['label'] = GetValue(worksheet, 'dataset.label');
		result[dataset_name]['updated'] = GetValue(worksheet, 'dataset.updated');
		result[dataset_name]['status'] = GetValue(worksheet, 'dataset.status');
		result[dataset_name]['source'] = GetValue(worksheet, 'dataset.source');
		result[dataset_name]['dimension'] = {};
		result[dataset_name]['dimension']['id'] = GetArray(worksheet, 'dimension.id');
		result[dataset_name]['dimension']['role'] = {};
		result[dataset_name]['dimension']['role']['geo'] = GetValue(worksheet, 'role.geo');
		result[dataset_name]['dimension']['role']['time'] = GetValue(worksheet, 'role.time');
		result[dataset_name]['dimension']['role']['metric'] = GetValue(worksheet, 'role.metric');
		result[dataset_name]['dimension']['size'] = [];
		var indeces = {};
		result[dataset_name]['dimension']['id'].forEach(function(object) {
			result[dataset_name]['dimension'][object] = {};
			result[dataset_name]['dimension'][object]['label'] = GetValue(worksheet, object + '.label');
			result[dataset_name]['dimension'][object]['category'] = {};
			result[dataset_name]['dimension'][object]['category']['index'] = {};
			result[dataset_name]['dimension'][object]['category']['label'] = {};
			var index_id = GetID(datasheet, GetValue(worksheet, object + '.category.id'));
			var label_id = GetID(datasheet, GetValue(worksheet, object + '.category.label'));
			var obj = GetObject(datasheet, index_id, label_id);
			indeces[index_id] = obj['indeces'];
			for (i = 0; i < obj['indeces'].length; i++) {
				result[dataset_name]['dimension'][object]['category']['index'][obj['indeces'][i]] = i;
				result[dataset_name]['dimension'][object]['category']['label'][obj['indeces'][i]] = obj['labels'][obj['indeces'][i]];}
			result[dataset_name]['dimension']['size'].push(obj['indeces'].length);
		});
		result[dataset_name]['value'] = GetDataObject(datasheet, worksheet, GetValue(worksheet, 'dataset.value'), indeces, result[dataset_name]['dimension']['size']);
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(15);
		return null;}
	return JSON.stringify(result);
}
function GetValue(worksheet, value) {
for (i = 1;; i++)
	if (!worksheet['A' + i]) return null;
	else if (worksheet['A' + i].v == value) return worksheet['B' + i].v;
}
function GetArray(worksheet, value) {
	var result = [];
	for (i = 1;; i++)
		if (!worksheet['A' + i]) return result;
		else if (worksheet['A' + i].v == value)
			for (j = 1; j < alpha.length; j++)
				if (worksheet[alpha[j] + i]) result.push(worksheet[alpha[j] + i].v);
				else return result;
}
function GetID(datasheet, name) {
	for (i = 0;; i++)
		if (!datasheet[alpha[i] + 1]) return null;
		else if (datasheet[alpha[i] + '1'].v == name) return alpha[i];
}
function GetObject(datasheet, index_id, label_id) {
	var obj = {};
	obj['indeces'] = [];
	obj['labels'] = {};
	if (index_id == null || label_id == null) return obj;
	for (i = 2;; i++)
		if (!datasheet[index_id + i] || !datasheet[label_id + i]) {
			obj['indeces'] = obj['indeces'].sort();
			return obj;
		} else 	if (obj['indeces'].indexOf(datasheet[index_id + i].v) < 0) {
			obj['indeces'].push(datasheet[index_id + i].v);
			obj['labels'][datasheet[index_id + i].w] = datasheet[label_id + i].v;}
}
// function GetDataObject(datasheet, value, indeces, lengths) {
// 	value = GetID(datasheet, value);
// 	res = {result: [], names: [], state: [], length : 1, data: {}};
// 	for (key in indeces) {
// 		res.state.push(0);
// 		res.names.push(key);}
// 	lengths.forEach(function(val) { res.length *= val; });
// 	for (i = 2;;i++) {
// 		if (!datasheet['A' + i]) break;
// 			var ID = [];
// 			for (key in indeces) ID.push(datasheet[key + i].v);
// 			res.data[ID] = datasheet[value + i].v;}
// 	var ID = function(state, names, indeces, result) {
// 		for (var j = 0; j < state.length; j++) result.push(indeces[names[j]][state[j]]); return result; }
// 	var REFRESH = function(state, lengths) {
// 		state[state.length - 1]++;
// 		for (j = 1; j < state.length; j++) {
// 			if (j > 0 && state[j] >= lengths[j]) {
// 				state[j - 1]++;
// 				for (k = j; k < state.length;k++) state[k] = 0;
// 				j-=2;}}
// 		return state;}
// 	for (var i = 0; i < res.length; i++) {
// 		var id = ID(res.state, res.names, indeces, [])
// 		var obj = res.data[id];
// 		res.state = REFRESH(res.state, lengths);
// 		if (obj) {
// 			var data = {};
// 			for (j = 0; j < res.names.length; j++) data[res.names[j]] = id[j];
// 			data['value'] = obj;
// 			res.result.push(data);
// 		}}
// 	return res.result;
// }
function GetDataObject(datasheet, worksheet) {
	var fieldMap = [];
	var dimensions = GetArray(worksheet, 'dimension.id');
	dimensions.forEach(function(currentDim){
		fieldMap.push({source:GetValue(worksheet, currentDim + '.category.id'),
						target:"#"+currentDim});
		fieldMap.push({source:GetValue(worksheet, currentDim + '.category.label'),
						target:currentDim});
	})
	fieldMap.push({source:GetValue(worksheet,'dataset.value'),target:"#value"});
	
	var dataDump = XLSX.utils.sheet_to_json(datasheet);
	var result = [];
	dataDump.forEach(function (currentData){
		var item = {};
		for(var field in currentData){
			var targets = fieldMap.filter(function(f){return f.source==field})
			targets.forEach(function(c){
				item[c.target] = (c.target == '#value') 
					? new Number(currentData[c.source])
					: currentData[c.source];
			});
		}
		result.push(item);
	})

	return result;
}