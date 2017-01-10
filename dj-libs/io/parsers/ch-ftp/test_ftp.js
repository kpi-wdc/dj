var downloadData = require("./download") 

downloadData({
	  	host: "193.108.226.67", 
	  	user: "iask01", 
	  	password: "kuhgyf503",
	  	patterns: [
	  		"NSMS-DAU001-GDR004-VAL_*.CSV",
			"NSMS-DAU001-GDR009-VAL_*.CSV",
			"NSMS-DAU002-GDR015-VAL_*.CSV"
		],
		dest: "./data/"
	  }
	)
	.then(function(){console.log("data downloaded")})
// 	
// var cron = require('node-cron');

// var task = cron.schedule('0-2 * * * *', function(){
//   console.log('running every minute to 1 from 5');
// });	

// task.start();