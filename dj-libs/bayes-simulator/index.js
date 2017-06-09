var date = require('date-and-time');
var Duration = require("duration-js");

var UNDEF_VALUE_NAME = "_undef";
var VIRTUAL_NODE_NAME_START = "_virtual-";

var validateBbnModel = function(bbnModel) {
	var Ajv = require('ajv');
	var fs = require('fs');
	var schema = JSON.parse(fs.readFileSync(require.resolve('./bbn_schema.json'), 'utf8'));
	var ajv = new Ajv();
	var validate = ajv.compile(schema);
	if (!validate(bbnModel)) throw new Error(validate.errors[0].message);
}

var makeBbn = function(bbnModel) {
	var jsbayes = require("./apea-jsbayes");
	var bbn = jsbayes.newGraph();
	for(var name in bbnModel.variables) {
		var domain = bbnModel.variables[name].domain;
		// making node
		domain.push(UNDEF_VALUE_NAME);
		bbn.addNode(name, domain);
	}
	for(var name in bbnModel.variables) {
		var variable = bbnModel.variables[name];
		var currNode = bbn.node(name);
		// setting parents
		for (var causeIndex in variable.causes) {
			currNode.addParent(bbn.node(variable.causes[causeIndex].ref));
		}
		// setting cpt
		var cpt = variable.cpt;
		if (!cpt) {
			var prob = 1 / currNode.values.length;
			var cpt = [];
			for (var i = 0; i < currNode.values.length; i++) {
				cpt.push(prob);
			}
		} else if (Array.isArray(cpt[0])) {
			cpt.forEach(function(row) {
				row.push(0);               // for _undef
			});
			// for _undef logic
			var row = new Array(currNode.values.length).fill(0);
			row[currNode.values.length-1] = 1;
			// period of inserting
			var l = 1;
			// how many insert rows: [0, 0, ..., 1]
			var n = 1;
			for (var i = currNode.parents.length-1; i>=0; i--) {	
				l = l*currNode.parents[i].values.length;
				for (var index=l-n; index <= cpt.length; index+=l) {
					for (var j = 1; j <= n; j++) {
						cpt.splice(index, 0, row);
					}
				}
				n = l;
			};
		} else {
			cpt.push(0);
		}
		currNode.setCpt(cpt);
	}
	return bbn;
}

var fetchIndicators = function(bbnModel) {
	var indicators = {};
	for(var name in bbnModel.variables) {
		if (bbnModel.variables[name].indicators) {
			indicators[name] = bbnModel.variables[name].indicators;
		}
	}
	return indicators;
}

/** return: the closest interval to tDate with considering period*/
var findPeriodicalIntervalFor = function(tDate, sDate, eDate, pDuration) {
	var period = pDuration.milliseconds();
	var difference = date.subtract(tDate, sDate).toMilliseconds();
	var remainder = difference % period;
	var offset = difference - remainder;
	offset += remainder >= 0 ? 0 : - period;
	var result = {};
	result.sDate = date.addMilliseconds(sDate, offset);
	result.eDate = date.addMilliseconds(eDate, offset);
	return result;
}

var isInInterval = function(tDate, sDate, eDate) {
	return date.subtract(tDate, sDate).toMilliseconds() >= 0 &&
			date.subtract(tDate, eDate).toMilliseconds() < 0;
}

