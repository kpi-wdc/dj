var entity = require("./index.js").entity;
var typeOf = require("./index.js").typeOf;
var e = []
for(var type in entity){
	e.push(entity[type]("value1;value2;value3"))
}
e.push("a")
e.forEach(function(item){
	console.log(typeOf(item)+": "+JSON.stringify(item)+" : ")
	console.log(item.split(";"))
})