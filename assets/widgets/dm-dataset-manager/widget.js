import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-dataset-manager', ['app.dictionary', 'ngFileUpload', "app.dps", 'mm.foundation'])
    // .controller('DatasetManagerSearchResultController', function ($scope, $http, EventEmitter, 
    //   APIProvider, pageSubscriptions, $lookup, $translate,$modal, user) {


//   const eventEmitter = new EventEmitter($scope);
//   $scope.lookup = $lookup;
//   $scope.breadcrums = [];
//   $scope.tagList = [];
//   $scope.user = user;
//   $scope.total = 0;
//   $scope.table = undefined;

//   var formatDate = function(date){
//     var locale = $translate.use() || "en";
//     date = new Date(date);
//     date = date.toLocaleString(locale,
//       { year: 'numeric',  
//         month: 'long',  
//         day: 'numeric', 
//         hour: 'numeric',  
//         minute: 'numeric',
//         second: 'numeric'
//       })
//     return date;
//   }

//    $scope.formatDate = formatDate;

//   function addListener(subscription) {
//     var subscriptions = pageSubscriptions();
//     for (var i in subscriptions) {
//       if (subscriptions[i].emitter === subscription.emitter 
//         && subscriptions[i].receiver === subscription.receiver) {
//         return;
//       }
//     }
//     subscriptions.push(subscription);
//   };

//   function removeListener(subscription) {
//     var subscriptions = pageSubscriptions();
//     for (var i in subscriptions) {
//       if (subscriptions[i].emitter === subscription.emitter 
//         && subscriptions[i].receiver === subscription.receiver) {
//         subscriptions.splice(i, 1);
//         return;
//       }
//     }
//   };

//   var searchDatasets = function(query){
//         if(query){
//           $scope.total = 0;
//           $scope.query = query;
//           var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
//           $http.post("./api/metadata/items", {"query":query, "status":status}).success(
//             function(resp){
//               $scope.result = resp;
//               $scope.total = $scope.result.length;
//               if($scope.total == 0){
//                  eventEmitter.emit("slaveVisibility",true);
//                }else{
//                  eventEmitter.emit("slaveVisibility",false);
//                }
//           });
//         }
//   }

//   $scope.download = function(item){
//     item.download = true;
//     $http.get("./api/dataset/download/"+item.dataset.id)
//       .success(function(){
//         item.download = false;
//       })
//   }

//   $scope.selectSource = function(key){
//     eventEmitter.emit('setLookupKey', key);
//     let query = [{"dataset.source":[{equals:key}]}];
//     searchDatasets(query);
//   }

//   $scope.selectTopic = function(key){
//     eventEmitter.emit('setLookupKey', key);
//     let query = [{"dataset.topics":[{includes:key}]}];
//     searchDatasets(query);
//   }

//   $scope.lookup = $lookup;


//   var prepareTopics = function(topics){
//     var simple_topics = [];
//     topics = (topics.forEach) ? topics : [topics];
//     topics.forEach(function(item){
//       item.split("/").forEach(function(t){
//         if(simple_topics.filter(function(s){return s === t}).length === 0){simple_topics.push(t)}
//       });
//     })
//     return simple_topics;
//   }

//   $scope.prepareTopics = prepareTopics;


//   $scope.openQueryDialog = function(item){
//     $modal.open({
//       templateUrl: "./widgets/dm-search-result/query-modal.html",
//       controller: 'QueryDialogController',
//       backdrop: 'static',
//       resolve: {
//         item() {return item },
//         prepareTopics() {return prepareTopics},
//         table() {return $scope.table},
//         formatDate() { return formatDate}
//       }  
//     }).result.then(
//       () => {
//         // console.log("Close Query DIALOG")
//         if(item.tableID){
//           $http.get("./api/table/delete/"+item.tableID)
//             .success(function(){
//               item.tableID = undefined;
//             });
//         }
//       },
//       () => {
//         // console.log("Cancel Query DIALOG",resp)
//         // console.log(item.tableID)
//         if(item.tableID){

//           $http.get("./api/table/delete/"+item.tableID)
//             .success(function(){
//               item.tableID = undefined;
//             });
//         }
//       }
//     );
//   }


