import angular from 'angular';


let m = angular.module('app.widgets.v2.topbar', []);

m.service("randomItemID", function(){
  return () =>  Math.random().toString(36).substring(2)
})

m.controller("TopBarDialogController", function(
  $scope,
  $modalInstance,
  dialog,
  content,
  parentScope,
  confirm,
  randomItemID){

  
  angular.extend($scope,{
    
    "content": angular.copy(parentScope.widget.content.reverse()),
    "decoration": angular.copy(parentScope.widget.decoration),

    close(){
      parentScope.widget.content = angular.copy($scope.content).reverse();
      parentScope.widget.decoration = angular.copy($scope.decoration);
      $modalInstance.close();
    },

    cancel(){
      $modalInstance.dismiss();
    },

    addSection(){
      dialog({
          title:"New Section",
          fields:{ title:{title:"Section Title",value:"",editable:true,required:true}} 
      }).then(function(form){
        $scope.content.push({
          key: randomItemID(),
          title: form.fields.title.value,
          content: []
        })
      })
    },

    deleteSection(section){
      let s = $scope.content.filter((item) =>  item.key == section.key )[0]
      if(s){
        confirm("Delete section "+s.title+"("+s.key+")")
        .then(() => {
          $scope.content = $scope.content.filter( (item) => item.key != s.key )
        })
      }
    },

    editSection(section){
      let s = $scope.content.filter((item) =>  item.key == section.key )[0]
      if(s){
        dialog({
            title:"Edit Section",
            fields:{ 
              title:{
                title:"Section Title",value:s.title,editable:true,required:true
              }
            } 
        }).then(function(form){
          s.title = form.fields.title.value; 
        })
      }  
    },

    addItem(section){
      if(section){
        let s = $scope.content.filter((item) =>  item.key == section.key )[0]
        if(s){
          dialog({
              title:"New Item",
              fields:{ 
                title:{title:"Item Title",value:"",editable:true,required:true},
                href:{title:"Item Reference",value:"",editable:true,required:true}
              } 
          })
          .then(function(form){
            s.content.push({
              key: randomItemID(),
              title: form.fields.title.value,
              href: form.fields.href.value
            })
          })
        }
      }else{
          dialog({
              title:"New Item",
              fields:{ 
                title:{title:"Item Title",value:"",editable:true,required:true},
                href:{title:"Item Reference",value:"",editable:true,required:true}
              } 
          })
          .then(function(form){
            $scope.content.push({
              key: randomItemID(),
              title: form.fields.title.value,
              href: form.fields.href.value
            })
          })
      }
    },

    deleteItem(item,section){
      if(section){
        let s = $scope.content.filter((item) =>  item.key == section.key )[0]
        if(s){
          let it = s.content.filter( (p) => p.key == item.key )[0]
          if(it){
            confirm("Delete item "+it.title+"("+it.key+")")
            .then(() => {
              s.content = s.content.filter( (p) => p.key != it.key )
            })
          }  
        }
      }else{
        let it = $scope.content.filter( (p) => p.key == item.key )[0]
        if(it){
          confirm("Delete item "+it.title+"("+it.key+")")
          .then(() => {
            $scope.content = $scope.content.filter( (p) => p.key != it.key )
          })
        }
      }  
    },

    upItem(item, section){
      let list = (section)? section.content : $scope.content;
      let it = list
        .map((item,index) => {return {"index":index,"item":item}})
        .filter((p) =>  p.item.key == item.key)[0]
      let index = (it)? it.index : -1;
      if(index > 0){
        let buf = list[index-1];
        list[index-1] = list[index];
        list[index] = buf;
      }  
    },

    editItem(item){
      dialog({
          title:"Edit Item",
          fields:{ 
            title:{title:"Item Title",value:item.title,editable:true,required:true},
            href:{title:"Item Reference",value:item.href,editable:true,required:true}
          } 
      })
      .then(function(form){
        
          item.title = form.fields.title.value;
          item.href = form.fields.href.value;
      })
    }  
  });

  

});

m.controller('TopBarController', function (
        $scope,
        $modal,
        app,
        logIn,
        appName,
        config,
        author,
        user,
        APIProvider,
        $translate, 
        $lookup, 
        EventEmitter, 
        i18n,
        randomItemID,
        $scroll,
        $location,
        $window){
 

  
    const eventEmitter = new EventEmitter($scope);
    angular.extend($scope, {
        logIn,
        app,
        appName,
        config,
        
        navigate:(href) => {
          let href = href.split('#');
          let path = (href[0].length>0) ? href[0] : $location.path();
          let id = href[1];
          
          if(path == $location.path() && id){
            $scroll(id)
            return
          } 

          if(path.length>0 && path != $location.path()){
            $window.location.href = path;  
          }

        },

        languages: [
          {key: "en", title: "Eng."},
          {key: "uk", title: "Укр."}
          // {key: "ru", title: "Рус."}
        ],
        selectLanguage(langKey) {
          $scope.currentLang = $scope.languages.filter((item) => item.key == langKey)[0]
          $translate.use(langKey);
          $translate.refresh().then(() => {i18n.refresh()});
          eventEmitter.emit("selectLanguage",langKey);
        },
    });    
   
   $scope.currentLang = $scope.languages.filter((item) => item.key == i18n.locale())[0];
   
   new APIProvider($scope)
    .config( () => {
    
      $scope.widget.decoration = ($scope.widget.decoration) ? $scope.widget.decoration :
        {
          languageSelector : {
            enable:true,
            showFlag:false,
            showTitle:true
          },
          loginButton:true,
          gotoApps : true
        };
      $scope.widget.content = ($scope.widget.content) ? $scope.widget.content : [];
      console.log("Select lang", $scope.currentLang.key)
      $scope.selectLanguage($scope.currentLang.key)
      // eventEmitter.emit("selectLanguage",$scope.currentLang.key);
      
      //   [ {
      //        key:randomItemID(),
      //       title: "Getting Started",
      //       href: "#Getting",
      //       content: [{
      //          key: randomItemID(),
      //           title: "Page 1",
      //           href: "#p1"  
      //         },{
      //            key: randomItemID(),
      //           title: "Page 2",
      //           href: "#p2"  
      //         }
      //       ]
      //     },
      //     {
      //        key:randomItemID(),
      //       title: "Pages",
      //       content: [{
      //          key: randomItemID(),
      //           title: "Page 1",
      //           href: "#p1"  
      //         },{
      //            key: randomItemID(),
      //           title: "Page 2",
      //           href: "#p2"  
      //         }
      //       ]
      //     },{
      //        key: randomItemID(),
      //       title: "About",
      //       href: "#Getting"
      //     }          
      // ];
      // $scope.widget.content = $scope.widget.content.reverse();

    })
    .openCustomSettings(function () {
       $modal.open({
          templateUrl: "/widgets/v2.topbar/topbar-dialog.html",
          controller: 'TopBarDialogController',
          resolve: {
            content: () => $scope.widget.content,
            parentScope: () => $scope
          },
          backdrop: 'static'
       })
    })

    // .translate((langKey) => {
    //   $scope.currentLang = $scope.languages.filter((item) => item.key == langKey)[0]
    // })
    // .provide('selectLanguage', (langKey) => {
    //   console.log("selectLang",langKey)
    //   $scope.currentLang = $scope.languages.filter((item) => item.key == langKey)[0]
    // })

    
    
});


  