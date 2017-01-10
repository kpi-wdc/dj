// join tables

var Query = require("../../wdc-query");

module.exports = function(tables,params){

	// if(!params.join) return tables;
	// if(!params.join.enable) return tables;
	var join = (params.join) ? params.join : params;
	var result = {metadata:{}};
	var direction = join.direction || "Rows";
	var joinMode = join.mode || "left"; // "inner"// "outer"
	joinMode = (joinMode == "left join") ? "left" : joinMode;
	joinMode = (joinMode == "inner join") ? "inner" : joinMode;
	joinMode = (joinMode == "outer join") ? "outer" : joinMode;
	 
	var as = join.as || "";
	var metaTest = join.test || [[0,0]]; // [t1.metadataindex. t2metadataindex]
	var table1 = (tables.forEach) ? tables[0] : tables;
	var table2 = (tables.forEach) 
					? tables[1]
					: (join["with"])
						? join["with"]
						: table1;

	// console.log("TABLE1", JSON.stringify(table1))
	// console.log("TABLE2", JSON.stringify(table2))
	// console.log(metaTest)
	
	table1.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: cc, 
			dimension: "Concatenated Meta", 
			dimensionLabel: "Concatenated Meta"
		}]
		
	})

	
	table2.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: as+cc, 
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

	if(joinMode == "left"){
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
	if(joinMode == "inner"){
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

	if(joinMode == "outer"){
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