//    $scope.openManageDialog = function(item){
//     $modal.open({
//       templateUrl: "./widgets/dm-search-result/manage-modal.html",
//       controller: 'ManageDialogController',
//       backdrop: 'static',
//       resolve: {
//         item() {return item },
//         prepareTopics() {return prepareTopics},
//         formatDate() { return formatDate}
//       }  
//     }).result.then(
//           () => {
//              // console.log("Close MANAGE DIALOG",item);
//              eventEmitter.emit('refresh');
//           },
//           () => {
//              // console.log("Cancel MANAGE DIALOG",item);
//              eventEmitter.emit('refresh');
//           }
//     );
//   }


//   new APIProvider($scope)
//     .config(() => {
//       console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
//       $scope.title = $scope.widget.title;
//       $scope.icon_class = $scope.widget.icon_class;
//       // $scope.query = $scope.widget.query || $scope.query;
//       searchDatasets($scope.query);

//       $scope.listeners = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
//       for(var i in $scope.listeners){
//         $scope.listeners[i] = $scope.listeners[i].trim();
//         // console.log($scope.widget.instanceName,$scope.listeners[i]);
//         addListener({
//               emitter: $scope.widget.instanceName,
//               receiver: $scope.listeners[i],
//               signal: "setLookupKey",
//               slot: "setLookupKey"
//             });
//       }

//       $scope.rlisteners = ($scope.widget.rlisteners) ? $scope.widget.rlisteners.split(",") : [];
//       for(var i in $scope.rlisteners){
//         $scope.rlisteners[i] = $scope.rlisteners[i].trim();
//         // console.log($scope.widget.instanceName,$scope.rlisteners[i]);
//         addListener({
//               emitter: $scope.widget.instanceName,
//               receiver: $scope.rlisteners[i],
//               signal: "refresh",
//               slot: "refresh"
//             });
//       }          

//     })
//     .provide('searchQuery', (evt, value) => {
//       $scope.query = value;
//       // console.log("SEARCH",evt, $scope.query)
//       searchDatasets(value);
//     })
//     .provide('refresh', (evt) => {
//       // console.log("REFRESH", $scope.query);
//       searchDatasets($scope.query);
//     })

//     .removal(() => {
//       console.log('Find Result widget is destroyed');
//     });
// })








