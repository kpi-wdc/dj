// returns dataset query result
//  
var executeQuery = require("../../wdc-table-generator").prepare;


module.exports = function(dataset,params){
	var result = executeQuery(dataset,params.query);
	result.metadata = {
        type : "Query Result Table",
        source : dataset.metadata,
        selection : params.query
    }
    return result;
}