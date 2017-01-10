var date = require("date-and-time");

var current = 0;

var log = function(scope){
	this.scope = scope;
	this.pool = [];
	this.id = current++;
	this.timeStampFormat = "DD/MM/YY hh:mm:ss"
};

var messagePriority = ["debug","info","warning","success", "error"]


log.prototype._push = function(level,data){
	var msg = [];

	for(var key in data){
		msg.push(data[key])
	}
	
	if(messagePriority.indexOf(level) >= messagePriority.indexOf(this.consoleLevel)){
		console.log(date.format(new Date(),this.timeStampFormat)+" ["+level+"] "+msg)
	}
		
	this.pool.push({
		logger: this.id,
		scope: this.scope,
		timeStamp: 	date.format(new Date(),this.timeStampFormat),
		level: 		level,
		message:   	msg     
	})	
}
log.prototype.clear = function(){ this.pool=[]; return this};

log.prototype.consoleLevel = function(level){ this.consoleLevel = level || "error"; return this};

log.prototype.timeFormat = function(_){ 
	if(!_) return this.timeStampFormat;
	this.timeStampFormat = _;
	return this;
};

log.prototype.merge = function(log){
	this.pool = this.pool.concat(log.pool);
	this.pool.sort(
		function(a,b){
          return date.subtract(new Date(a.timeStamp), new Date(b.timeStamp)).toMilliseconds();
    })
    return this;
};
log.prototype.info = function(){ this._push("info",arguments); return this};
log.prototype.log = function(){ this._push("info",arguments); return this};
log.prototype.debug = function(){ this._push("debug",arguments); return this};
log.prototype.warn = function(){ this._push("warning",arguments); return this};
log.prototype.warning = function(){ this._push("warning",arguments); return this};
log.prototype.error = function(){ this._push("error",arguments); return this};
log.prototype.success = function(){ this._push("success",arguments); return this};

log.prototype.get = function(level){
	level = level || ["info","debug","warning","error","success"]
	level = (level.forEach) ? level : [level];
	return this.pool.filter(function(msg){
		return level.indexOf(msg.level) >= 0
	})
}


var globalLog = new log("global");

module.exports = {
	global : globalLog,
	local : function(){
		return new log("local");
	}
}	
