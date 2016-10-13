var util = require("util");

var Coder = function(){
	this.encodeTable = {};
	this.decodeTable = {};
}

Coder.prototype._push = function(item){
	if(this.encodeTable[item] != undefined) return;

	if (this.counter == undefined) this.counter = -1;
	this.counter++;
	var key = this.counter;
	this.decodeTable[key] = item;
	this.encodeTable[item] = key;
}

Coder.prototype.push = function(item){
	var thos = this;
	if(util.isArray(item)){
		item.forEach(function(d){thos._push(d)})
	}else{
		thos._push(item)
	}
	return this;
}

Coder.prototype.encode = function(key){
	if(this.encodeTable[key] !== undefined ) return this.encodeTable[key]
	return undefined;	
}

Coder.prototype.decode = function(key){
	if(this.decodeTable[key] !== undefined ) return this.decodeTable[key]
	return undefined;	
}	

Coder.prototype.dictionary = function(){
	result = [];
	for(var key in this.decodeTable) result.push({key:key, value:this.decodeTable[key]})
	return result;	
}	

module.exports = function(){
	return new Coder();
} 