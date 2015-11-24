converter = require("xlsx-converter");

// converter.parseXLS("dict.xlsx");
// converter.saveXLS("new.xlsx",converter.createDataset());
// console.dir(converter.parseXLS("i18nGDPpc20102013.xlsx"));

dataset = converter.parseXLS("dataset-example.xlsx");

dict = dataset.dictionary;
console.log(JSON.stringify(dict));
dataset = converter.createDataset(111,dict);

converter.saveXLS("new.xlsx", dataset);
// converter.saveXLS("saved.xlsx",converter.parseXLS("i18nGDPpc20102013.xlsx"));