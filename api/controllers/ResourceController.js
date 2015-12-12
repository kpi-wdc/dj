var mime = require('mime');
var path = require('path');






module.exports = {

  getList: function (req,res){
    Resource.find({}).then(function(obj){
      if(!obj || obj.length == 0){
        return res.send([]);
      }else{
        obj.forEach(function(item){
          item.size = item.data.buffer.length;
          delete item.data;
          item.mime = mime.lookup(path.basename(item.path));
          var p = path.parse(item.path)
          item.ext = p.ext.substring(1);
          item.url = "./api/resource/"+item.path;

        })
        return res.send(obj)
      }  
    })
  },

  get: function (req, res) {
    var resourcePath = req.params.path;
    Resource.findOne({"path":resourcePath}).then(function(obj){
      if(!obj){
        return res.notFound();
      }
      res.setHeader('Content-type', mime.lookup(path.basename(obj.path)));
      return res.send(obj.data.buffer);
    })
  },

  delete: function (req, res) {
    resourcePath = req.params.path;
    Resource.destroy({"path":resourcePath}).then(function(obj){
      return res.ok();
    })
  },

  rename: function(req,res){
    var params = req.body;
    var oldPath = params.oldPath;
    var newPath = params.newPath;
    var app = params.app;
    Resource.findOne({"path":oldPath}).then(function(obj){
      if(!obj){
        return res.ok();
      }else{
        Resource.update({id:obj.id},{"path":newPath}).then(function(){
          return res.ok();
        })
      }
    })
    
  },

  update: function (req, res) {

    var app = req.param("app");
    
    req.file('file').upload({},
      function (err, uploadedFiles) {
        
        if (err) {
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        filePath = app+"-"+uploadedFiles[0].filename;
    
        fs.readFile(uploadedFiles[0].fd, 
          function (err, data) {
            
            if (err) {
              sails.log.error('Error reading file: ' + filePath);
            }
            
            Resource
              .findOne({"path":filePath})
              .then(function(obj){
                if(obj){
                  Resource
                    .update({id:obj.id},{"path":filePath, "data":data, "owner":req.user.name})
                    .then(function(){
                          return res.ok()
                    })
                }else{
                  Resource
                    .create({"path":filePath, "data":data,"owner":req.user.name})
                    .then(function(obj){
                          return res.ok()
                  })
                }    
              });
            }); 
      });  
    }
};


