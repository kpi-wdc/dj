converter = require("xlsx-converter");
generate = require("./index").generate;
saveXLS = require("./index").saveXLS;

dataset = converter.parseXLS("dataset-example.xlsx");

selection = [
	{"dimension":"country","role":"Rows","collection":[]},
	{"dimension":"concept","role":"Ignore","collection":[]},
	{"dimension":"year","role":"Columns","collection":[]}
];

// console.log(JSON.stringify(buildXLS(dataset,selection)));

saveXLS("q.xlsx",dataset,selection);