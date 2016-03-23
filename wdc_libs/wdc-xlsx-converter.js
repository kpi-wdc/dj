query = require('./wdc-query');
util = require("util");
parser = require("./wdc-xlsx2json");
FO = require("./wdc-flat");
simpleXLSX = require("node-xlsx");
fs = require("fs");
PATH = require("path");

exports.validate = function(filename){
  var warnings=[];
  var workbook = parser.convert(parser.parseFile(filename));

  var metadataSheet = workbook.Sheets['metadata'];
  var dictionarySheet = workbook.Sheets['dictionary'];
  var i18nSheet = workbook.Sheets['i18n'];

  if(!metadataSheet) return {error:"Cannot find metadata. Metadata sheet must be named 'metadata'"}

  var metadata = FO.flat2json(
      new query()
        .from(metadataSheet)
        .map(function (item) {
          return {path: item.key, value: item.value}
        })
        .get());
  
  if(!metadata.dataset.id || metadata.dataset.id =='')
      return {error:"Cannot find metadata.dataset.id. Create and download new dataset with dataset manager'"}    

  if(!metadata.dataset.commit.note || metadata.dataset.commit.note == '')
      warnings.push("Metadata.dataset.commit.note is empty");

  if(!metadata.dataset.label || metadata.dataset.label == '')   
    warnings.push("Dataset.label is empty");

  if(!metadata.dataset.note || metadata.dataset.note == '')   
    warnings.push("Dataset.note is empty");

  if(!metadata.dataset.source || metadata.dataset.source == '')   
    warnings.push("Dataset.source is empty");

  if(!metadata.dataset.topics || metadata.dataset.topics.length == 0)   
    warnings.push("List of topics is empty");

  if(!metadata.dimension) return {error:"Cannot find dataset dimension."}   
  
  for(var key in metadata.dimension){
    if(!metadata.dimension[key].label || metadata.dimension[key].label=='')
        return {error:"Cannot find dimension."+ key +".label"}
    if(!metadata.dimension[key].role || metadata.dimension[key].role=='')
        warnings.push("Cannot find dimension."+ key +".role");
  }
  if(!metadata.layout || metadata.layout=='') return {error:"Cannot find metadata.layout"}

  if(!metadata.layout.sheet || !workbook.Sheets[metadata.layout.sheet]) 
    return {error:"Reference "+metadata.layout.sheet+"to data sheet..."} 

  for(var key in metadata.dimension){
    if(!metadata.layout[key].label || metadata.layout[key].label == '')
        return {error:"Cannot find layout."+ key +".label. It must be refered to data sheet column"}
    if(!metadata.layout[key].id || metadata.layout[key].id =='')
        warnings.push("Cannot find layout."+ key +".id. It must be refered to data sheet column");
  }
  
  data = workbook.Sheets[metadata.layout.sheet];

  if(!metadata.layout.value || metadata.layout.value == '') 
    return {error:"Cannot find layout.value. It must be refered to data sheet column"}
  
  for(var key in metadata.dimension){
    for(var row in data){
      if(!data[row][metadata.layout[key].label]) 
        return {error:"Sheet '"+metadata.layout.sheet+"' row "+row+" has undefined value in column '"+metadata.layout[key].label+"'"}
      if(!data[row][metadata.layout[key].id]) 
        return {error:"Sheet '"+metadata.layout.sheet+"' row "+row+" has undefined value in column '"+metadata.layout[key].id+"'"}
    }
  }

  for(var row in data){
    if(!data[row][metadata.layout.value])
        warnings.push("Sheet '"+metadata.layout.sheet+"' row "+row + " has undefined value in column '"+metadata.layout.value+"'") 
  }


  if (dictionarySheet != undefined) {
    var dict = workbook.Sheets['dictionary'];
    for(var i in dict){
      if(!dict[i].key)
        return {error:"Sheet 'dictionary' row "+i +" has undefined value in column 'key'"}
      if(!dict[i]["value.label"])
        return {error:"Sheet 'dictionary' row "+i +" has undefined value in column 'value.label'"}
    }
  }

if (i18nSheet != undefined) {
    var dict = workbook.Sheets['i18n'];
    for(var i in dict){
      if(!dict[i].key)
        return {error:"Sheet 'i18n' row "+i +" has undefined value in column 'key'"}
    }
  }

  
  return {"warnings": warnings}; 
}

