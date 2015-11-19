converter = require("wdc-xlsx-converter");
saveXLS = require("wdc-table-generator").saveXLS;
I18N = require("wdc-i18n");

dataset = converter.parseXLS("dataset-example.xlsx");
i18n = new I18N(dataset.dictionary);

dataset.data = i18n.translate(dataset.data,"ua");
for(i in dataset.metadata.dimension){
	dataset.metadata.dimension[i].values = i18n.translate(dataset.metadata.dimension[i].values,"ua")
}


selection = [
    {"dimension":"country","role":"Rows","collection":["UKR","USA","POL"]},
    {"dimension":"concept","role":"Ignore","collection":[]},
    {"dimension":"year","role":"Columns","collection":[]}
];


saveXLS("q.xlsx",dataset,selection);