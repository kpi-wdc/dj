var Parser = require("../../wdc-parser");
var Promise = require("bluebird");
var Query = require('../../wdc-query');
var util = require("util");
var FO = require("../../wdc-flat");
var date = require('date-and-time');
var copyObject = require('copy-object');
var glob = require("glob")
var date = require('date-and-time');
require('string-natural-compare');
var Coder = require("../../wdc-coder");
var downloadData = require("./download"); 
var STAT = require("./stat")

var timePeriod = {
		millisecond: 	"YYYY MM DD HH mm ss SSS",
		second: 		"YYYY MM DD HH mm ss",
		minute: 		"YYYY MM DD HH mm",
		hour: 			"YYYY MM DD HH",
		day: 			"YYYY MM DD", 
		month: 			"YYYY MM",
		year: 			"YYYY"
}

var datasetIdMarkerFormat = {
		millisecond: 	"YYYY_MM_DD_HH_mm_ss",
		second: 		"YYYY_MM_DD_HH_mm",
		minute: 		"YYYY_MM_DD_HH",
		hour: 			"YYYY_MM_DD",
		day: 			"YYYY_MM", 
		month: 			"YYYY",
		year: 			"_"
}

var datasetLabelMarkerFormat = {
		millisecond: 	"YYYY.MM.DD HH:mm:ss",
		second: 		"YYYY.MM.DD HH:mm",
		minute: 		"YYYY.MM.DD HH:[00]",
		hour: 			"YYYY.MM.DD",
		day: 			"YYYY.MM", 
		month: 			"YYYY",
		year: 			"_"
}

var valueLabelFormat = {
		millisecond: 	"YYYY/MM/DD HH:mm:ss:SSS",
		second: 		"YYYY/MM/DD HH:mm:ss",
		minute: 		"YYYY/MM/DD HH:mm",
		hour: 			"YYYY/MM/DD HH:[00]",
		day: 			"YYYY/MM/DD", 
		month: 			"YYYY/MM",
		year: 			"YYYY"
}

var valueTimePattern = {
		millisecond: 	timePeriod.millisecond,
		second: 		timePeriod.second,
		minute: 		timePeriod.minute,
		hour: 			timePeriod.hour,
		day: 			timePeriod.day, 
		month: 			timePeriod.month,
		year: 			timePeriod.year
}

var aggregations = {
		avg: STAT.mean,
		mean: STAT.mean,
		min: STAT.min,
		max: STAT.max,
		std: STAT.std,
		range:STAT.range,
		sum: STAT.sum
}


module.exports = function(dataset){

	var result = [];
	
	var truncDate = function(d,period){
		return date.parse(date.format(new Date(d),period),period)
	}
	
	var clone = function(obj){
		return FO.flat2json(FO.json2flat(obj))
	}


	var periodicity = dataset.metadata.layout.aggregation.periodicity;
	var aggregationMethod = aggregations[dataset.metadata.layout.aggregation.method];
	
	
	periodicity.forEach(function(period){
		var tp = timePeriod[period];
		var vtp = valueTimePattern[period];
		var r = copyObject(dataset);
		r.data = new Query()
				.from(r.data)
				.map(function(item){return {
						period: period,
						datasetId: date.format(truncDate(item.time,tp),datasetIdMarkerFormat[period]),
						datasetLabel: date.format(truncDate(item.time,tp),datasetLabelMarkerFormat[period]),
						time : truncDate(item.time,vtp),
						"#value":item["#value"],
						"indicator":item["indicator"],
						"#indicator":item["#indicator"]
					}
				})
				.group(function(item){
					return {key:item.datasetId, value:item}
				})
				.map(function(g){

					var values = new Query()
						.from(g.values)
						.group(function(item){
							return {
								key:item.time,
								value:item
							}
						})
						.map(function(g){
							var values = new Query()
								.from(g.values)
								.group(function(item){
									return{
										key:item["#indicator"],
										value:item
									}
								})
								.map(function(g){
									return {
										"time" : date.format(g.values[0].time,valueLabelFormat[g.values[0].period]),
										"#time" : date.format(g.values[0].time,valueLabelFormat[g.values[0].period]),
										"indicator" : g.values[0]["indicator"],
										"#indicator" : g.values[0]["#indicator"],
										"#value": aggregationMethod(g.values.map(function(d){return d["#value"]}))
									}
								})
								.get()

							return values
						})
						.get()

					return {
						datasetId: g.key,
						datasetLabel: g.values[0].datasetLabel,
						periodicity: g.values[0].period,
						data: values
					}
				})
				.get() 
		result = result.concat(r.data);
	})

	
	var getValueList = function(property,data){
		return new Query()
	          .from(data)
	          .map(function (item) {
	            return {
	              id: item["#"+property], 
	              label:item[property]
	            }
	          })
	          .distinct()
	          .orderBy(function (a, b) {
	          	if(util.isDate(a.id)){
	          		return (
	          			(date.subtract(new Date(a.id), new Date(b.id)).toMilliseconds()<0)
	          				? -1
	          				: 1
	          		)		
	          	}
	          	if(util.isString(a.id)){
	          		String.naturalCompare(a.id.toLowerCase(),b.id.toLowerCase())
	          	}

	            return a.id - b.id
	          })
	          .get();

	}

	var datasetGroup = [];
	

	result.forEach(function(d,index){
		var r = {}
		r.metadata =clone(dataset.metadata);
		r.validation = clone(dataset.validation);
		r.dictionary = (index == 0) ? dataset.dictionary : [];

		r.metadata.dataset.periodicity = d.periodicity;
		r.metadata.dataset.id +="_"+d.datasetId;
		r.metadata.dataset.ext ="( "+d.datasetLabel+" )";
		r.data = d.data;

		for(var dim in r.metadata.dimension){
			r.metadata.dimension[dim].values = getValueList(dim,r.data)
		}	

		// if(r.metadata.dimension[dim].scale == "ordinal"){
	 //    	r.metadata.dimension[dim].range = [
	 //    		date.format(r.metadata.dimension[dim].values[0],valueLabelFormat[d.periodicity]),
	 //    		date.format(r.metadata.dimension[dim].values[r.metadata.dimension[dim].values.length-1],valueLabelFormat[d.periodicity])
	 //    	] 
	 //    } 

	    r.metadata.layout.sheet = "data";
	    r.metadata.layout.value = "Value";
	    r.metadata.layout.indicator.id = "indicatorAbbr";
		r.metadata.layout.indicator.label = "indicator";
		r.metadata.layout.time = {id : "timestamp", label : "timestamp"};




		datasetGroup.push(r);
	})

	return datasetGroup;
}