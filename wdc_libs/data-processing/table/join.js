// join tables

var Query = require("../../wdc-query");

module.exports = function(tables,params){

	if(!params.join) return tables;
	if(!params.join.enable) return tables;
	
	var result = {metadata:{}};
	var direction = params.join.direction || "Rows";
	var joinMode = params.join.mode || "left join"; // "inner"// "outer"
	var metaTest = params.join.test || []; // [t1.metadataindex. t2metadataindex]
	var table1 = tables[0];
	table1.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: cc, 
			dimension: "Concatenated Meta", 
			dimensionLabel: "Concatenated Meta"
		}]
		
	})

	
	var table2 = tables[1];
	table2.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: cc, 
			dimension: "Concatenated Meta", 
			dimensionLabel: "Concatenated Meta"
		}]
		
	})
	
	
	result.header = table1.header
						.map(function(item){
							return item
						})
						.concat(
							table2.header
								.map(function(item){
									return item
								})
						);

	var equalsMetas = function (m1,m2,test){

		var f = test.length>0;
		test.forEach(function(t){
			f &= (m1[t[0]].dimension == m2[t[1]].dimension) && (m1[t[0]].id == m2[t[1]].id)
		})
		return f;
	}

	var nulls = function(count){
		var _r = [];
		while(count-- > 0) _r.push(null)
		return _r;	
	}

	if(joinMode == "left join"){
		result.body = new Query()
			.from(table1.body)
			.wrap("a")
			.leftJoin(
				new Query()
					.from(table2.body)
					.wrap("b")
					.get(),
				function(r1,r2){
					return equalsMetas(r1.a.metadata,r2.b.metadata,metaTest)
				}	
			)
			.map(function(row){
				return {
					metadata:row.a.metadata,
					value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
				}
			})
			.distinct()
			.get()
		return result;	
	} 
	if(joinMode == "inner join"){
		result.body = new Query()
			.from(table1.body)
			.wrap("a")
			.innerJoin(
				new Query()
					.from(table2.body)
					.wrap("b")
					.get(),
				function(r1,r2){
					return equalsMetas(r1.a.metadata,r2.b.metadata,metaTest)
				}	
			)
			.map(function(row){
				return {
					metadata:row.a.metadata,
					value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
				}
			})
			.distinct()
			.get()
		return result;	
	}

	if(joinMode == "outer join"){
		result.body = new Query()
			.from(table1.body)
			.wrap("a")
			.outerJoin(
				new Query()
					.from(table2.body)
					.wrap("b")
					.get(),
				function(r1,r2){
					return equalsMetas(r1.a.metadata,r2.b.metadata,metaTest)
				}	
			)
			.map(function(row){
				return {
					metadata:(row.a) 
								? row.a.metadata
								: row.b.metadata,
					value: (row.a)
								? row.a.value.concat(
									(row.b) 
										? row.b.value 
										: nulls(table2.header.length)
								): (nulls(table1.header.length)).concat(row.b.value)
				}
			})
			.distinct()
			.get()
		return result;	
	}		
	
	return result;	 	
}