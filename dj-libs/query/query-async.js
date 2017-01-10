/**
* @module query
*/
var copyObject = require('copy-object');
var util = require("util");
var Promise = require('bluebird');

/**
 * Instantiate Query.
 * @requires copy-object
 * @constructor
 * @class
 * @this {Query}
 *
 */

var Query = function(data){
    this.data = undefined
    this.result = undefined;
    this.commands = [];
}

Query.prototype = {
 /**
 * Assigns data for query.
 *
 * @param {Array} data Data array
 * @return {Query} Query
 * @this {Query}
 * @example //Returns array 
 * //[
 * // {type:"visa",desc:"VISA"},
 * // {type:"tab",desc:"TAB"},
 * // {type:"cash",desc:"CASH"}
 * //]
 * 
 var query = require('query');
 *
 * var types = [
 *  {type:"visa",desc:"VISA"},
 *  {type:"tab",desc:"TAB"},
 *  {type:"cash",desc:"CASH"}
 * ];
 * 
 * var result = new query().from(types).get();
 */    
    _from   : function(data){
        this.data = data;
        this.result = data;
        return this;    
    },

    from : function(data){
       this.commands.push({cmd:"_from",data:data});
        return this;   
    },

    /** 
* Equil criteria callback returns true then item a equils item b
* @callback equilsCriteria
* @param {*} a first item to be compared
* @param {*} b second item to be compared
* @return {boolean} comparison result
*/

 /**
 * Select items from data by selectors.
 * @param {equilsCriteria} criteria callback that indicate selection
 *
 * @return {Query} Query
 * @exception "Cannot select items from undefined data"
 * @this {Query}
 */ 

    _select : function (criteria){
        if (this.data == undefined) throw "Cannot select items from undefined data"
        this.result = this.data.filter(criteria);
        this.data = this.result;
        // return this;
    },

    select : function(criteria){
       this.commands.push({cmd:"_select",cb:criteria});
        return this;   
    },


/** 
* Order criteria callback returns positive integer then item a more than item b
* @callback orderCriteria
* @param {*} a first item to be compared
* @param {*} b second item to be compared
* @return {boolean} comparison result
*/


/**
 * Sort items in query result.
 * @param {orderCriteria} criteria callback function
 *
 * @return {Query} Query
 * @this {Query}
 */
    _orderBy : function (criteria){
       if (this.data == undefined) throw "Cannot sort items from undefined data"
       this.data.sort(criteria);
        // return this;    
    },

    orderBy : function(criteria){
       this.commands.push({cmd:"_orderBy",cb:criteria});
       return this;   
    },

 /**
 * Remove duplicates from query result.
 *
 * @return {Query} Query
 * @this {Query}
 */  

    _distinct : function(){
        if (this.data == undefined) throw "Cannot remove dublicates items from undefined data"
  
        // this.result = [];
        this.result = {};
        var thos = this;
        this.data.forEach(function(item){
            var hash = JSON.stringify(item);
            if( !thos.result[hash]) thos.result[hash] = item
        });
        this.data = [];
        for(key in this.result) this.data.push(this.result[key])
        // this.data = this.result;
        // return this;
    },

    distinct : function(){
       this.commands.push({cmd:"_distinct"});
       return this;   
    },

 /**
 * Maps items in query result.
 *
 * @param {callback} action callback function(item) returns new item
 * @return {Query} Query
 * @this {Query}
 */ 
    _map : function(action){
        if (this.data == undefined) throw "Cannot map items for undefined data"
        var thos = this;
        this.result = [];
        this.data.forEach(function(item){
          tmp = action(item);
          if (!util.isArray(tmp)){ tmp = [tmp]};
          thos.result = thos.result.concat(tmp);
        })
        // this.result = this.data.map(action);
        this.data = this.result;
        // return this;
    },

    map : function(action){
       this.commands.push({cmd:"_map",cb:action});
       return this;   
    },


    _wrap: function(pref){
        this.result = [];
        var thos = this; 
        this.data.forEach(function(item){
            var wrap = {};
            wrap[pref] = item
            thos.result.push(wrap)
        })
        this.data = this.result;
        // return this;        
    },

    wrap : function(pref){
       this.commands.push({cmd:"_wrap", data:pref});
       return this;   
    },
    
    // left join implementation to do verify
    _leftJoin : function(data, criteria){
        var thos = this;
        this.result = [];
        this.data.forEach(function(item,index){
            var newItem = copyObject(item);
            var f = false;
            data.forEach(function(element, index){
               
              if(criteria(item,element)){
                 
                thos.result.push(copyObject(newItem,element));
                f = true;
              }
            });
            if(!f){thos.result.push(newItem)};
            // thos.result.push(newItem)
        });
        this.data = this.result;
        // return this;
    }, 

    leftJoin : function(data, criteria){
       this.commands.push({cmd:"_leftJoin", data:data, cb:criteria});
       return this;   
    },
    
    _innerJoin : function(data, criteria){
        var thos = this;
        this.result = [];
        this.data.forEach(function(item,index){
            data.forEach(function(element, index){
                var newItem = copyObject(item);
                if(criteria(item,element)){
                  newItem = copyObject(newItem,element)
                  thos.result.push(newItem); 
                }
            });
        });
        this.data = this.result;
        // return this;
    },

    innerJoin : function(data, criteria){
       this.commands.push({cmd:"_innerJoin", data:data, cb:criteria});
       return this;   
    },
    

    //param cb callback(value) returns {key,newValue}
    //returns ({key: ,values:[]}) 
   _group : function(cb){
      var thos = this;
       this.result = [];
       result = {};
       this.data.forEach(function(element){
           var tmp = cb(element);
           if(result[tmp.key] == undefined){
            result[tmp.key] = []; 
           }
           if(tmp.value!=undefined){
                result[tmp.key].push(tmp.value)
           }      
       });
       for(var k in result){
        this.result.push({key:k, values:result[k]})
       }
       this.result.groups = true;
       this.data = this.result;
       // return this;
    },

    group : function(mapper){
       this.commands.push({cmd:"_group", cb:mapper});
       return this;   
    },

    //param cb callback({key,values}) returns {key,newValue}
    //returns ({key: ,value}) 
    _reduce : function(cb){
       var thos = this;
       this.result = [];
       if(this.data.groups == undefined){
        this.data = [{key:"All",values:this.data}]
        this.data.groups = true;
       }
        this.data.forEach(function(element){
           thos.result.push(cb(element)) 
       });

       this.data = this.result;
       // return this;
    },

    reduce : function(action){
       this.commands.push({cmd:"_reduce", cb:action});
       return this;   
    },
 
 /**
 * Returns query result.
 * @deprecated
 * @see {@link get()} for further information
 * @return {Array} Query result
 * @this {Query}
 */ 

    execute: function(){
      return this.get();
    },

    _exec : function(resolve){
      var thos = this;
      // if(!this.result){
        this.commands.forEach( function(command) {
          if( command.cmd == "_from"){
            thos[command.cmd](command.data);
            return;
          }
          if (command.cmd == "_leftJoin" && command.cmd == "_innerJoin"){
            thos[command.cmd](command.data,command.cb);
            return;
          }  
          
          thos[command.cmd](command.cb)
        });
      // }  
      resolve(this.result);
    },

/**
 * Returns query result.
 * @return Promise
 * @this {Query}
 */ 

    get : function(){
      var thos = this;
      return new Promise(function(resolve){
        thos._exec(resolve);
      }); 
    },

    then: function(cb){
      var thos = this;
      var p = new Promise(function(resolve){
        thos._exec(resolve);
      }); 
      p.then(cb);
    }


}