var getTimePointsFromIndicators = function(indicators, fromT, toT) {
	var timePointsSet = new Set();
	for(var varName in indicators) {
		var varIndicators = indicators[varName];
		for(var valueName in varIndicators) {
			var indicator = varIndicators[valueName];
			var sDate = date.parse(indicator.start.stamp,
					indicator.start.format);
			var eDate = date.parse(indicator.end.stamp,
					indicator.end.format)
			var fromDate = date.parse(fromT.stamp, fromT.format);
			var toDate = date.parse(toT.stamp, toT.format);
			var pDuration = indicator.period ? new Duration(indicator.period) : undefined;
			if (pDuration) {
				interval = findPeriodicalIntervalFor(fromDate, sDate, eDate, pDuration);
				var period = pDuration.milliseconds();
				if (!isInInterval(interval.sDate, fromDate, toDate) &&
					!isInInterval(interval.eDate, fromDate, toDate) ) {
					sDate = date.addMilliseconds(interval.sDate, period);
					eDate = date.addMilliseconds(interval.eDate, period);
				} else if (isInInterval(date.addMilliseconds(interval.eDate, -period), fromDate, toDate)) {
					sDate = date.addMilliseconds(interval.sDate, -period);
					eDate = date.addMilliseconds(interval.eDate, -period);
				} else {
					sDate = interval.sDate;
					eDate = interval.eDate;
				}
			}

			do {
				var lDatePoint = sDate;
				var rDatePoint = eDate;

				if (!isInInterval(lDatePoint, fromDate, toDate) &&
					!isInInterval(rDatePoint, fromDate, toDate) &&
					!isInInterval(fromDate, lDatePoint, rDatePoint)) {
					break;
				}

				if(!isInInterval(lDatePoint, fromDate, toDate)) {
					lDatePoint = fromDate;
				}

				if (!isInInterval(rDatePoint, fromDate, toDate)) {
					rDatePoint = toDate;
				}
				timePointsSet.add(lDatePoint.getTime());
				timePointsSet.add(rDatePoint.getTime());

				if (indicator.distribution) {
					var distr = indicator.distribution;
					var i = 0;
					var iDate;
					do {
						var fromStart = new Duration(distr[i].fromStart).milliseconds();
						iDate = date.addMilliseconds(sDate, fromStart);
					} while(++i < distr.length && date.subtract(iDate, lDatePoint).toMilliseconds() <= 0);

					i--;
					for(; i < distr.length; i++) {
						var fromStart = new Duration(distr[i].fromStart).milliseconds();
						iDate = date.addMilliseconds(sDate, fromStart);
						if (isInInterval(iDate, lDatePoint, rDatePoint)) {
							timePointsSet.add(iDate.getTime());
						} else {
							break;
						}
    				}
				}
				if (pDuration) {
					var period = pDuration.milliseconds();
					sDate = date.addMilliseconds(sDate, period);
					eDate = date.addMilliseconds(eDate, period);
				}
			} while(pDuration && isInInterval(sDate, fromDate, toDate));
		}
	}
	var timePointsArray = [];
	timePointsSet.forEach(v => timePointsArray.push(v));
	return timePointsArray;
}

