query = require('wdc-query');
util = require("util");
parser = require("wdc-xlsx2json");
FO = require("wdc-flat");
simpleXLSX = require("node-xlsx");
fs = require("fs");
PATH = require("path");

exports.parseXLS = function(filename){
    var workbook = parser.convert(parser.parseFile(filename));
    
    var metadataSheet = workbook.Sheets['metadata']; 
    var dictionarySheet = workbook.Sheets['dictionary']; 
    var i18nSheet = workbook.Sheets['i18n']; 
    
    var metadata, data, dictionary; 
    
    if ( metadataSheet != undefined){
        metadata = FO.flat2json(
            new query()
                 .from(metadataSheet)
                 .map(function(item){return {path:item.key, value:item.value}})
                 .get());
         
         var dims = metadata.dimension;
         var layout = metadata.layout;
         var rawData = workbook.Sheets[layout.sheet]
         
         if(rawData != undefined){
             
             for(i in dims){
                dims[i].values = new query()
                    .from(rawData)
                    .map(function(item){
                        return {id:item[layout[i].id], label: item[layout[i].label]}
                    })
                    .distinct()
                    .orderBy(function(a,b){return a>b})
                    .get();
             }
        
            data = new query()
                .from(rawData)
                .map(function(item){
                    result = {};
                    for(i in dims){
                        result[i] = item[layout[i].label];
                        result["#"+i] = item[layout[i].id];
                    }
                    result["#value"] = item[layout.value];
                    return result;
                })
                .get();
        }   
    }       
    

    if(dictionarySheet != undefined ){
        var dict = workbook.Sheets['dictionary'];
        dictionary = [];
        
        dict.forEach(function(item){
            pathes = [];
            for(i in item){ 
                if(i.indexOf("__") !=0 && item[i]!=undefined && item[i] != null) {
                    pathes.push({path:i,value:item[i]})
                }
            }   
            dictionary.push(FO.flat2json(pathes));  
        })
    }

    if(i18nSheet != undefined ){
        
        dictionary = dictionary || [];
        
        i18nSheet.forEach(function(item){
            pathes = [];
            for(i in item){ 
                if(i.indexOf("__") !=0 && item[i]!=undefined && item[i] != null) {
                    pathes.push({path:i,value:item[i]})
                }
            }
            tmp = FO.flat2json(pathes);
            tmp.type = "i18n";  
            dictionary.push(tmp);   
        })
    }
    
    
    return {
        metadata:metadata,
        data:data,
        dictionary:dictionary
    }
}

exports.createDataset = function(id,dictionary){
    var dataset = exports.parseXLS(PATH.join(__dirname, "template.xlsx"));
    dataset.metadata.dataset.id = id;
    dataset.metadata.dataset.commit.note = "Initial commit for new dataset instance";
    dataset.dictionary = dataset.dictionary.concat(dictionary);
    dataset.data = [];
    return dataset;
}

json_to_sheet = function(name, json){

    keyList = new query()
        .from(json)
        .map(function(item){
            res = [];
            for(i in item){
                res.push(i)
            }
            return res;
        })
        .distinct()
        .get();

    sheet = {name : name, data:[]};
    row = [];
    for(i in keyList){
        row.push(keyList[i])
    }
    sheet.data.push(row);
    json.forEach(function(item){
        row = [];
        for(i in keyList){
            row.push(item[keyList[i]] || null)
        }
        sheet.data.push(row);
    });
    return sheet;
}   


exports.buildXLS = function(dataset){
    var result = [] 

   layout = dataset.metadata.layout;
   dimension = dataset.metadata.dimension;
   dims = {};
   for(i in dimension){
    dims[i] = layout[i].label;
    dims["#"+i] = layout[i].id;
   }
   dims["#value"] = layout.value;

   data = new query()
        .from(dataset.data)
        .map(function(item){
            r = {};
            for(i in item){
                r[dims[i]] = item[i]
            }
            return r;
        })
        .get();

   result.push(json_to_sheet("data",data));
   

   metadata = new query()
    .from(FO.json2flat(dataset.metadata))
    .map( function(item){
        return {key:item.path,value:item.value}
    })
    .select(function(item){
        return item.key.indexOf(".values[]") == -1
    })
    .get();

   
   result.push(json_to_sheet("metadata", metadata));
   
   dictionary = new query()
    .from(dataset.dictionary)
    .select(function(item){
        return item.type !== 'i18n';
    })
    .map(function(item){
        r = {};
        flat = FO.json2flat(item);
        flat.forEach(function(e){
            r[e.path] = e.value;
        });
        return r;
    })
    .get(); 

   result.push(json_to_sheet("dictionary", dictionary));
   
    i18n = new query()
    .from(dataset.dictionary)
    .select(function(item){
        return item.type === 'i18n';
    })
    .map(function(item){
        r = {};
        delete item.type;
        flat = FO.json2flat(item);
        flat.forEach(function(e){
            r[e.path] = e.value;
        });
        return r;
    })
    .get(); 

   result.push(json_to_sheet("i18n", i18n));
   

   result = simpleXLSX.build(result);
   return result;
}

exports.saveXLS = function(filename , dataset){
      fs.writeFileSync(filename,exports.buildXLS(dataset));
}   


