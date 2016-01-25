import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-search-result', ['app.dictionary','ngFileUpload'])
  .controller('DataManagerSearchResultController', function ($scope, $http, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate,$modal, user) {
    

    const eventEmitter = new EventEmitter($scope);
    $scope.lookup = $lookup;
    $scope.breadcrums = [];
    $scope.tagList = [];
    $scope.user = user;
    $scope.total = 0;
    $scope.table = undefined;
    
    $scope.key = undefined; 

    var formatDate = function(date){
      var locale = $translate.use() || "en";
      date = new Date(date);
      date = date.toLocaleString(locale,
        { year: 'numeric',  
          month: 'long',  
          day: 'numeric', 
          hour: 'numeric',  
          minute: 'numeric',
          second: 'numeric'
        })
      return date;
    }

     $scope.formatDate = formatDate;

    var addListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            return;
          }
        }
        subscriptions.push(listener);
      };
      
    var removeListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            subscriptions.splice(i, 1);
            return
          }
        }
      };

    var searchDatasets = function(query){
          if(query){
            $scope.total = 0;
            $scope.query = query;
            var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
            $http.post("./api/metadata/items", {"query":query, "status":status}).success(
              function(resp){
                $scope.result = resp;
                $scope.result.forEach((item) => {item.collapsed=false});
                $scope.total = $scope.result.length;
                if(resp.length == 0){
                   eventEmitter.emit("slaveVisibility",true);
                 }else{
                   eventEmitter.emit("slaveVisibility",false);
                 }
            });
          }
    }

    $scope.download = function(item){
      item.download = true;
      $http.get("./api/dataset/download/"+item.dataset.id)
        .success(function(){
          item.download = false;
        })
    }

    $scope.selectSource = function(key){
      eventEmitter.emit('setLookupKey', key);
      let query = [{"dataset.source":[{equals:key}]}];
      searchDatasets(query);
    }

    $scope.selectTopic = function(key){
      eventEmitter.emit('setLookupKey', key);
      let query = [{"dataset.topics":[{includes:key}]}];
      searchDatasets(query);
    }

    $scope.lookup = $lookup;
   

    var prepareTopics = function(topics){
      var simple_topics = [];
      topics = (topics.forEach) ? topics : [topics];
      topics.forEach(function(item){
        item.split("/").forEach(function(t){
          if(simple_topics.filter(function(s){return s === t}).length === 0){simple_topics.push(t)}
        });
      })
      return simple_topics;
    }

    $scope.prepareTopics = prepareTopics;

    
    $scope.openQueryDialog = function(item){
      $modal.open({
        templateUrl: "./widgets/dm-search-result/query-modal.html",
        controller: 'QueryDialogController',
        backdrop: 'static',
        resolve: {
          item() {return item },
          prepareTopics() {return prepareTopics},
          table() {return $scope.table},
          formatDate() { return formatDate}
        }  
      }).result.then(
        () => {
          // console.log("Close Query DIALOG")
          if(item.tableID){
            $http.get("./api/table/delete/"+item.tableID)
              .success(function(){
                item.tableID = undefined;
              });
          }
        },
        () => {
          // console.log("Cancel Query DIALOG",resp)
          // console.log(item.tableID)
          if(item.tableID){
            
            $http.get("./api/table/delete/"+item.tableID)
              .success(function(){
                item.tableID = undefined;
              });
          }
        }
      );
    }


     $scope.openManageDialog = function(item){
      $modal.open({
        templateUrl: "./widgets/dm-search-result/manage-modal.html",
        controller: 'ManageDialogController',
        backdrop: 'static',
        resolve: {
          item() {return item },
          prepareTopics() {return prepareTopics},
          formatDate() { return formatDate}
        }  
      }).result.then(
            () => {
               // console.log("Close MANAGE DIALOG",item);
               eventEmitter.emit('refresh');
            },
            () => {
               // console.log("Cancel MANAGE DIALOG",item);
               eventEmitter.emit('refresh');
            }
      );
    }


    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        // $scope.query = $scope.widget.query || $scope.query;
        // searchDatasets($scope.query);
        // 
        if($scope.total == 0){
          eventEmitter.emit("slaveVisibility",true);
        }else{
          eventEmitter.emit("slaveVisibility",false);
        }

        if($scope.key){
          $scope.object = $lookup($scope.key);
        }else{
          $scope.object = undefined;
        }

        $scope.listeners = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setLookupKey"
        })

        pageSubscriptions().addListeners(
          $scope.listeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setLookupKey",
                slot: "setLookupKey"
            }
          })
        );
        

        $scope.rlisteners = ($scope.widget.rlisteners) ? $scope.widget.rlisteners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "refresh"
        })
        
        pageSubscriptions().addListeners(
          $scope.rlisteners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "refresh",
                slot: "refresh"
            }
          })
        );
       
      })
      .provide('searchQuery', (evt, value) => {
        $scope.query = value;
        // console.log("SEARCH",evt, $scope.query)
        searchDatasets(value);
      })
      .provide('refresh', (evt) => {
        // console.log("REFRESH", $scope.query);
        searchDatasets($scope.query);
      })

      .provide('setLookupKey', (evt, value) => {
        // console.log("LOOKUP",evt,value)
        $scope.key = value;
        let tmp = $lookup($scope.key);
        if($scope.key == tmp || tmp.en){
          // $scope.object = undefined;
          $scope.object = {label:$scope.key};
        }else{
          $scope.object = tmp;
        }
      })
      
      .removal(() => {
        console.log('Find Result widget is destroyed');
      });
  })