.controller("DatasetsManagerController", function($scope, $http, $upload, $timeout, $dps,
    $lookup, EventEmitter, APIProvider, pageSubscriptions,
    $translate, user, confirm, alert, dialog, log, progress) {

    const eventEmitter = new EventEmitter($scope);

    var formatDate = function(date) {
        var locale = $translate.use() || "en";
        date = new Date(date);
        date = date.toLocaleString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        return date;
    }


    $scope.formatDate = formatDate;

    $scope.item = undefined;
    $scope.lookup = $lookup;
    $scope.user = user;
    $scope.upload_process = false;
    $scope.dps = $dps.getUrl();



    var prepareTopics = function(topics) {
        var simple_topics = [];
        topics = (topics.forEach) ? topics : [topics];
        topics.forEach(function(item) {
            item.split("/").forEach(function(t) {
                if (simple_topics.filter(function(s) {
                        return s === t }).length === 0) { simple_topics.push(t) }
            });
        })
        return simple_topics;
    }

    $scope.prepareTopics = prepareTopics;

    function addListener(subscription) {
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
            if (subscriptions[i].emitter === subscription.emitter && subscriptions[i].receiver === subscription.receiver) {
                return;
            }
        }
        subscriptions.push(subscription);
    };

    function removeListener(subscription) {
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
            if (subscriptions[i].emitter === subscription.emitter && subscriptions[i].receiver === subscription.receiver) {
                subscriptions.splice(i, 1);
                return;
            }
        }
    };

    $scope.fileSelected = function(f, e) {
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



    $scope.uploadCommit = function() {
        dialog({
            title: `${$translate.instant('Select .xlsx file')}:`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    editable: true,
                    required: true
                }
            }
        }).then((form) => {
            var p = progress("Upload dataset ");
            const fd = new FormData();
            // Take the first selected file
            fd.append('file', form.fields.file.value);
            
            $http.post($dps.getUrl() + '/api/dataset/update', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                p.close();
                var title = { level: "success", text: "Dataset Created" };

                if (response.log.filter((item) => {
                        return item.level == "error" }).length > 0)
                    title = { level: "error", text: "Cannot create Dataset" };
                if (response.log.filter((item) => {
                        return item.level == "warning" }).length > 0)
                    title = { level: "warning", text: "Dataset Created with Warnings" };

                log({ title: title, messages: response.log });

                $scope.upload_process = false;
                $lookup.reload();
                $scope.item = response.metadata;
                $timeout(function() {
                    $scope.getCommitList();
                    eventEmitter.emit('refresh');
                });
            });
        })
    }

    $scope.uploadfromFTP = function() {
        dialog({
            title: `${$translate.instant('Select .xlsx file')}:`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    editable: true,
                    required: true
                }
            }
        }).then((form) => {
            var p = progress("Upload CSV ");
            const fd = new FormData();
            // Take the first selected file
            fd.append('file', form.fields.file.value);
            $http.post($dps.getUrl() + '/api/dataset/ch/update', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                p.close();
                var title = { level: "success", text: "Dataset Group Created" };

                if (response.log.filter((item) => {
                        return item.level == "error" }).length > 0)
                    title = { level: "error", text: "Cannot create Dataset Group" };
                if (response.log.filter((item) => {
                        return item.level == "warning" }).length > 0)
                    title = { level: "warning", text: "Dataset Group Created with Warnings" };

                log({ title: title, messages: response.log });

                $scope.upload_process = false;
                $lookup.reload();
                // $scope.item = response.metadata;
                // $timeout(function() {
                //   $scope.getCommitList();
                //   eventEmitter.emit('refresh');
                // });
            });
        })
    }

    $scope.getDatasetUUID = function(){
        var p = progress("Create new dataset UUID")
         $dps
            .get("/api/dataset/id/create")
            .then((response) => {
                p.close();
                confirm(response.data.id)
            })
    }

    $scope.exportDictionary = function(){
        var p = progress("Download Dictionaries")
        $dps
            .get("/api/export/dictionary")
            .then((response) => {
                p.close();
                $dps.downloadJSON(response.data,response.data.data.file)
            })    
    }

    $scope.exportDatasets = function() {
        var p = progress("Wait one moment")
        $dps
            .get("/api/export/datasets/metadata")
            .then((response) => {
                p.close();
                dialog({
                    title:"Select datasets for export",
                    fields: {
                        list:{
                            title:"Dataset list",
                            type:"multiselect",
                            options:response.data.data.list.map((item)=>{
                                return {
                                    value:item.id,
                                    title: $translate.instant(item.label)+item.ext
                                }    
                            }),
                            editable: true,
                            required: true
                        }
                    }
                })
                .then( (form) => {
                    p = progress("Download data")

                    $dps
                    .get("/api/export/datasets/"+form.fields.list.value.join("+"))
                    .then((response) => {
                        p.close()
                        $dps.downloadJSON(response.data,response.data.data.file)
                        log({ messages: response.data.log })
                    })
                })        
        })
    }

    $scope.importDatasets = function() {
        dialog({
            title: `${$translate.instant('Select .json file with datasets')}:`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    editable: true,
                    required: true
                }
            }
        }).then((form) => {
            var p = progress("Import datasets ");
            const fd = new FormData();
            // Take the first selected file
            fd.append('file', form.fields.file.value);
            $http.post($dps.getUrl() + '/api/import/datasets', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                p.close()
                var title = { level: "success", text: "Datasets imported" };

                if (response.log.filter((item) => {
                        return item.level == "error" }).length > 0)
                    title = { level: "error", text: "Cannot import datasets" };
                if (response.log.filter((item) => {
                        return item.level == "warning" }).length > 0)
                    title = { level: "warning", text: "Datasets imported with Warnings" };

                log({ title: title, messages: response.log });

                $scope.upload_process = false;
                $lookup.reload();
                // $scope.item = response.metadata;
                // $timeout(function() {
                //   $scope.getCommitList();
                //   eventEmitter.emit('refresh');
                // });
            });
        })
    }

     $scope.importDictionary = function() {
        dialog({
            title: `${$translate.instant('Select .json file with dictionary')}:`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    editable: true,
                    required: true
                }
            }
        }).then((form) => {
            var p = progress("Import dictionaries ");
            const fd = new FormData();
            // Take the first selected file
            fd.append('file', form.fields.file.value);
            $http.post($dps.getUrl() + '/api/import/dictionary', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                p.close()
                var title = { level: "success", text: "Dictionary imported" };

                if (response.log.filter((item) => {
                        return item.level == "error" }).length > 0)
                    title = { level: "error", text: "Cannot import dictionary" };
                if (response.log.filter((item) => {
                        return item.level == "warning" }).length > 0)
                    title = { level: "warning", text: "Dictionary imported with Warnings" };

                log({ title: title, messages: response.log });

                $scope.upload_process = false;
                $lookup.reload();
                // $scope.item = response.metadata;
                // $timeout(function() {
                //   $scope.getCommitList();
                //   eventEmitter.emit('refresh');
                // });
            });
        })
    }

    $scope.uploadDictionary = function() {
        dialog({
            title: `${$translate.instant('Select .xlsx file')}:`,
            fields: {
                file: {
                    title: 'Data file:',
                    type: 'file',
                    editable: true,
                    required: true
                }
            }
        }).then((form) => {
            var p = progress("Update dictionaries ");
            const fd = new FormData();
            // Take the first selected file
            fd.append('file', form.fields.file.value);
            $http.post($dps.getUrl() + '/api/dictionary/update', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(response) {
                p.close()
                var title = { level: "success", text: "Dictionaries updated" };

                if (response.log.filter((item) => {
                        return item.level == "error" }).length > 0)
                    title = { level: "error", text: "Cannot update dictionary" };
                if (response.log.filter((item) => {
                        return item.level == "warning" }).length > 0)
                    title = { level: "warning", text: "Dictionary updated with Warnings" };

                log({ title: title, messages: response.log });

                $scope.upload_process = false;
                $lookup.reload();
                // $scope.item = response.metadata;
                // $timeout(function() {
                //   $scope.getCommitList();
                //   eventEmitter.emit('refresh');
                // });
            });
        })
    }




    // $scope.upload = function (file) {
    //   $scope.upload_process = true;
    //   $upload.upload({
    //     url: $dps.getUrl()+'/api/dataset/update',
    //     method: 'POST',
    //     headers: {
    //       //'my-header' : 'my-header-value'
    //     },
    //     file: file,
    //   })
    //   .then(function(response) {
    //     if(response.data.error){
    //        alert.error(["Dataset Commit not created"].concat(response.data.error));
    //        $scope.getCommitList();
    //     }else{
    //       if(response.data.warnings.length>0){
    //        alert.message(["Dataset commit is created, but"].concat(response.data.warnings));
    //       }

    //       $scope.upload_process = false;
    //       $lookup.reload();
    //       $scope.item = response.data.metadata;
    //       $timeout(function() {
    //         $scope.getCommitList();
    //         eventEmitter.emit('refresh');
    //       });
    //     }  
    //   });
    // }


    $scope.headStyle = function(f) {
        return (f) ? { "font-weight": 900, "color": "darkorange" } : {}
    }

    $scope.headRowStyle = function(f) {
        return (f) ? {
            "background-color": "rgba(160, 211, 232, 0.31)",
            "font-size": "smaller",
            "font-weight": "bold",
            "padding": "0.1rem 0.5rem"
        } : {
            "font-size": "smaller",
            "color": "orangered",
            "padding": "0.1rem 0.5rem"
        }
    }

    $scope.upToHEAD = function(c) {
        $scope.commits = undefined;
        //$http.get("./api/commit/head/"+c.metadata.dataset.commit.id)
        $dps.get("/api/commit/head/" + c.metadata.dataset.commit.id)
            .success(function(resp) {
                $scope.item = resp.metadata;
                $scope.getCommitList();
            })

    }

    $scope.setCommitStatus = function(commitID, status) {
        // $http.get("./api/commit/"+status+"/"+commitID)
        $dps.get("/api/commit/" + status + "/" + commitID)
            .success(function(resp) {
                $scope.item = resp.metadata;
                $scope.getCommitList();
                eventEmitter.emit('refresh');
            })
    }

    $scope.deleteCommit = function(c) {
        $scope.commits = undefined;
        // $http.get("./api/commit/delete/"+c.metadata.dataset.commit.id)
        $dps.get("/api/commit/delete/" + c.metadata.dataset.commit.id)
            .success(function() {
                $scope.getCommitList();
                eventEmitter.emit('refresh');
            })
    }

    $scope.deleteDataset = function(c) {
        confirm("You will remove the dataset " + c.metadata.dataset.id + ". You can download it before removing. Are you sure?")
            .then(function() {
                $scope.item = undefined;
                $scope.deleteCommit(c);
            })
    }

    $scope.selectDataset = function(d) {
        $scope.item = d;
        $scope.getCommitList();
    }

    $scope.showDatasetList = function() {
        $scope.item = undefined;
        $scope.getCommitList();
    }

    $scope.getAllDatasets = function() {
        // $http.post("./api/metadata/items",{status:"private"})
        $dps.post("/api/metadata/items", { status: "private" })
            .success(function(resp) {
                $scope.datasets = resp;
            })
    }

    $scope.getCommitList = function() {
        if ($scope.item) {
            // $http.get("./api/dataset/commits/"+$scope.item.dataset.id)
            $dps.get("/api/dataset/commits/" + $scope.item.dataset.id)
                .success(function(data) {
                    $scope.commits = data;
                })
        } else {
            $scope.getAllDatasets();
        }
    };

    new APIProvider($scope)
        .config(() => {
            console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
            $scope.readOnly = $scope.widget.readOnly;
            $scope.presentationMode = $scope.widget.presentationMode;
            $scope.collapsed = true;
            $scope.rlisteners = ($scope.widget.rlisteners) ? $scope.widget.rlisteners.split(",") : [];

            pageSubscriptions().removeListeners({
                emitter: $scope.widget.instanceName,
                signal: "refresh"
            })

            pageSubscriptions().addListeners(
                $scope.rlisteners.map((item) => {
                    return {
                        emitter: $scope.widget.instanceName,
                        receiver: item.trim(),
                        signal: "refresh",
                        slot: "refresh"
                    }
                })
            );

            // for(var i in $scope.rlisteners){
            //   $scope.rlisteners[i] = $scope.rlisteners[i].trim();
            //   addListener({
            //         emitter: $scope.widget.instanceName,
            //         receiver: $scope.rlisteners[i],
            //         signal: "refresh",
            //         slot: "refresh"
            //       });
            // }        
            $scope.getCommitList();

        });
})


