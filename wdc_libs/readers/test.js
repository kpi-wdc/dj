var Parser = require("../wdc-parser");


var p = new Parser({
	filename : "./data.xlsx",
	
	reader: {
		type: "xlsx"
	},

	validate: function(src){
		console.log("#validate");
		return src;
	},
	metadata: function(src){
		console.log("#metadata");
		return src;	
	},
	dictionary: function(src){
		console.log("#dictionary");
		return src;	
	},
	i18n: function(src){
		console.log("#i18n");
		return src;	
	},
	data: function(src, metadata){
		console.log("#data");
		return src;	
	}
})

// var p = new Parser({
// 	// url : "http://api.worldbank.org/countries/all/indicators/NY.GDP.MKTP.CD?date=2002:2015&format=json",
// 	// url:"http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/nama_gdp_c?precision=1&unit=EUR_HAB&time=2010&time=2011&indic_na=B1GM&unitLabel=label",
// 	url:"http://data.ssb.no/api/v0/dataset/85430.json?lang=en",
// 	reader: {
// 		type: "json",
// 	},

// 	validate: function(src){
// 		console.log("#validate");
// 		return src;
// 	},
// 	metadata: function(src){
// 		console.log("#metadata");
// 		return src;	
// 	},
// 	dictionary: function(src){
// 		console.log("#dictionary");
// 		return src;	
// 	},
// 	i18n: function(src){
// 		console.log("#i18n");
// 		return src;	
// 	},
// 	data: function(src, metadata){
// 		console.log("#data");
// 		return src;	
// 	}
// })

// var p = new Parser({
// 	url : "http://api.worldbank.org/countries/all/indicators/NY.GDP.MKTP.CD?date=2002:2015&format=xml",
	
// 	reader: {
// 		type: "xml",
// 	},

// 	validate: function(src){
// 		console.log("#validate");
// 		return src;
// 	},
// 	metadata: function(src){
// 		console.log("#metadata");
// 		return src;	
// 	},
// 	dictionary: function(src){
// 		console.log("#dictionary");
// 		return src;	
// 	},
// 	i18n: function(src){
// 		console.log("#i18n");
// 		return src;	
// 	},
// 	data: function(src, metadata){
// 		console.log("#data");
// 		return src;	
// 	}
// })


// var p = new Parser({
// 	url : "http://api.worldbank.org/countries/all/indicators/NY.GDP.MKTP.CD?date=2002:2015&format=csv",
	
// 	reader: {
// 		type: "csv",
// 		// encoding:"win1251",
// 		options:{delimiter: ","}
// 	},

// 	validate: function(src){
// 		console.log("#validate");
// 		return src;
// 	},
// 	metadata: function(src){
// 		console.log("#metadata");
// 		return src;	
// 	},
// 	dictionary: function(src){
// 		console.log("#dictionary");
// 		return src;	
// 	},
// 	i18n: function(src){
// 		console.log("#i18n");
// 		return src;	
// 	},
// 	data: function(src, metadata){
// 		console.log("#data");
// 		return src;	
// 	}
// })

var date = require('date-and-time');
p.validate()
	.then(function(r){
		console.log(r!=undefined);
		p.metadata().then(function(r){
			console.log(r!=undefined)
			p.dictionary().then(function(r){
				console.log(r!=undefined);
				p.i18n().then(function(r){
					console.log(r!=undefined);
					p.data().then(function(r){
						var date = require("date-and-time")
						var d = r.Sheets["metadata"].filter(function(item){return item.key=="date"})[0]
						console.log(date.format(date.parse(d.value,"YYYYMMDD"),"DD MMMM YY"))
					})	
				})	
			})	
		})	
	});

