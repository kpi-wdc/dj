/**
* @module query
*/
var copyObject = require('copy-object');
var util = require("util");
var _ = require("lodash-node/compat/collection")
var date = require("date-and-time");

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
    from   : function(data){
        this.data = data;
        this.result = data;
        return this;    
    },

    concat : function(list){
      list = (list.forEach)? list : [list];
      this.data = [];
      var self = this;
      list.forEach(function(item){
        item = (item.forEach)? item : [item]
        self.data = self.data.concat(item)
      })
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

    select : function (criteria){
        if (this.data == undefined) throw "Cannot select items from undefined data"
        this.result = this.data.filter(criteria);
        this.data = this.result;
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
    orderBy : function (criteria){
       if (this.data == undefined) throw "Cannot sort items from undefined data"
       this.data.sort(criteria);
        return this;    
    },

    order : function(criteria){
      return this.orderBy(criteria)
    },

 /**
 * Remove duplicates from query result.
 *
 * @return {Query} Query
 * @this {Query}
 */  

    distinct : function(){

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
        return this;
    },

 /**
 * Maps items in query result.
 *
 * @param {callback} action callback function(item) returns new item
 * @return {Query} Query
 * @this {Query}
 */ 
    map : function(action){
        if (this.data == undefined) throw "Cannot map items for undefined data"
        var thos = this;
        this.result = [];
        this.data.forEach(function(item,index){
          tmp = action(item,index);
          if (!util.isArray(tmp)){ tmp = [tmp]};
          thos.result = thos.result.concat(tmp);
        })
        // this.result = this.data.map(action);
        this.data = this.result;
        return this;
    },

    wrap: function(pref){
        this.result = [];
        var thos = this; 
        this.data.forEach(function(item){
            var wrap = {};
            wrap[pref] = item
            thos.result.push(wrap)
        })
        this.data = this.result;
        return this;        
    },
    
    // left join implementation to do verify
    leftJoin : function(data, criteria){
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
        return this;
    }, 
    
    innerJoin : function(data, criteria){
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
        return this;
    },

    outerJoin: function(data,criteria){
        var thos = this;
        this.result = [];
        this.data.forEach(function(item,index){
            var newItem = copyObject(item);
            var f = false;
            data.forEach(function(element, index){
               
              if(criteria(item,element)){
                element.__joined = true;
                thos.result.push(copyObject(newItem,element));
                f = true;
              }
            });
            if(!f){
                thos.result.push(newItem);
            };
            // thos.result.push(newItem)
        });
        this.data = this.result.concat(data.filter(function(item){return !item.__joined}));
        data.forEach(function(item){ delete item.__joined})
        return this;
    },

    //param cb callback(value) returns {key,newValue}
    //returns ({key: ,values:[]}) 
    group : function(cb){
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
       return this;
    },

    //param cb callback({key,values}) returns {key,newValue}
    //returns ({key: ,value}) 
    reduce : function(cb){
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
/**
 * Returns query result.
 * @param {int} [k] count of records that retriev from result. 
 * In case k is undefined, returns all records.
 * @return {Array} Query result
 * @this {Query}
 */ 

    get : function(k){
      if( k == undefined || k <= 0) return this.data;
      this.result = this.data.slice(0, k);
      return this.result;
    },

    length: function(){
        return this.data.length;
    } 
}


Query.criteria = {

  "String" : {
    "A-Z" : function(selector){
      if(!selector){
          return function(a,b){
            return String.naturalCompare((a+'').toLowerCase(),(b+'').toLowerCase())
        }  
      }
      return function(a,b){
        return String.naturalCompare((selector(a)+'').toLowerCase(),(selector(b)+'').toLowerCase())
      }
    },
    "Z-A": function(selector){
      if(!selector){
       return function(a,b){
          return String.naturalCompare((b+'').toLowerCase(),(a+'').toLowerCase())
        } 
      }
        return function(a,b){
          return String.naturalCompare((selector(b)+'').toLowerCase(),(selector(a)+'').toLowerCase())
        }
    }   
  },

  "Number":{
    "A-Z" : function(selector){
      if(!selector){
          return function(a,b){
           return a-b
        }  
      }
        return function(a,b){
          return selector(a)-selector(b)
        }  
    },
    "Z-A": function(selector){
        if(!selector){
          return function(a,b){
           return b-a
        }  
      }
        return function(a,b){
          return selector(b)-selector(a)
        }
    }     
  },

  "Date": {
    "A-Z" : function(selector){
      if(!selector){
       return function(a,b){
          return date.subtract(new Date(a), new Date(b)).toMilliseconds();
        } 
      }
        return function(a,b){
          return date.subtract(new Date(selector(a)), new Date(selector(b))).toMilliseconds();
        }
    },  
    "Z-A": function(selector){
      if(!selector){
       return function(a,b){
          return date.subtract(new Date(b), new Date(a)).toMilliseconds();
        } 
      }
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
