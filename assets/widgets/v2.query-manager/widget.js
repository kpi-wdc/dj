import angular from 'angular';
import "ng-json-explorer";
import "widgets/wizard/wizard";
import "widgets/v2.steps/select-dataset";
import "widgets/v2.steps/make-query";
import "widgets/v2.steps/post-process";
import "md5";


let m = angular.module('app.widgets.v2.query-manager', [
  'ngJsonExplorer',
  "app.widgets.wizard",
  "app.widgets.v2.steps.select-dataset",
  "app.widgets.v2.steps.make-query",
  "app.widgets.v2.steps.post-process"
]);

m.service("md5", function(){return md5});

m.factory("Queries",function(){
  return {
    scope: undefined,
    
    init: (scope) => {
      this.scope = scope;
      scope.widget.queries = (scope.widget.queries) ? scope.widget.queries : [];
    },


    add: (query, type, title) => {
      let q = {
        $id: md5(angular.toJson(query)),
        $listeners: 0,
        $type: type,
        $title: title,
        context: query
      }
      let oq = this.scope.widget.queries.filter((item) => item.$id == q.$id)[0]
      if(oq) {
        return oq
      }else{
        this.scope.widget.queries.push(q);
        return q;
      }
    },

    remove: (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if(query){ // && (query.$listeners.length == 0)){
        this.scope.widget.queries = this.scope.widget.queries.filter((item) => item.$id != queryID)
      }
    },

    get : (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if( query ) query.$listeners++;
      return query;
    },

    release: (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if( query ) query.$listeners--;
    },

    getQuery : (query) => {
      let id = md5(angular.toJson(query));
      return this.scope.widget.queries.filter((item) => item.$id == id)[0]
    }
  }
});


m._projectionWizard = undefined;

m.factory("ProjectionWizard",[
  "$http",
  "$modal", 
  "Wizard",
  "SelectDataset",
  "MakeQuery",
    function (  
          $http,
          $modal, 
          Wizard,
          SelectDataset,
          MakeQuery) {
      
      if (!m._projectionWizard){
        m._projectionWizard = 
         new Wizard($modal)
            .setTitle("Data Cube Projection Wizard")
            .setIcon("./widgets/v2.query-manager/projection.png")
            .push(SelectDataset)
            .push(MakeQuery)
            .onStart(function(wizard){
              wizard.context = {};
              console.log("Start");
            })
            .onCompleteStep( function(wizard,step){
              console.log("complete",step.title, wizard.context);
              if(step.title == "Dataset"){
                wizard.enable(step.index+1);
              }
            })
            .onProcessStep( function(wizard,step){
              console.log("process",step.title, wizard.context);
              
              if(step.title == "Dataset"){
                wizard.disable(wizard.getAboveIndexes(step));
              }
            })
      }      

      return m._projectionWizard;  

}]);


m._preparationWizard = undefined;

m.factory("PreparationWizard",[
  "$http",
  "$modal", 
  "Wizard",
  "PostProcess",
    function (  
          $http,
          $modal, 
          Wizard,
          PostProcess) {
      
      if (!m._preparationWizard){
        m._preparationWizard = 
         new Wizard($modal)
            .setTitle("Data Preparation Wizard")
            .setIcon("./widgets/v2.query-manager/preparation.png")
            .push(PostProcess)
            .onStart(function(wizard){
              wizard.context = {};
              console.log("Start");
            })
            .onCompleteStep( function(wizard,step){
              console.log("complete",step.title, wizard.context);
            })
            .onProcessStep( function(wizard,step){
              console.log("process",step.title, wizard.context);
            })
      }      

      return m._preparationWizard;  

}]);

m.controller('QueryManagerController', function (
    $scope,
    $http,
    $modal, 
    APIProvider,
    EventEmitter,
    pageSubscriptions,
    Queries,
    ProjectionWizard,
    PreparationWizard,
    app,
    confirm){

    $scope.addProjection = (context,title) => {
      Queries.add(context, "projection", title);
      app.markModified();
    }

    $scope.addPreparation = (context,title) => {
      Queries.add(context, "preparation", title);
      app.markModified();
    }

    $scope.getQuery = (context) => Queries.getQuery( context );

    $scope.invokeAddProjectionWizard = () => {
      $scope.wizard = ProjectionWizard;
      $scope.wizard.start($scope);
    }

    $scope.invokeAddPreparationWizard = () => {
      $scope.wizard = PreparationWizard;
      $scope.wizard.start($scope);
    }

    $scope.select = (query) => {
        $scope.preview = undefined;
        $scope.selected = query;
       
       $http
        .get("./api/data/process/"+query.context.queryResultId)
        .success(function (resp) {
            $scope.preview = resp.value;
        })
    }

    $scope.del = (query) => {
      confirm("Delete query "+query.$title+" ?").then(() => {
        Queries.remove(query.$id);
        app.markModified();
      })
    }

    $scope.getQueries = () => $scope.widget.queries;
    
    this.getQueries = $scope.getQueries;

    new APIProvider($scope)
      .config(() => {
        console.log("Configure Data Query Manager");
        Queries.init($scope)
      })
  });


  