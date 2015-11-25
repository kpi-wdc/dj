converter = require("wdc-xlsx-converter");

// converter.parseXLS("dict.xlsx");
// converter.saveXLS("new.xlsx",converter.createDataset());
// console.dir(converter.parseXLS("i18nGDPpc20102013.xlsx"));

dataset = converter.parseXLS("dataset-example.xlsx");

dict = dataset.dictionary;
// console.log(JSON.stringify(dict));
dataset = converter.createDataset(111,dict);

converter.saveXLS("dictionary.xlsx", {dictionary:dict});
// converter.saveXLS("saved.xlsx",converter.parseXLS("i18nGDPpc20102013.xlsx"));