// .controller("QueryDialogController", function ($scope, $modalInstance,$http, 
//                                                 item, prepareTopics, table, formatDate, 
//                                                 $lookup, $translate){

//   $scope.lookup = $lookup;
//   $scope.prepareTopics = prepareTopics;
//   $scope.item = item;
//   $scope.floor = Math.floor;
//   $scope.formatDate = formatDate;
//   $scope.table = table;

//   $scope.getItemStyle = function(obj){
//     if(obj.selected){
//       return {
//         "color":"#FFFFFF",
//         "background-color":"#008CBA"
//       }
//     }else{
//       return {
//         "color":"#008CBA",
//         "background-color":"#FFFFFF"
//       }
//     }
//   } 

//   var genSelectionString = function(dim){
//     let buf = [];
//     // let s = "";
//     dim.selectionString = "";

//     dim.values.forEach(function(item){
//       if(item.selected){
//         buf.push(item)
//       }
//     })
//     if(buf.length === 0){
//       dim.selectionString = "";
//     }

//     for(let i in buf){
//       let k = ($lookup(buf[i].label).label)?$lookup(buf[i].label).label:buf[i].label;
//       $translate(k).then(function(translation){
//         dim.selectionString+=translation+", ";
//         if(dim.selectionString.length >=45){
//           dim.selectionString = dim.selectionString.substring(0,40)+"... ("+buf.length+" items) "
//         }
//       })
//     }
// }