exports.parseXLS = function (filename) {
  var workbook = parser.convert(parser.parseFile(filename));

  var metadataSheet = workbook.Sheets['metadata'];
  var dictionarySheet = workbook.Sheets['dictionary'];
  var i18nSheet = workbook.Sheets['i18n'];

  var metadata, data, dictionary;

  if (metadataSheet != undefined) {
    metadata = FO.flat2json(
      new query()
        .from(metadataSheet)
        .map(function (item) {
          return {path: item.key, value: item.value}
        })
        .get());

    var dims = metadata.dimension;
    var layout = metadata.layout;
    var rawData = workbook.Sheets[layout.sheet]

    if (rawData != undefined) {

      for (i in dims) {
        dims[i].values = new query()
          .from(rawData)
          .map(function (item) {
            return {
              id: item[layout[i].id], 
              label: item[layout[i].label]
            }
          })
          .distinct()
          .orderBy(function (a, b) {
            return a > b
          })
          .get();
      }

      data = new query()
        .from(rawData)
        .map(function (item) {
          result = {};
          for (i in dims) {
            result[i] = item[layout[i].label];
            result["#" + i] = item[layout[i].id];
          }
          result["#value"] = item[layout.value];
          return result;
        })
        .get();
    }
  } else {
    throw new Error('No metadata sheet found in the document');
  }

  if (dictionarySheet != undefined) {
    var dict = workbook.Sheets['dictionary'];
    dictionary = [];

    dict.forEach(function (item) {
      pathes = [];
      for (i in item) {
        if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
          pathes.push({path: i, value: item[i]})
        }
      }
      dictionary.push(FO.flat2json(pathes));
    })
  } else {
    throw new Error('No dictionary sheet found in the document');
  }

  if (i18nSheet != undefined) {

    dictionary = dictionary || [];

    i18nSheet.forEach(function (item) {
      pathes = [];
      for (i in item) {
        if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
          pathes.push({path: i, value: item[i]})
        }
      }
      tmp = FO.flat2json(pathes);
      tmp.type = "i18n";
      dictionary.push(tmp);
    })
  } else {
    throw new Error('No i18n sheet found in the document');
  }

  return {
    metadata: metadata,
    data: data,
    dictionary: dictionary
  }
};

exports.createDataset = function (id, dictionary) {
  var dataset = exports.parseXLS(PATH.join(__dirname, "template.xlsx"));
  dataset.metadata.dataset.id = id;
  dataset.metadata.dataset.commit.note = "Initial commit for new a dataset instance";
  dataset.dictionary = dataset.dictionary.concat(dictionary);
  dataset.data = [];
  return dataset;
};

json_to_sheet = function (name, json) {

  keyList = new query()
    .from(json)
    .map(function (item) {
      res = [];
      for (i in item) {
        res.push(i)
      }
      return res;
    })
    .distinct()
    .get();

  sheet = {name: name, data: []};
  row = [];
  for (i in keyList) {
    row.push(keyList[i])
  }
  sheet.data.push(row);
  json.forEach(function (item) {
    row = [];
    for (i in keyList) {
      row.push(item[keyList[i]] || null)
    }
    sheet.data.push(row);
  });
  return sheet;
};

