{
    "data_id": "554653e06e297c882887b1df",
    "params": {
    	"axisX" : 0,
    	"normalized": true,
    	"mode" : "Range to [0,1]",
   		"pca" : false,
   		"precision":2		 	
    },
    "proc_name": "scatter-serie",
    "response_type": "data",
    "r":8
}


 axisX   				index of X axis values 				(default 0) 
// 						if axisX < 0 then use row metadata[abs(params.axisX)].id as X axis values
// normalized 			true/false 							(default false)
// mode 				see exports.Normalize mode
// pca 					true/false 							(default false)
// includeLoadings		true/false 							(default false)
// clustered			true/false 							(default false)
// clusters				integer > 0 Number of clusters 		(default 2)
// includeCentroids		true/false 							(default false)
// withRadius			true/false 							(default false)
// precision 			see exports.FormatValues params 	(default null)
