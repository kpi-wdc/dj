var Promise = require("bluebird");
var parser = require("./parser");
var jp = require("jsonpath");
var copy = require('../../../wdc-deep-copy');
var logger = require("../../../wdc-log").global;
var util = require("util");


var Script = function(config, script, context){
	
	this._script = script;

	this._config = config || [];
	
	this._state = {
		locale: "en",
		storage: context || {},
		head:{
			type: undefined,
			data: undefined
		}
	}
}


Script.prototype.errorState = function(msg){
	this._state.head={
		type: "error",
		data: msg
	}
	return this._state;	
}

Script.prototype.execute = function(command, state){
	
	var getProperty = function(d,path){
		var result = undefined;
		jp.apply(d,path, function(value){
			if(util.isUndefined(result)){
				result = value;
			}else{
				if(!util.isArray(result)){
					result = [result]
				}
				result.push(value)
			}
			return value
		})
		return result
	}

	var applyContext = function(o,c){
	
		if(util.isObject(o)){
			for(var key in o){
				o[key] = applyContext(o[key])
			}
			return o
		}
		if(util.isArray(o)){
			return o.map(function(item){return applyContext(item)})
		}
		if(util.isString(o)){
			if(o.match(/\{\{[\s\S]*\}\}/gi)){
				var key = o.substring(2,o.length-2);
				return copy(getProperty(c,key))
			}else{
				return o
			}	
		}	
		return o;
	}

	var self = this;
	
	return new Promise(function(resolve,reject){
		var executor = self._config.map(function(item){return item.name}).indexOf(command.processId);
		executor = self._config[executor]
		if(!executor || !executor.execute){
			reject(self.errorState("Command '"+command.processId+"'  not implemented"))
			return
		}
		try{
			if(command.processId != "context"){
				command = applyContext(command, state.storage)
			}
			var s = executor.execute(command, state)
			if(s.then){
				s
				.then(function(state){
					resolve(state)
				})
				.catch(function(state){
					reject(
						self.errorState("Command "+JSON.stringify(command)+" error :"+JSON.stringify(state))
					)	
				})

			}else{
				resolve(s)
			}	
		}catch(e){
			reject(self.errorState("Command "+JSON.stringify(command)+" error :"+e.toString()))

		}	
	})
	
}	

Script.prototype.run = function(state){
	var self = this;
	return new Promise(function(resolve, reject){
		if( !self._script ) {
			reject( self.errorState("Cannot run undefined script"))
			return
		}	
		if( self._config.length ==0 ) {
			reject( self.errorState("Interpretor not configured"))
			return
		}	
		if(state){
			self._state.locale  = state.locale || self._state.locale;
			self._state.storage = state.storage || self._state.storage;
		}

		
		try{
			var commandList = new parser()
									.config(self._config)
									.parse(self._script);
		}catch(e){
			reject(self.errorState(e.toString()))
			return;
		}

		
		Promise
			.reduce(commandList, function(cp, command, index){

				

				return new Promise(function(resolve,reject){
					self.execute(command, self._state)
					.then(function(newState){
						self._state = newState
						resolve(self._state)
					})
					.catch(function(errorState){
						reject(errorState)
					})					
				})
					
			},0)
			.then(function(){
				resolve(self._state.head)
			})
			.catch(function(state){
				reject(state)
			})	
	})
	
}

Script.prototype.script = function(){
	if(arguments){
		this._script = arguments[0];
		return this;
	}
	return this._script;
}

Script.prototype.state = function(){
	if(arguments){
		this._state = arguments[0];
		return this;
	}
	return this._state;
}

Script.prototype.config = function(){
	if(arguments){
		this._config = arguments[0];
		return this;
	}
	return this._config;
}

module.exports = Script; 
