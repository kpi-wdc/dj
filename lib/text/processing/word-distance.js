var _ = require("lodash-node");

var wordDistance = function(w1, w2) {
    var short, long;
    if(w1.indexOf(w2)>=0){
        return 1 - w2.length/w1.length
    }else if (w2.indexOf(w1)>=0) {
        return 1 - w1.length/w2.length
    }
    return 1;

    if (w1.length > w2.length) {
        short = _.values(w2)
        long = _.values(w1)
    } else {
        short = _.values(w1)
        long = _.values(w2)
    }
    var res = [];
    var l = short.length+long.length-1;
    var c = 0;
    for(var shift = -short.length+1; shift < long.length-1; shift++){
    	for(var pos=0; pos<short.length; pos++){
    		if(short[pos] && long[pos+shift] && short[pos]==long[pos+shift]){
    			c++
    		} else {
                c = (c<=3) ? 0 : c;
    			res.push(c)
    			c = 0;
    		}
    	}
    }
    return (1 - _.max(res)/long.length)
}

console.log("потік","тік", 1-wordDistance("потік","тік"))
console.log("україна","україні", 1-wordDistance("україна","україні"))
console.log("україна","проукр", 1-wordDistance("україна","проукраїнських"))
console.log("порядок","порошенко", 1-wordDistance("порядок","порошенко"))

var text = "за брехню в е-деклараціях порушили справи проти судді та мера на закарпатті".split(" ")
text.forEach(function(w){
    console.log("зустрівся", w,1-wordDistance("зустрівся",w))
})