exports.buildXLS = function (dataset) {
  var result = []

  if (dataset.metadata) {
    // console.log(dataset.metadata)
    layout = dataset.metadata.layout;
    dimension = dataset.metadata.dimension;

    dims = {};
    for (i in dimension) {
      dims[i] = layout[i].label;
      dims["#" + i] = layout[i].id;
    }
    dims["#value"] = layout.value;

    data = new query()
      .from(dataset.data)
      .map(function (item) {
        r = {};
        for (i in item) {
          r[dims[i]] = item[i]
        }
        return r;
      })
      .get();

    result.push(json_to_sheet("data", data));

    metadata = new query()
      .from(FO.json2flat(dataset.metadata))
      .map(function (item) {
        return {key: item.path, value: item.value}
      })
      .select(function (item) {
        return item.key.indexOf(".values[]") == -1
      })
      .get();


    result.push(json_to_sheet("metadata", metadata));
  }

  if (dataset.dictionary) {
    dictionary = new query()
      .from(dataset.dictionary)
      .select(function (item) {
        return item.type !== 'i18n';
      })
      .map(function (item) {
        r = {};
        flat = FO.json2flat(item);
        flat.forEach(function (e) {
          r[e.path] = e.value;
        });
        return r;
      })
      .get();

    result.push(json_to_sheet("dictionary", dictionary));

    i18n = new query()
      .from(dataset.dictionary)
      .select(function (item) {
        return item.type === 'i18n';
      })
      .map(function (item) {
        r = {};
        delete item.type;
        flat = FO.json2flat(item);
        flat.forEach(function (e) {
          r[e.path] = e.value;
        });
        return r;
      })
      .get();

    result.push(json_to_sheet("i18n", i18n));
  }

  result = simpleXLSX.build(result);
  return result;
};

exports.saveXLS = function (filename, dataset) {
  fs.writeFileSync(filename, exports.buildXLS(dataset));
};



exports.parseXLSTimeline = function (filename) {
  
  var workbook = parser.convert(parser.parseFile(filename));

  var metadataSheet = workbook.Sheets['metadata'];
  var dictionarySheet = workbook.Sheets['dictionary'];
  var i18nSheet = workbook.Sheets['i18n'];

  var metadata, data, dictionary;

  if (metadataSheet != undefined) {
    metadata = FO.flat2json(
      new query()
        .from(metadataSheet)
        .map(function (item) {
          return {path: item.key, value: item.value}
        })
        .get());

    var rawData = workbook.Sheets[metadata.layout.sheet]

    if (rawData != undefined) {
      
      data = rawData.map(function(item){
        var res = FO.json2flat({
          "id" : item[metadata.layout.id],
          "title" : item[metadata.layout.title],
          "start" : item[metadata.layout.start],
          "end" : item[metadata.layout.end],
          "income" : item[metadata.layout.income],
          "expenditure" : item[metadata.layout.expenditure],
          "causes" : item[metadata.layout.causes],
          "note" : item[metadata.layout.note]
        });

        // var i = 0;
        // while(i<res.length){
        //   if(res[i] == undefined){
        //     res.splice(i,1)
        //   }else{
        //     i++
        //   }
        // } 
        
        return FO.flat2json(res)
      }); 
    }    
  } else {
    throw new Error('No metadata sheet found in the document');
  }

    if (dictionarySheet != undefined) {
      var dict = workbook.Sheets['dictionary'];
      dictionary = [];

      dict.forEach(function (item) {
        pathes = [];
        for (i in item) {
          if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
            pathes.push({path: i, value: item[i]})
          }
        }
        dictionary.push(FO.flat2json(pathes));
      })
    } else {
      throw new Error('No dictionary sheet found in the document');
    }

    if (i18nSheet != undefined) {

      dictionary = dictionary || [];

      i18nSheet.forEach(function (item) {
        pathes = [];
        for (i in item) {
          if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
            pathes.push({path: i, value: item[i]})
          }
        }
        tmp = FO.flat2json(pathes);
        tmp.type = "i18n";
        dictionary.push(tmp);
      })
    } else {
      throw new Error('No i18n sheet found in the document');
    }

    return {
      metadata: metadata,
      data: data,
      dictionary: dictionary
    }
};