.controller("ManageDialogController", function ($scope, $modalInstance,$http, $upload, $timeout,
                                                item, prepareTopics,formatDate, $lookup,
                                                $translate, user, confirm){
  
  $scope.item = item;
  $scope.lookup = $lookup;
  $scope.prepareTopics = prepareTopics;
  $scope.user = user;
  $scope.upload_process = false;
  
  $scope.formatDate = formatDate;

  $scope.fileSelected = function(f,e){
    var files = f;
    
    $scope.formUpload = false;
    if (files != null) {
        $scope.commits = undefined;
        for (var i = 0; i < files.length; i++) {
          $scope.errorMsg = null;
          (function(file) {
              $scope.upload(file);
          })(files[i]);
        }
    }
  };

  $scope.upload = function (file) {
    $scope.upload_process = true;
    $upload.upload({
      url: './api/dataset/update',
      method: 'POST',
      headers: {
        'my-header' : 'my-header-value'
      },
      file: file,
    })
    .then(function(response) {
        $scope.upload_process = false;
        $lookup.reload();
        $scope.item = response.data.metadata;
        $timeout(function() {
        $scope.getCommitList();
      });
    });
  }
  

  $scope.headStyle = function(f){
    return (f)?{"font-weight": 900, "color":"darkorange"}:{}
  }
  
  $scope.headRowStyle = function(f){
    return (f)?{
      "background-color":"rgba(160, 211, 232, 0.31)",
      "font-size":"smaller",
      "font-weight": "bold",
      "padding":"0.1rem 0.5rem"
    }
    :{
      "font-size":"smaller",
      "color":"orangered",
      "padding":"0.1rem 0.5rem"
    }
  }

  $scope.upToHEAD = function(c){
    $scope.commits = undefined;
    $http.get("./api/commit/head/"+c.metadata.dataset.commit.id)
      .success(function(resp){
        $scope.item = resp.metadata;
        $scope.getCommitList();        
      })

  }

  $scope.setCommitStatus = function(commitID,status){
    $http.get("./api/commit/"+status+"/"+commitID)
      .success(function(resp){
        $scope.item = resp.metadata;
        $scope.getCommitList();
      })
  }

  $scope.deleteCommit = function(c){
    $scope.commits = undefined;
    $http.get("./api/commit/delete/"+c.metadata.dataset.commit.id)
      .success(function(){
        $scope.getCommitList();        
      })
  }

  $scope.deleteDataset = function(c){
    confirm("You will remove the dataset "+c.metadata.dataset.id+". You can download it before removing. Are you sure?")
      .then(function(){
        $scope.item = undefined;
        $scope.deleteCommit(c);
      })
  }

  $scope.selectDataset = function(d){
    $scope.item = d;
    $scope.getCommitList();
  }

  $scope.showDatasetList = function(){
    $scope.item = undefined;
    $scope.getCommitList();
  }
  
 $scope.getAllDatasets = function(){
    $http.post("./api/metadata/items",{status:"private"})
      .success(function(resp){
        $scope.datasets = resp; 
      })
  }

  $scope.getCommitList = function(){
    if($scope.item){
      $http.get("./api/dataset/commits/"+$scope.item.dataset.id)
        .success(function(data){
          $scope.commits = data;
        })
    }else{
      $scope.getAllDatasets();
    }    
  };

 

  $scope.getCommitList();
  
  $scope.close = function(){
    $modalInstance.close();
  };
})
.controller("QueryDialogController", function ($scope, $modalInstance,$http, 
                                                item, prepareTopics, table, formatDate, 
                                                $lookup, $translate){
  
  $scope.lookup = $lookup;
  $scope.prepareTopics = prepareTopics;
  $scope.item = item;
  $scope.floor = Math.floor;
  $scope.formatDate = formatDate;
  $scope.table = table;

  $scope.getItemStyle = function(obj){
    if(obj.selected){
      return {
        "color":"#FFFFFF",
        "background-color":"#008CBA"
      }
    }else{
      return {
        "color":"#008CBA",
        "background-color":"#FFFFFF"
      }
    }
  } 

  var genSelectionString = function(dim){
    let buf = [];
    // let s = "";
    dim.selectionString = "";

    dim.values.forEach(function(item){
      if(item.selected){
        buf.push(item)
      }
    })
    if(buf.length === 0){
      dim.selectionString = "";
    }

    for(let i in buf){
      let k = ($lookup(buf[i].label).label)?$lookup(buf[i].label).label:buf[i].label;
      $translate(k).then(function(translation){
        dim.selectionString+=translation+", ";
        if(dim.selectionString.length >=45){
          dim.selectionString = dim.selectionString.substring(0,40)+"... ("+buf.length+" items) "
        }
      })
    }
}

  $scope.tryGetTable = function(){
    // console.log($scope.item);
    $scope.requestComplete = $scope.testQuery($scope.item); 
    if($scope.requestComplete){
     $scope.request = $scope.makeRequest($scope.item);

     if($scope.table){
        $http.get("./api/table/delete/"+$scope.table.id)
          .success(function(){
            $scope.table = undefined; 
            item.tableID = undefined; 
            $http.post("./api/dataset/query",$scope.request)
              .success(function(resp){
              $scope.table = resp;
              item.tableID = resp.id;
            })
          }) 
     }else{
        $scope.table = undefined;
        item.tableID = undefined;
        $http.post("./api/dataset/query",$scope.request)
          .success(function(resp){
          $scope.table = resp;
          item.tableID = resp.id;
        })
     }
     
    }else{
      if($scope.table){
        $http.get("./api/table/delete/"+$scope.table.id)
          .success(function(){
            $scope.table = undefined;
            item.tableID = undefined;
        });
      }      
    }
  };


  $scope.range = function(min,max){
      var result = [];
      for(var i=min; i<=max; i++) result.push(i)
  
      return result;  
  };

  $scope. getValue = function(value){
      return (value == null) ? "-" : value;
  };

  $scope.select= function(dim,item){
    item.selected = item.selected || false;
    item.selected = !item.selected;
    genSelectionString(dim);
    $scope.tryGetTable();
  }

  $scope.selectAll= function(dim){
    dim.values.forEach(function(item){
      item.selected = true;
    })
    genSelectionString(dim);
    $scope.tryGetTable();
  }

  $scope.clear= function(dim){
    dim.values.forEach(function(item){
      item.selected = false;
    })
    genSelectionString(dim);
    $scope.tryGetTable();
  }
  
  $scope.reverse= function(dim){
    dim.values.forEach(function(item){
      item.selected = !item.selected;
    })
    genSelectionString(dim);
    $scope.tryGetTable();
  }

  $scope.setRole = function(dim,role){
    dim.role = role;
    $scope.tryGetTable();   
  }


  $scope.makeRequest = function(item){
    let req = {};
    req.commitID = item.dataset.commit.id;
    req.query = [];
    req.locale = $translate.use();
    for(let i in item.dimension){
      let d = item.dimension[i];
      let collection = getSelectedItems(d);
      if (collection.length == d.values.length){
        collection = [];
      }else{
        collection = collection.map(function(item){
          return item.id;
        })
      }
      req.query.push(
          {
            "dimension" : i,
            "role" : d.role,
            "collection" : collection 
          }
      )
    }
    return req   
  };

    var getSelectedItems = function(d){
        let buf = [];
        d.values.forEach(function(item){
          if(item.selected){
            buf.push(item)
          }
        })
        return buf;
    }

    $scope.testQuery = function(item){
      let columnsAvailable = false;
      let rowsAvailable = false;
      let splitColumnsAvailable = true;
      let splitRowsAvailable = true;
      for(let i in item.dimension){
        let d = item.dimension[i];
        if(d.role == "Columns" && getSelectedItems(d).length>0) columnsAvailable = true;
        if(d.role == "Rows" && getSelectedItems(d).length>0) rowsAvailable = true;
        if(d.role == "Split Columns"){
          if(getSelectedItems(d).length>0){
            splitColumnsAvailable &= true;
          }else{
            splitColumnsAvailable &= false;
          }
        }  
        if(d.role == "Split Rows"){
          if (getSelectedItems(d).length>0){ 
            splitRowsAvailable &= true;
          }else{
            splitRowsAvailable &= false;
          }
        }
      }
      return columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable;
    };



  $scope.tryGetTable();   
  

  $scope.close = function(){
    // console.log("Close", $scope.table);
    if($scope.table){
        $http.get("./api/table/delete/"+$scope.table.id)
          .success(function(){
            $scope.table = undefined;
            item.tableID = undefined;
          });
    }        
    $modalInstance.close();
  };

  $scope.cancel = function(){
    // console.log("Cancel", $scope.table);
    if($scope.table){
          $http.get("./api/table/delete/"+$scope.table.id)
            .success(function(){
              $scope.table = undefined;
              item.tableID = undefined;
            });
    }
     $modalInstance.dismiss();
  };
})

;




