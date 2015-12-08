/**
* @module query
*/
var copyObject = require('copy-object');
var util = require("util");
var Promise = require("bluebird");
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
    from   : function(data){
        this.data = data;
        this.result = data;
        return this;    
    },

    select : function (criteria){
        this.commands.push({cmd:"_select",cb:criteria});
        return this;
    },
    orderBy : function (criteria){
        this.commands.push({cmd:"_orderBy",cb:criteria});
        return this;
    },
    distinct : function(){
        this.commands.push({cmd:"_distinct"});
        return this;
    },
    map : function(action){
        this.commands.push({cmd:"_map",cb:action});
        return this;
    },
    wrap: function(pref){
        this.commands.push({cmd:"_wrap",cb:pref});
        return this;
    },
    
    // left join implementation to do verify
    leftJoin : function(data, criteria){
        this.commands.push({cmd:"_leftJoin",cb:criteria,"data":data});
        return this;
    }, 
    
    innerJoin : function(data, criteria){
        this.commands.push({cmd:"_innerJoin",cb:criteria,"data":data});
        return this;
    },

    //param cb callback(value) returns {key,newValue}
    //returns ({key: ,values:[]}) 
    group : function(cb){
        this.commands.push({cmd:"_group","cb":cb});
        return this;
    },

    //param cb callback({key,values}) returns {key,newValue}
    //returns ({key: ,value}) 
    reduce : function(cb){
        this.commands.push({cmd:"_reduce","cb":cb});
        return this;
    },
 
 /**
 * Returns query result.
 * @deprecated
 * @see {@link get()} for further information
 * @return {Array} Query result
 * @this {Query}
 */ 

  exec : function(resolve,reject){
    // console.log(this)
    this.resolve = resolve;
    var thos = this;
    setTimeout(
      function(){
        for(i in this.commands){
          var command = this.commands[i];  
          // console.log(command)
          if(command.cmd != "leftJoin" && command.cmd != "innerJoin"){
            this[command.cmd](command.cb)
          }else{
            this[command.cmd](command.data,command.cb)
          }  
        }
        this.resolve(this.result);  
      }.bind(thos)
      ,0);
  },

  execute: function(){
    thos = this;
    return new Promise(thos.exec.bind(thos)) 
  },
/**
 * Returns query result.
 * @param {int} [k] count of records that retriev from result. 
 * In case k is undefined, returns all records.
 * @return {Array} Query result
 * @this {Query}
 */ 

  get : function(){
    return this.execute()
  },

  // length: function(){
  // }

  //-------------------------------------------------------------------------------------------- 

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
  
        this.result = [];
        var thos = this;
        this.data.forEach(function(item){
            var notExists = true;
            thos.result.forEach(function(r){
                if(util.isObject(item)){
                  for(key in item){
                      notExists &= item[key] != r[key];
                  }
                }else{
                  notExists &= item != r;
                }
            })
            if(notExists == true) thos.result.push(item)
        });
        this.data = this.result;
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
            
        });
        this.data = this.result;
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
       return this;
    },
 
 /**
 * Returns query result.
 * @deprecated
 * @see {@link get()} for further information
 * @return {Array} Query result
 * @this {Query}
 */ 

    _execute: function(){
      return this.get();
    },
/**
 * Returns query result.
 * @param {int} [k] count of records that retriev from result. 
 * In case k is undefined, returns all records.
 * @return {Array} Query result
 * @this {Query}
 */ 

    _get : function(k){
      if( k == undefined || k <= 0) return this.data;
      this.result = this.data.slice(0, k);
      return this.result;
    },

    _length: function(){
        return this.data.length;
    } 
}

module.exports = Query;