//   $scope.tryGetTable = function(){
//     // console.log($scope.item);
//     $scope.requestComplete = $scope.testQuery($scope.item); 
//     if($scope.requestComplete){
//      $scope.request = $scope.makeRequest($scope.item);

//      if($scope.table){
//         $http.get("./api/table/delete/"+$scope.table.id)
//           .success(function(){
//             $scope.table = undefined; 
//             item.tableID = undefined; 
//             $http.post("./api/dataset/query",$scope.request)
//               .success(function(resp){
//               $scope.table = resp;
//               item.tableID = resp.id;
//             })
//           }) 
//      }else{
//         $scope.table = undefined;
//         item.tableID = undefined;
//         $http.post("./api/dataset/query",$scope.request)
//           .success(function(resp){
//           $scope.table = resp;
//           item.tableID = resp.id;
//         })
//      }

//     }else{
//       if($scope.table){
//         $http.get("./api/table/delete/"+$scope.table.id)
//           .success(function(){
//             $scope.table = undefined;
//             item.tableID = undefined;
//         });
//       }      
//     }
//   };


//   $scope.range = function(min,max){
//       var result = [];
//       for(var i=min; i<=max; i++) result.push(i)

//       return result;  
//   };

//   $scope. getValue = function(value){
//       return (value == null) ? "-" : value;
//   };

