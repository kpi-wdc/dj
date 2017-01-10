var parser = require("./parser");
var example = 
	'/*'
	+'\n********************************************'
	+'\n   Select sources from metadata'
	+'\n   Select sources from metadata '
	+'\n  Select sources from metadata'
	+'\n  !@#$%^&*()_+}{|\\//>><<<?~`'
	+'\n*/'
	+'\n source(  '
	+'\n dataset:\'{{dataset.id}}\'   )'
	+'\n    query(['
	+'\n	{dim:"indicator",role:"col",items:[]},'
	+'\n	{dim:"time", role:"row",items:[]}'
	+'\n    ])'
	+'\n'
	+'\n  transpose()' 
	+'\norder("az"); format(2) export(\'f.txt\');'
	+'\nline-serie ( '
	+'\n	 xaxis:-1,' 
	+'\n	"index":[0])'
	+'\n select("$..dataset[@.source==\'#WDC\'].label"'
	+'\n)';

// var example= "source(table:'5843ff26496b7de842437a4d');format(precision:2);order(direction:'Row', asc:'A-Z', index:-1);select(path:'$[?(@.dataset.source==\"aaaaaaa\")]');aggregate(direction:'Rows', data:['min','max','avg','std','sum'])"
console.log(example);
console.log(parser.parse(example))


console.log(parser.stringify(parser.parse(example)).match(/\{\{[\s\S]*\}\}/gi))

// console.log(example.match(/'\S*'/gim));
// console.log(example.match(/\S+[\{\}\:\[\]\s]/gim));
// console.log(example.match(/[a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+)/gim));
// console.log(example.split(/[a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+)/gim));
// console.log(example.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"").replace(/'/g,'"'))

// var context  =  {
// 	metadata:{
// 		dataset:{
// 			id: "32a00120-b230-11e6-8a1a-0f91ca29d77e_2016_02"
// 		}
// 	}
// }

// var getContextValue = function(){
// 	var tags =arguments[1].split(".")
// 		var value = context;
// 		tags.forEach(function(tag){
// 			tag = tag.trim();
// 			value = value[tag] 
// 		})

// 		return value
// }
// var applyContext = function(template, context){
// 	return template.replace(/(?:\{\{\s*)([a-zA-Z0-9_\.]*)(?:\s*\}\})/gim, getContextValue)
// }

// console.log(applyContext(example,context));

// console.log(JSON.stringify(parse(example)))	

/*
"source"({"dataset":"32a00120-b230-11e6-8a1a-0f91ca29d77e_2016_02"});
"query"([
	{"dim":"indicator","role":"col","items":[]},
	{"dim":"time", "role":"time","items":[]}
]);
"format"({"p":2}); 
"order"({"asc":"az","dir":"row","index":0});
"line-serie"({
	"xaxis":-1, 
	"index":[0]
})
*/
// console.log("------------------------------------------------------------------")
// console.log(example)
// console.log("------------------------------------------------------------------")
// console.log( 
// 	example .replace(/\/\/[\w\S\ .\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:[\n\r]*)/gi,"")
// 			.replace(/[\r\n\t\s]*/gim,"")
// 			.replace(/\/\*[\w\b\.\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:\*\/)/gim,"")
// 			.replace(/(\))([a-zA-Z])/gim,"$1;$2")
// 			.replace(/\(([\w\b\.\t\:\,\'\"0-9-_]+[\w\b\.\t\:\,\'\"\[\]0-9-_]*)\)/gi,"({$1})")
// 			.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"")
// 			.replace(/\'/gim,"\"")
// 			.replace(/\(/gim,":")
// 			.replace(/\)/gim,"")

// );

// console.log("----------------------------------------")
// console.log(parser.applyContext(example,{dataset:{id:"1111111"}}))
// console.log(parser.parse(parser.applyContext(example,{dataset:{id:"1111111"}})))
// console.log("----------------------------------------")
// console.log(parser.stringify(parser.parse(parser.applyContext(example,{dataset:{id:"1111111"}}))))


// console.log(example);

// var values = example.match(
// 		/'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim
// 		)


// function varIndex(tag){
// 	console.log(tag);
// 	return  "^"+values.indexOf(tag)
// }

// function switchQ(tag){
// 	return (tag=="'")? '"' : "'"
// }
// function varValue(tag){
// 	console.log(tag)
// 	return values[Number(tag.substring(1))].replace(/[\'\"]/gi, switchQ)
// }

// example = example.replace(
// 			/'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim
// 	, varIndex)

// example = example.replace(/\/\/[\w\S\ .\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:[\n\r]*)/gi,"")
// 			.replace(/[\r\n\t\s]*/gim,"")
// 			.replace(/\/\*[\w\b\.\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:\*\/)/gim,"")
// 			.replace(/(\))([a-zA-Z])/gim,"$1;$2")
// 			.replace(/\(([\w\b\.\t\:\,\'\"0-9-_]+[\w\b\.\t\:\,\'\"\[\]0-9-_]*)\)/gi,"({$1})")
// 			.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"")
// 			.replace(/\'/gim,"\"")
// 			.replace(/\(\s*\)/gi,"({})")
// 			.replace(/\(/gim,":")
// 			.replace(/\)/gim,"")
// 			.replace(/\^[0-9]+/gim,varValue)
// console.log(example)