var Parser = require("../wdc-parser");


var p = new Parser({
	filename : "./data3.csv",
	reader: {
		type: "csv",
		options:{delimiter: ";"}
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
						console.log(r)
					})	
				})	
			})	
		})	
	});

