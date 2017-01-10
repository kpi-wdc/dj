var ChartImplError = function(chart, message) {
    this.message = message;
    this.name = "Command '" + chart + "' implementation error";
}
ChartImplError.prototype = Object.create(Error.prototype);
ChartImplError.prototype.constructor = ChartImplError;


module.exports = {
    general: function(chart, message) {
        return new ChartImplError(chart, message)
    },
    type: function(chart, type){
    	return new ChartImplError(chart, "Incompatible context type: '" + type + "'.")
    },
    value: function(chart, prop, value){
    	return new ChartImplError(chart,  "Incompatible "+ prop +" value: " + JSON.stringify(value))
    }
}
