var setter = require("./set.js");
var getter = require("./get.js");

var obj1 = [{
		dataset:{
			id:1,
			topics:["1","2"],
			commit:{
				id: 11,
				text:"text1"
			}
		}
	},
	{
		dataset:{
			id:"{{2}}",
			topics:["3","4"],
			commit:{
				id: 22,
				text:"text2"
			}
		}
}]
var context = {};
setter(obj1,{"var":"b","value":{}}, undefined, undefined,context);

// console.log(JSON.stringify(context))

setter(obj1,
	{"var":"a","value":{firstdsTopics:"$[0].dataset.topics",lastTopic:"$..dataset.topics[1]"}}, 
	undefined, undefined,context);
// console.log(JSON.stringify(context))

// console.log(JSON.stringify(getter(undefined,undefined,undefined,undefined, context)))

console.log("{{@..dataset.id}}".match(/\{\{[\s\S]*\}\}/gi))