Query.criteria = {

  "String" : {
    "A-Z" : function(selector){
      return function(a,b){
        return String.naturalCompare((selector(a)+'').toLowerCase(),(selector(b)+'').toLowerCase())
      }
    },
    "Z-A": function(selector){
        return function(a,b){
          return String.naturalCompare((selector(b)+'').toLowerCase(),(selector(a)+'').toLowerCase())
        }
    }   
  },

  "Number":{
    "A-Z" : function(selector){
        return function(a,b){
          return selector(a)-selector(b)
        }  
    },
    "Z-A": function(selector){
        return function(a,b){
          return selector(b)-selector(a)
        }
    }     
  },

  "Date": {
    "A-Z" : function(selector){
        return function(a,b){
          return date.subtract(new Date(selector(a)), new Date(selector(b))).toMilliseconds();
        }
    },  
    "Z-A": function(selector){
        return function(a,b){
          return date.subtract(new Date(selector(b)), new Date(selector(a))).toMilliseconds();
        }
    }    
  } 
}

module.exports = Query;

String.prototype.startWith = function(term){
  return this.indexOf(term)==0
}

String.prototype.endWith = function(term){
  return  this.match(term + "$") == term
}

String.prototype.contains = function(term){
  return this.indexOf(term)>=0
}

String.prototype.includes = String.prototype.contains; 

String.prototype.equals = function(term){
  return this == term
}

String.prototype.notEquals = function(term){
  return this != term
}

Array.prototype.contains = function(criteria){
  return this.filter(criteria).length > 0
}
