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

    function addListener(subscription) {
      var subscriptions = pageSubscriptions();
      for (var i in subscriptions) {
        if (subscriptions[i].emitter === subscription.emitter 
          && subscriptions[i].receiver === subscription.receiver) {
          return;
        }
      }
      subscriptions.push(subscription);
    };

    function removeListener(subscription) {
      var subscriptions = pageSubscriptions();
      for (var i in subscriptions) {
        if (subscriptions[i].emitter === subscription.emitter 
          && subscriptions[i].receiver === subscription.receiver) {
          subscriptions.splice(i, 1);
          return;
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
                $scope.total = $scope.result.length;
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
          prepareTopics() {return prepareTopics}
        }  
      }).result.then(() => {
        console.log("Close QUERY DIALOG",item);
      });
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
               console.log("Close MANAGE DIALOG",item);
               eventEmitter.emit('refresh');
            },
            () => {
               console.log("Cancel MANAGE DIALOG",item);
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
        searchDatasets($scope.query);

        $scope.listeners = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
        for(var i in $scope.listeners){
          $scope.listeners[i] = $scope.listeners[i].trim();
          // console.log($scope.widget.instanceName,$scope.listeners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.listeners[i],
                signal: "setLookupKey",
                slot: "setLookupKey"
              });
        }

        $scope.rlisteners = ($scope.widget.rlisteners) ? $scope.widget.rlisteners.split(",") : [];
        for(var i in $scope.rlisteners){
          $scope.rlisteners[i] = $scope.rlisteners[i].trim();
          // console.log($scope.widget.instanceName,$scope.rlisteners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.rlisteners[i],
                signal: "refresh",
                slot: "refresh"
              });
        }          
        
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
.controller("QueryDialogController", function ($scope, $modalInstance,$http, item, prepareTopics, $lookup, $translate){
  
  $scope.lookup = $lookup;
  $scope.prepareTopics = prepareTopics;
  $scope.item = item;

  $scope.close = function(){
    $modalInstance.close();
  };
  $scope.cancel = function(){
     $modalInstance.dismiss();
  };
})

;