module.exports = function(bbnModel) {
	validateBbnModel(bbnModel);
	var bbnObj = makeBbn(bbnModel);
	var addNodeF = bbnObj.addNode;
	bbnObj.addNode = function(nodeName, values) {
		var node = addNodeF.call(this, nodeName, values);
		this.nodeMap = undefined;
		return node;
	}

	/** 
	 * Adding virtual evidence using hidden child node.
	 * Evidence looks like: {nodeValue1:prob1,... nodeValueN:probN}.
	 * If sum of probs < 1, than _undef=(1 - sum). 
	 */
	bbnObj.setVirtual = function(nodeName, evidence) {
		var node = this.node(nodeName);
		var probs = node.probs();
		if (probs.length == 0) {
			this.sample(10000);
			probs = node.probs();
		}

		var hiddenNodeName = VIRTUAL_NODE_NAME_START+nodeName;
		var hiddenNode = this.node(hiddenNodeName);
		if (!hiddenNode) {
			var hiddenNode = this.addNode(hiddenNodeName, ["active"]);
			hiddenNode.addParent(node);
		}
		var desired = new Array(probs.length);
		var desiredSum = 0;
		node.values.forEach(function(valueName, index) {
			desired[index] = evidence[valueName] ? evidence[valueName] : 0;
			desiredSum += desired[index];
		});
		desired[node.values.indexOf(UNDEF_VALUE_NAME)] = 1 - desiredSum;

		var hiddenNodeCpt = new Array(probs.length);
		var sum = 0;
		probs.forEach(function(prob, index) {
			hiddenNodeCpt[index] = prob != 0 ? [desired[index] / prob] : [0];
			sum += hiddenNodeCpt[index][0];
		});
		for (var i = 0; i < hiddenNodeCpt.length; i++) {
			hiddenNodeCpt[i][0] = hiddenNodeCpt[i][0]/sum;
		}
		hiddenNode.setCpt(hiddenNodeCpt);
		this.observe(hiddenNodeName, "active");
	}

	bbnObj.setEvidence = function(nodeName, evidence) {
		if (typeof evidence === "object") {
			this.setVirtual(nodeName, evidence);
		} else {
			this.observe(nodeName, evidence);
		}
	}

	return {
		bbn: bbnObj,
		indicators: fetchIndicators(bbnModel),

		// hides everything about hidden nodes and undefined values
		getConclusions: function(evidences, sampleNum) {
			if (!sampleNum) {
				sampleNum = 10000;
			}
			for (var nodeName in evidences) {
                this.bbn.setEvidence(nodeName, evidences[nodeName]);
            }

            this.bbn.sample(sampleNum);
            var conclusions = {};
            this.bbn.nodes.forEach(function(node) {
            	if (!node.name.startsWith(VIRTUAL_NODE_NAME_START)) {
	                var probs = node.probs();
	                var conclusion = {};
	                node.values.forEach(function(valueName, index) {
	                    conclusion[valueName] = probs[index];
	                });
	                conclusion[UNDEF_VALUE_NAME] = undefined;
	                conclusions[node.name] = conclusion;
            	}
            });
            return conclusions;
		},

		getEvidences: function(t) {
			var evidences = {};
			for(var varName in this.indicators) {
				evidences[varName] = {};
				var varIndicators = this.indicators[varName];
				for(var valueName in varIndicators) {
					var indicator = varIndicators[valueName];
					var sDate = date.parse(indicator.start.stamp,
							indicator.start.format);
					var eDate = date.parse(indicator.end.stamp,
							indicator.end.format)
					var tDate = date.parse(t.stamp, t.format);

					if (indicator.period) {
						interval = findPeriodicalIntervalFor(tDate, sDate, eDate, new Duration(indicator.period));
						sDate = interval.sDate;
						eDate = interval.eDate;
					}

					if (isInInterval(tDate, sDate, eDate)) {
						if (!indicator.distribution) {
							evidences[varName] = valueName;
							break;
						}
						var distr = indicator.distribution;
						for(var i=distr.length-1; i >=0; i--) {
							var fromStart = new Duration(distr[i].fromStart).milliseconds();
							var iDate = date.addMilliseconds(sDate, fromStart);
							if (isInInterval(tDate, iDate, eDate)) {
								evidences[varName][valueName] = distr[i].prob;
								break;
							}
        				}
					}
				}
				if (typeof evidences[varName] === "object" &&
						Object.keys(evidences[varName]).length === 0) {
					for(var valueName in varIndicators) {
						evidences[varName][valueName] = 0;
					}
        		}
			}
			return evidences;
		},

		/** eventNames in format: "varName=value" or "varName" */
		getIndicatorsData: function(eventNames, fromT, toT) {
			var timePoints = getTimePointsFromIndicators(this.indicators, fromT, toT);
			timePoints.sort(function(p1,p2) { 
			    return p1-p2; 
			});

			var data = [];
			var thisRef = this;
			timePoints.forEach(function(tPoint) {
				var datePoint = new Date(tPoint);
				var format = "YYYY-MM-DD HH:mm:ss:SSS";
				var evidsAtT = thisRef.getEvidences({format:format, stamp:date.format(datePoint, format)});
				var probs = [];

				eventNames.forEach(function(eventName) {
					var names = eventName.split("=");
					var node = thisRef.bbn.node(names[0]);
					var evid = evidsAtT[names[0]] ? evidsAtT[names[0]] : {};
					if (typeof evid === "string") {
						var valueName = evid;
						evid = {};
						evid[valueName] = 1;
					}

					if (names.length == 1) {
						node.values.forEach(function(valueName) {
							probs.push(evid[valueName] ? evid[valueName] : 0);
						});
						probs.splice(node.values.indexOf(UNDEF_VALUE_NAME), 1);
					} else {
						probs.push(evid[names[1]] ? evid[names[1]] : 0)
					}
				});
				data.push({t:datePoint, indic:probs});
			});
			return data;
		},

		getSituationData: function(evidences, fromT, toT, sampleNum) {
			var vect = require("vect");	
			if (!sampleNum) {
				sampleNum = 10000;
			}
			for (var nodeName in evidences) {
                this.bbn.setEvidence(nodeName, evidences[nodeName]);
            }
            this.bbn.sample(sampleNum);

            var currVectors = {};
            var vectorNum = 0;
			for(var varName in this.indicators) {
				var vector = [];
				var node = this.bbn.node(varName);
				var probs = node.probs();
				node.values.forEach(function(valueName, index) {
					vector[index] = probs[index];
				});
				currVectors[varName] = vector;
				vectorNum++;
			}

			// gain points
			var timePoints = getTimePointsFromIndicators(this.indicators, fromT, toT);
			timePoints.sort(function(p1,p2) { 
			    return p1-p2; 
			});

			var data = [];
			var thisRef = this;
			timePoints.forEach(function(tPoint) {
				var datePoint = new Date(tPoint);
				var format = "YYYY-MM-DD HH:mm:ss:SSS";
				var evidsAtT = thisRef.getEvidences({format:format, stamp:date.format(datePoint, format)});
				var cosSum = 0;
				for (var varName in currVectors) {
					var evid = evidsAtT[varName];
					if (typeof evid === "string") {
						var valueName = evid;
						evid = {};
						evid[valueName] = 1;
					}
					var vector = [];
					var probSum = 0;
					var node = thisRef.bbn.node(varName);
					node.values.forEach(function(valueName, index) {
						var prob = evid[valueName] ? evid[valueName] : 0;
						vector.push(prob);
						probSum += prob;
					});
					vector[node.values.indexOf(UNDEF_VALUE_NAME)] = 1 - probSum;
					cosSum += vect.angle(currVectors[varName], vector);
				}
				data.push({t:datePoint, con:cosSum/vectorNum});
			});
			return data;
		}
	}
}