var XLSX = require('xlsx');
var XLS = require('xlsjs');

var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

exports.getJSONSTAT = function(str) {
	var result = [];
	try {
		var json = JSON.parse(str);
		for(val in json) {
			var data = json[val]['value'];
			if (data) 
				data.forEach(function (obj) {
					result.push(obj['value']);});
			json[val]['value'] = result;
			return JSON.stringify(json);}
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
			console.log("Can't read sheets from file!"); return null;}
	} catch(e) {
		console.log(e);
		return null;}
	var result = {};
	try {
		var dataset_name = GetValue(worksheet, 'dataset');
		result[dataset_name] = {};
		result[dataset_name]['note'] = GetValue(worksheet, 'dataset.note');
		result[dataset_name]['label'] = GetValue(worksheet, 'dataset.note');
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
		result[dataset_name]['value'] = GetDataObject(datasheet, GetValue(worksheet, 'dataset.value'), indeces, result[dataset_name]['dimension']['size']);
	} catch(e) {
		console.log(e);
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
function GetDataObject(datasheet, value, indeces, lengths) {
	value = GetID(datasheet, value);
	res = {result: [], names: [], state: [], length : 1, data: {}};
	for (key in indeces) {
		res.state.push(0);
		res.names.push(key);}
	lengths.forEach(function(val) { res.length *= val; });
	for (i = 2;;i++) {
		if (!datasheet['A' + i]) break;
			var ID = [];
			for (key in indeces) ID.push(datasheet[key + i].v);
			res.data[ID] = datasheet[value + i].v;}
	var ID = function(state, names, indeces, result) {
		for (var j = 0; j < state.length; j++) result.push(indeces[names[j]][state[j]]); return result; }
	var REFRESH = function(state, lengths) {
		state[state.length - 1]++;
		for (j = 1; j < state.length; j++) {
			if (j > 0 && state[j] >= lengths[j]) {
				state[j - 1]++;
				for (k = j; k < state.length;k++) state[k] = 0;
				j-=2;}}
		return state;}
	for (var i = 0; i < res.length; i++) {
		var id = ID(res.state, res.names, indeces, [])
		var obj = res.data[id];
		res.state = REFRESH(res.state, lengths);
		if (obj) {
			var data = {};
			for (j = 0; j < res.names.length; j++) data[res.names[j]] = id[j];
			data['value'] = obj;
			res.result.push(data);
		}}
	return res.result;
}
