var parse = require("./parser").parse;
var example = 'source({dataset:\'32a00120-b230-11e6-8a1a-0f91ca29d77e_2016_02\'});'
	+'\n    query(['
	+'\n	{dim:"indicator",role:"col",items:[]},'
	+'\n	{dim:"time", role:"row",items:[]}'
	+'\n    ]);'
	+'\n'
	+'\nformat({p:2});' 
	+'\norder({asc:"az",dir:"row",index:0});'
	+'\nline-serie ( {'
	+'\n	xaxis:-1,' 
	+'\n	"index":[0]'
	+'\n})';
console.log(example);
// console.log(example.match(/'\S*'/gim));
// console.log(example.match(/\S+[\{\}\:\[\]\s]/gim));
// console.log(example.match(/[a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+)/gim));
// console.log(example.split(/[a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+)/gim));
// console.log(example.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"").replace(/'/g,'"'))

console.log(JSON.stringify(parse(example)))	

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