//   $scope.select= function(dim,item){
//     item.selected = item.selected || false;
//     item.selected = !item.selected;
//     genSelectionString(dim);
//     $scope.tryGetTable();
//   }

//   $scope.selectAll= function(dim){
//     dim.values.forEach(function(item){
//       item.selected = true;
//     })
//     genSelectionString(dim);
//     $scope.tryGetTable();
//   }

//   $scope.clear= function(dim){
//     dim.values.forEach(function(item){
//       item.selected = false;
//     })
//     genSelectionString(dim);
//     $scope.tryGetTable();
//   }

//   $scope.reverse= function(dim){
//     dim.values.forEach(function(item){
//       item.selected = !item.selected;
//     })
//     genSelectionString(dim);
//     $scope.tryGetTable();
//   }

//   $scope.setRole = function(dim,role){
//     dim.role = role;
//     $scope.tryGetTable();   
//   }


//   $scope.makeRequest = function(item){
//     let req = {};
//     req.commitID = item.dataset.commit.id;
//     req.query = [];
//     req.locale = $translate.use();
//     for(let i in item.dimension){
//       let d = item.dimension[i];
//       let collection = getSelectedItems(d);
//       if (collection.length == d.values.length){
//         collection = [];
//       }else{
//         collection = collection.map(function(item){
//           return item.id;
//         })
//       }
//       req.query.push(
//           {
//             "dimension" : i,
//             "role" : d.role,
//             "collection" : collection 
//           }
//       )
//     }
//     return req   
//   };

//     var getSelectedItems = function(d){
//         let buf = [];
//         d.values.forEach(function(item){
//           if(item.selected){
//             buf.push(item)
//           }
//         })
//         return buf;
//     }

//     $scope.testQuery = function(item){
//       let columnsAvailable = false;
//       let rowsAvailable = false;
//       let splitColumnsAvailable = true;
//       let splitRowsAvailable = true;
//       for(let i in item.dimension){
//         let d = item.dimension[i];
//         if(d.role == "Columns" && getSelectedItems(d).length>0) columnsAvailable = true;
//         if(d.role == "Rows" && getSelectedItems(d).length>0) rowsAvailable = true;
//         if(d.role == "Split Columns"){
//           if(getSelectedItems(d).length>0){
//             splitColumnsAvailable &= true;
//           }else{
//             splitColumnsAvailable &= false;
//           }
//         }  
//         if(d.role == "Split Rows"){
//           if (getSelectedItems(d).length>0){ 
//             splitRowsAvailable &= true;
//           }else{
//             splitRowsAvailable &= false;
//           }
//         }
//       }
//       return columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable;
//     };



//   $scope.tryGetTable();   


//   $scope.close = function(){
//     // console.log("Close", $scope.table);
//     if($scope.table){
//         $http.get("./api/table/delete/"+$scope.table.id)
//           .success(function(){
//             $scope.table = undefined;
//             item.tableID = undefined;
//           });
//     }        
//     $modalInstance.close();
//   };

//   $scope.cancel = function(){
//     // console.log("Cancel", $scope.table);
//     if($scope.table){
//           $http.get("./api/table/delete/"+$scope.table.id)
//             .success(function(){
//               $scope.table = undefined;
//               item.tableID = undefined;
//             });
//     }
//      $modalInstance.dismiss();
//   };
// })

// ;
