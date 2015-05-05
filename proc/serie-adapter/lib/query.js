var Query = function(data){
	this.data = data;
	this.result = data;
}

Query.prototype = {
	select : function (criteria){
		this.result = this.data.filter(criteria);
		this.data = this.result;
		return this;
	},
	orderBy : function (criteria){
		this.data.sort(criteria);
		return this;	
	},
	distinct : function(){
		this.result = [];
		var thos = this;
		this.data.forEach(function(item){
			var notExists = true;
			thos.result.forEach(function(r){
				for(key in item){
					notExists &= item[key] != r[key]
				}
			})
			if(notExists == true) thos.result.push(item)
		});
		this.data = this.result;
		return this;
	},
	map : function(action){
		this.result = this.data.map(action);
		this.data = this.result;
		return this;
	},
	
	// left join implementation
	join : function(data, criteria){
		return this;
	}, 
	
	execute : function(){
		return this.data;
	} 
}

exports.Query = Query;






