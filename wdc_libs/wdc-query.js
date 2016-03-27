/**
* @module query
*/
var copyObject = require('copy-object');
var util = require("util");

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

 /**
 * Remove duplicates from query result.
 *
 * @return {Query} Query
 * @this {Query}
 */  

    distinct : function(){
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
    map : function(action){
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

module.exports = Query;
