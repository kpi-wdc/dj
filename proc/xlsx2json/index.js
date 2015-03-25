var fs = require('fs');
var LINQ = require('node-linq').LINQ;
var XLSX = require('node-xlsx');

exports.get = function(filename) {
    var dimensionMap = [];
    var obj = XLSX.parse(filename);
    var result = {};

    var metadata = new LINQ(obj)
        .Where(function(sheet){
            return sheet.name === "metadata";
        })
        .ToArray()[0]
        .data;
    var data = new LINQ(obj)
        .Where(function(sheet){
            return sheet.name === "data";
        })
        .ToArray()[0]
        .data;
    var dataFields = {};
    data[0].forEach(function(item,index){
        dataFields[item] = index;
    })
    var datasetName = getMetadataValue(metadata,"dataset");
    result[datasetName] = {};
    result[datasetName].note = getMetadataValue(metadata,"dataset.note");
    result[datasetName].label = getMetadataValue(metadata,"dataset.label");
    result[datasetName].updated = getMetadataValue(metadata,"dataset.updated");
    result[datasetName].status = getMetadataValue(metadata,"dataset.status");
    result[datasetName].source = getMetadataValue(metadata,"dataset.source");
    result[datasetName].dimension = {};
    result[datasetName].dimension.id = getMetadataArray(metadata,"dimension.id");
    result[datasetName].dimension.role = {};
    result[datasetName].dimension.role.geo = getMetadataArray(metadata,"role.geo");
    result[datasetName].dimension.role.time = getMetadataArray(metadata,"role.time");
    result[datasetName].dimension.role.metric = getMetadataArray(metadata,"role.metric");
    result[datasetName].dimension.size = [];
    result[datasetName].dimension.id.forEach(
        function(id) {
            var idFieldName = getMetadataValue(metadata,id+".category.id");
            var labelFieldName = getMetadataValue(metadata,id+".category.label");
            result[datasetName].dimension[id] = {};
            result[datasetName].dimension[id].label = getMetadataValue(metadata,id+".label");
            result[datasetName].dimension[id].category = {};
            result[datasetName].dimension[id].category.index = getID(data, idFieldName,dimensionMap);
            result[datasetName].dimension[id].category.label = getLabel(data, idFieldName, labelFieldName);
            result[datasetName].dimension.size.push(Object.keys(result[datasetName].dimension[id].category.label).length);
        }
    );
    result[datasetName].value = [];
    var valueIndex = dataFields[getMetadataValue(metadata,"dataset.value")];
    var getDataValue = function(level,indexes,body){
        if (level == indexes.length-1){
            return new LINQ(body)
                .Where(function(item){
                    return item[dataFields[dimensionMap[level].field]] === dimensionMap[level].values[indexes[level]];
                })
                .Select(function(item){
                    return item[valueIndex];
                })
                .ToArray()[0]
        }
        return getDataValue(level+1,indexes,
            new LINQ(body)
                .Where(function(item){
                    return item[dataFields[dimensionMap[level].field]] === dimensionMap[level].values[indexes[level]];
                })
                //.Select(function(item){return item[valueIndex]})
                .ToArray()
        )
    }
    var forEachIndexes = function (level,size,current){
        if(size.length == current.length){
            result[datasetName].value.push(getDataValue(0,current,data));
            return;
        }
        var currentValue = 0;
        while (currentValue < size[level]){
            current.push(currentValue);
            forEachIndexes(level+1,size,current);
            current.pop();
            currentValue++;
        }
    }
    forEachIndexes(0,result[datasetName].dimension.size ,[]);
    return result;
}

function getMetadataValue(metadata,key){
        return new LINQ(metadata)
            .Where(function(item){
                return item[0] === key;
            })
            .Select(function(item){
                return item[1];
            })
            .ToArray()[0];
    }

function getMetadataArray(metadata,key){
    var result = new LINQ(metadata)
        .Where(function(item){
            return item[0] === key;
        })
        .ToArray()[0];
    if(result){
        return result.filter(function (item, index){
            return index>0;
        });
    }
    return undefined;
}

function getID(data,field,dimensionMap){
    var fields = {};
    data[0].forEach(function(item,index){
        fields[item] = index;
    })
    var a = new LINQ(data)
        .Select(function(item){
            return item[fields[field]];
        })
        //.Distinct()
        .ToArray();
    if(a) {
        a = new LINQ(a.filter(function (item, index) {
            return index > 0;
        }))
        .OrderBy(function(item){
            return item;
        })
        .ToArray();
        dimensionMap.push({field:field, values:a});
        var result = {};
        a.forEach(function(item,index){
            result[item] = index;
        });
        return result;
    }
    return undefined;
}

var getLabel = function(data,idField,labelField){
    var fields = {};
    data[0].forEach(function(item,index){
        fields[item] = index;
    })
    var a = new LINQ(data)
        .Select(function(item){
            return {
                id : item[fields[idField]],
                label : item[fields[labelField]]
            };
        })
        //.Distinct()
        .ToArray();
    if(a) {
        a = a.filter(function (item, index) {
            return index > 0;
        });
        var result = {};
        a.forEach(function(item,index){
            result[item.id] = item.label;
        })
        return result;
    }
    return undefined;
}
