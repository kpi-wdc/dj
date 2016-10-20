// Generate Scatter Series


var ReduceNull      = require("../table/reduce-nulls"),
    transposeTable  = require("../table/transpose");


module.exports = function(table,params){


  var axisXIndex = params.axisX || 0;
  var xValues = [];
  var categories = [];
  var base,role,format;
  var result = [];

  if ( !params.index ) return {};
  if ( params.index.length == 0 ) return {};


  table = ReduceNull(table,{
    reduce:{
      enable:true,
      direction:"Rows",
      mode:"Has Null"
    }
  })

  table = transposeTable(table,{transpose:true});

  
  if( params.category >= 0 ){
    categories = table.body[params.category].value.map(function(item){
      return item
    })
   }

  if( params.category < 0 ){
    categories = table.header.map(function(row){
      return row.metadata[-params.category-1].label
    });
  }

  var cats = categories
 
  var catList = [];
  cats.forEach(function(cat){
    if (catList.indexOf(cat) < 0) catList.push(cat)
  })  

  
  console.log("axisXIndex",axisXIndex);
  console.log("HEADER")
  table.header.forEach(function (item,index){console.log(index, item.metadata)})
  console.log("BODY")
  table.body.forEach(function (item,index){console.log(index, item.metadata)})


  if( axisXIndex>=0 ){
    xValues = table.body[axisXIndex].value.map(function(item){
      return item
    });
    base = table.body[axisXIndex].metadata.map(function(item){ return item.label}).join(", ");
    role = table.body[axisXIndex].metadata
              .filter(function(item){return item.role})
              .map(function(item){return item.role})[0];
  } else {
    xValues = table.header.map(function(row){
      return row.metadata[-axisXIndex-1].label
    });
    base = table.header[0].metadata[-axisXIndex-1].dimensionLabel;
    role = table.header[0].metadata[-axisXIndex-1].role
  }

  if(catList.length == 0){
    catList = [0];
    categories = [];
    table.body[0].value.forEach(function(item){
      categories.push(0)
    })
  }
  
  var $axisX = {
    label: base,
    role: role, //table.header[0].metadata[0].role,
    format:table.header[0].metadata[0].format
  }


   table.body.forEach(function(row,index){
    if(params.index.indexOf(index) >= 0){
      
      catList.forEach(function(cat, catIndex){
        result.push({
          "category" : cat,
          "key" : ((params.category) ? ("Category: "+cat+", ") : "")
            +row.metadata.map(function(item){ return item.label}).join(", "),
          "base" : base,
          "axisX": $axisX,
          // {
          //   role: table.header[0].metadata[0].role,
          //   format:table.header[0].metadata[0].format
          // },
          "values": row.value.map(function(item,j){
            return {
              "category" : categories[j],
              "x" : xValues[j],
              "y" : item,
              "label" : 
                row.metadata.map(function(item){ return item.label}).concat(
                table.header[j].metadata.map(function(item){ return item.label})).join(", ") 
            }
          })
        })  
      })
    }   
   })

   result.forEach(function(serie){
    serie.values = serie.values.filter(function(item){return item.category == serie.category})
   })

  return result; 
} 
