import angular from 'angular';
import 'widgets/v2.data-selector/wizard';


const m = angular.module('app.widgets.v2.data-selector', ["app.dps",
  'app.widgets.v2.data-selector-wizard'
]);


m.controller('DataSelectorCtrlV2', function ($scope, $http, $dps, DataSelectorWizard, APIProvider, EventEmitter) {
  
  $scope.emitter = new EventEmitter($scope);

  var Selector =  function(){
        this.objects = $scope.selectorData;
        
        this.selectOneObject= (objectKey) =>{
          objectKey = objectKey.trim();
          this.objects.forEach((o) =>{
              if(o.key == objectKey){
                o.disabled = false;
              }else{
                o.disabled = true
              }
            })
          // console.log("Emit selectObject1")
           $scope.emitter.emit("selectObject",this.objects);  
        };

        this.inverseObjectSelection = () => {
          this.objects.forEach((o) => {o.disabled = !!!o.disabled})
        }
        this.clear = () => {
          this.objects.forEach((item) => {item.disabled = true;})
        }

        this.selectObject= (objectKey) => {
          
          let selectedObject = this.objects.filter((o) => o.key === objectKey)[0];
          selectedObject.disabled = !selectedObject.disabled;
          if(this.objects.filter((o) => !o.disabled).length == 0){
            selectedObject.disabled = !selectedObject.disabled;
            this.inverseObjectSelection();
          } 
          // console.log("Emit selectObject", this.objects);
          $scope.emitter.emit("selectObject",this.objects);  
        }

      }

    $scope.$parent.getSelectorData = (list) => {
      
        
        $scope.selectorData = list;

        $scope.selector = new Selector();
        $scope.selected = [];
        $scope.unselected = $scope.selectorData.map(item => item);
    }

    $scope.$watch('selectorData', function(newList, oldList){
      // console.log("selectorData changed")
      // if(newList == oldList) return;
      if(newList && newList.forEach){
        $scope.selector = new Selector();
        $scope.selected = [];
        $scope.unselected = newList.map(item => item); 
      }  
    })

    $scope.select = (key) => {
      let index = -1;
      for (let i in $scope.unselected){
        if($scope.unselected[i].key == key){
          index = i;
          break;
        }
      } 
      $scope.selected.push($scope.unselected[index])
      $scope.unselected.splice(index,1);
      $scope.selector.selectObject(key)
      $scope.selectedObject = undefined;
    }

    $scope.unselect = (key) => {
      if($scope.selected.length <2) return;
      let index = -1;
      for (let i in $scope.selected){
        if($scope.selected[i].key == key){
          index = i;
          break;
        }
      } 
      $scope.unselected.push($scope.selected[index])
      $scope.selected.splice(index,1)
      $scope.selector.selectObject(key)
    }

    $scope.keyFounded = (key) => {
      if(!key) return false;
      if(!$scope.unselected) return false;
      return $scope.unselected.filter( o => o.key == key )[0]
    }



    $scope.load = function(){
      // $http
      //   .get("./api/data/process/"+$scope.widget.dataID)
      $dps
        .get("/api/data/process/"+$scope.widget.dataID)  
        .then((resp) => {
          let table = resp.data.value;
          let list = ($scope.widget.decoration.direction == "Rows")
          ? table.body
          : table.header;
          list = list.map((item) => {
            return { 
              id:item.metadata[$scope.widget.decoration.meta.index].id,
              key:item.metadata[$scope.widget.decoration.meta.index].label, 
              disabled: true
            }
          }) 
          $scope.$parent.getSelectorData(list)
        })
    }  


  new APIProvider($scope)


    
    .config(()=>{
      // console.log("Config selector")
      $scope.load();
    })
    
    .openCustomSettings(function () {
      $scope.wizard = DataSelectorWizard;
      return $scope.wizard.start($scope)
    })

    .translate(function(){
      $scope.selector.clear();
      $scope.selected.forEach((item) => {
        $scope.selector.selectObject(item.key)
      })
    })
});
