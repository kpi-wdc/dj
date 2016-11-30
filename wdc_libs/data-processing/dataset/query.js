// returns dataset query result
//  
var executeQuery = require("../../wdc-table-generator").prepare;


module.exports = function(dataset,params){
	var query = (params.query)? params.query : params;
	var result = executeQuery(dataset,query);
	result.metadata = {
        type : "Query Result Table",
        source : dataset.metadata,
        selection : query
    }
    return result;
}