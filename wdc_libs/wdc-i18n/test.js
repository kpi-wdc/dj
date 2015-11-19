converter = require("wdc-xlsx-converter");
generate = require("wdc-table-generator").generate;
saveXLS = require("wdc-table-generator").saveXLS;
I18N = require("./index");
dataset = converter.parseXLS("dataset-example.xlsx");


// selection = [
//     {"dimension":"country","role":"Rows","collection":[]},
//     {"dimension":"concept","role":"Ignore","collection":[]},
//     {"dimension":"year","role":"Columns","collection":[]}
// ];

// console.log(JSON.stringify(buildXLS(dataset,selection)));

// saveXLS("q.xlsx",dataset,selection);


i18n = new I18N(dataset.dictionary);

console.log("#DIM_YEAR", i18n.translate("#DIM_YEAR", "en"), i18n.translate("#DIM_YEAR", "ua"));
console.log("DIM_YEAR", i18n.translate("DIM_YEAR", "en"), i18n.translate("DIM_YEAR", "ua"));
console.log(1, i18n.translate(1, "en"), i18n.translate(1, "ua"));
 o = {
 	wrap:{
 		name : "#WDI_LABEL",
 		keywords : ["#EC_LABEL","#GDP_ABBR"]
 	}	 
 }
console.log(o);
console.log(i18n.translate(o,"en"));
i18n.setDefault("ua");
console.log(i18n.translate(o));




