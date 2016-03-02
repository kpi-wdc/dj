var Cache = require("./Cache");






module.exports = {

  getQuery: function(req,resp){
    var q = req.body;
    sails.log.debug("getQuery",q)
    
    Cache.get(q)
      .then(function(res){
        sails.log.debug(res)
    
        if (res){
          return resp.send(res)
        }
        return resp.send({})   
      })
  },
  getID: function(req,resp){
    var id = req.params.id;
    sails.log.debug("getID")
    
    Cache.get(id)
      .then(function(res){
        sails.log.debug(res)
    
        if (res){
          return resp.send(res)
        }
        return resp.send({})   
      })
  },
  save: function(req,resp){
    var obj = req.body;
    sails.log.debug("Save",obj)
    var p = Cache.save("a",{q:"aaa"},obj);
    p.then(function(o){
        return resp.send(o)
      })
  },
  
  clear: function(req,resp){
    Cache.clear()
      .then(function(){
        return resp.ok()
      })
  },

  list: function(req,resp){
    sails.log.debug("List")
    Cache.list()
      .then(function(obj){
        sails.log.debug(obj)
        return resp.send(obj)
      })
  }

};


