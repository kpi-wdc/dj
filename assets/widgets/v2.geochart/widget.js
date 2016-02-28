import angular from 'angular';
import "angular-google-chart";
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "wizard-directives";


let m = angular.module('app.widgets.v2.geochart', [
    'googlechart', 
    "app.widgets.wizard",
    "app.widgets.v2.steps.edit-widget-id",
    "wizard-directives",
    "oc.lazyLoad"
   ]);


m.factory("GeoChartDecoration",[
  "$http",
  "$q", 
  "parentHolder", 
  "pageWidgets",
  
  function(
    $http, 
    $q, 
    parentHolder, 
    pageWidgets){
    
    return {
      id: "GeoChartDecoration",

      title : "Chart Decoration",
      
      description : "Setup chart decoration options",
          
      html : "./widgets/v2.geochart/geochart-decoration.html",

      chartScopeList : 
              [
                {code:"world", value:"World"},
                {code:"UA", value:"Ukraine"},
                {code:"015", value:"Northern Africa"},
                {code:"011", value:"Western Africa"},
                {code:"017", value:"Middle Africa"},
                {code:"014", value:"Eastern Africa"},
                {code:"018", value:"Southern Africa"},
                {code:"154", value:"Northern Europe"},
                {code:"155", value:"Western Europe"},
                {code:"151", value:"Eastern Europe"},
                {code:"039", value:"Southern Europe"},
                {code:"021", value:"Northern America"},
                {code:"029", value:"Caribbean"},
                {code:"013", value:"Central America"},
                {code:"005", value:"South America"},
                {code:"143", value:"Central Asia"},
                {code:"030", value:"Eastern Asia"},
                {code:"034", value:"Southern Asia"},
                {code:"035", value:"South-Eastern Asia"},
                {code:"145", value:"Western Asia"},
                {code:"053", value:"Australia and New Zealand"},
                {code:"054", value:"Melanesia"},
                {code:"057", value:"Micronesia"},
                {code:"061", value:"Polynesia"}
              ],

        onStartWizard: function(wizard){
          this.wizard = wizard;
          this.conf = {
            query : (wizard.conf.query) ? wizard.conf.query : 
              {
                direction : "Rows",
                colorDataIndex : 0
              }, 
            decoration : (wizard.conf.decoration) ? wizard.conf.decoration : {},
            options : (wizard.conf.options) ? wizard.conf.options:
              {
                width: 600,
                height: 300,
                chartArea: {left:10,top:10,bottom:0,height:"100%"},
                colorAxis: {colors: ['red',"yelow" ,'red']},
                displayMode: 'regions',
                enableRegionInteractivity:false 
              },
            dataID : wizard.conf.dataID,
            queryID : wizard.conf.queryID,
            serieDataId : wizard.conf.serieDataId,
            dataUrl : "./api/data/process/"
          }


          this.conf.decoration.setColor = (palette) => {
            this.conf.options.colorAxis.colors = angular.copy(palette) 
          }

          this.conf.options.width = parentHolder(this.wizard.conf).width;
                   


        this.queries = [];

          pageWidgets()
            .filter((item) => item.type =="v2.query-manager")
            .map((item) => item.queries)
            .forEach((item) => {this.queries = this.queries.concat(item)})

          if(this.conf.queryID){
            let thos = this;
            this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
          } 
        },

        onFinishWizard:  function(wizard){
          wizard.conf.decoration = this.conf.decoration;
          wizard.conf.options = this.conf.options;
          wizard.conf.serieDataId  = this.conf.serieDataId; 
          wizard.conf.queryID  = this.conf.queryID;
          wizard.conf.dataID  = this.conf.dataID;
          wizard.conf.query  = this.conf.query;
          
          this.conf = {};
        },

        onCancelWizard: function(wizard){
          this.conf = {};
        },

        selectChartScope: function() {
          let thos = this;
          let s = this.chartScopeList.filter((item) => item.value == thos.conf.chartScope.trim());
          this.conf.options.region = s[0].code;
        },

        activate : function(wizard){
          if (this.conf.dataID){
            this.loadData();
          }
        },

        reversePalette: function(){
          if ( this.conf.decoration.color ){
            this.conf.decoration.color = this.conf.decoration.color.reverse(); 
          } 
        },

        selectInputData: function(){
          let thos = this;
          thos.wizard.context.postprocessedTable = undefined;
          let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
          this.conf.dataID = iq.context.queryResultId;
          this.conf.queryID = iq.$id;
          this.loadData();
        },


        makeColumnList : function(table){
          if( this.conf.query.direction == "Rows" ){
            this.columnList = table.header.map((item, index) => {
              return {label: item.metadata.map( (m) => m.label ).join(", "), "index":index}
            })
            this.colorColumn = this.columnList[this.conf.query.colorDataIndex].label;
            if(angular.isDefined(this.conf.query.radiusDataIndex))
              this.radiusColumn = this.columnList[this.conf.query.radiusDataIndex].label;
            return
          }


          this.columnList = table.body.map((row, index) => {
              return {label: row.metadata.map( (m) => m.label ).join(", "), "index":index}
          })

           this.colorColumn = this.columnList[this.conf.query.colorDataIndex].label;
           if(angular.isDefined(this.conf.query.radiusDataIndex))
             this.radiusColumn = this.columnList[this.conf.query.radiusDataIndex].label;
        },

        selectColorDataColumn: function(){
          let thos = this;
          this.conf.query.colorDataIndex = this.columnList.filter((item) => item.label == thos.colorColumn)[0].index
        },

        selectRadiusDataColumn: function(){
          let thos = this;
          this.conf.query.radiusDataIndex = this.columnList.filter((item) => item.label == thos.radiusColumn)[0].index
        },

        selectDirection : function(){
          if( this.wizard.context.postprocessedTable )
            this.makeColumnList(this.wizard.context.postprocessedTable)
        },

        selectDisplayMode: function(){
          console.log("selectDisplayMode",this.conf.options.displayMode)
          if (this.conf.options.displayMode == "regions")  
            this.conf.query.radiusDataIndex = undefined;
        },

        loadSeries : function(){
          let r = $http.post(this.conf.dataUrl,
            {
              "cache": false,
              "data_id": this.conf.dataID,
              "params":this.conf.query,
              "proc_name": "geochart-serie",
              "response_type": "data"
            }
          )
          return r
        }, 


      apply: function(){
        this.chart = undefined;
        this.loadData()
      }, 

      loadData: function(){

          let thos = this;

          if(!this.wizard.context.postprocessedTable){
            $http
                  .get("./api/data/process/"+this.conf.dataID)
                  .success(function (resp) {
                      thos.wizard.context.postprocessedTable = resp.value;
                      thos.makeColumnList(resp.value);
                  })
          }

          let chart = {type: "GeoChart"};
      
          chart.options = (this.conf.options) ? (this.conf.options) : 
            {
              width: 600,
              height: 300,
              chartArea: {left:10,top:10,bottom:0,height:"100%"},
              colorAxis: {colors: ['red',"yelow" ,'red']},
              displayMode: 'regions',
              enableRegionInteractivity:false 
            };

          chart.formatters = {
                number : [{
                  columnNum: 1,
                  pattern: "$ #,##0.00"
                }]
              };  

            
          this.loadSeries()
            .then((resp) =>{
                thos.conf.serieDataId = resp.data.data_id;
                // thos.conf.dataID = resp.data.data_id;
                chart.data = resp.data.data;
                thos.chart = chart;
          })  
        }  

    }
  }]);      






m.factory("GeoChartWizard",["$http",
                            "$modal", 
                            "Wizard",
                            "EditWidgetID",
                            "GeoChartDecoration",
                            "parentHolder",
  function (  
    $http,
    $modal, 
    Wizard,
    EditWidgetID,
    GeoChartDecoration,
    parentHolder) {
    
      if (!m._wizard){
        m._wizard = 
         new Wizard($modal)
            .setTitle("Google Geochart Settings Wizard")
            .push(EditWidgetID)
            .push(GeoChartDecoration)


            .onStart(function(wizard){
              wizard.conf = {};
              angular.copy(wizard.parentScope.widget, wizard.conf);
            })


            .onCancel(function(wizard){
              wizard.conf = {};
              wizard.context = {};
        })

            .onFinish(function(wizard){
              wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
              wizard.parentScope.widget.options = wizard.conf.options;
              wizard.parentScope.widget.decoration = wizard.conf.decoration;
              wizard.parentScope.widget.query = wizard.conf.query;
              wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
              wizard.parentScope.widget.queryID = wizard.conf.queryID;
              wizard.parentScope.widget.dataID = wizard.conf.dataID;
              
              wizard.conf = {};
              wizard.context = {};
              wizard.parentScope.update();
        });
    }
          
            return m._wizard;  

  }]);


m.controller("GeoChartController", function(
  $scope,
  $window,
  $http, 
  APIProvider,
  GeoChartWizard,
  $ocLazyLoad){

  $ocLazyLoad.load({
      files: [
        "/widgets/v2.geochart/geochart.css"
      ]
    });

  
   $scope.fixGoogleCharts = function (chartWrapper) {

    $(chartWrapper.getContainerId())
      .find('svg')
      .each(function () {
        $(this).find("g").each(function () {
            if ($(this).attr('clip-path')) {
                if ($(this).attr('clip-path').indexOf('url(#') == -1)
                    return;
                $(this).attr('clip-path', 'url(' + document.location + $(this).attr('clip-path').substring(4))
            }
        });
            
      $(this)
        .find("rect")
        .each(function () {
          if ($(this).attr('fill')) {
              if ($(this).attr('fill').indexOf('url(#') == -1)
                  return;
              $(this).attr('fill', 'url(' + document.location + $(this).attr('fill').substring(4))
          }
        });
    });
  }


  $scope.loadData = () => $http.get("./api/data/process/"+$scope.widget.serieDataId);
  
  $scope.update = () => {
    
    $scope.chart = undefined;

    let chart = {type: "GeoChart"};
      
    chart.options = ($scope.widget.options) ? ($scope.widget.options) : 
      {
        width: 600,
        height: 300,
        chartArea: {left:10,top:10,bottom:0,height:"100%"},
        colorAxis: {colors: ['red',"yelow" ,'red']},
        displayMode: 'regions',
        enableRegionInteractivity:false 
      };

    chart.formatters = {
          number : [{
            columnNum: 1,
            pattern: "$ #,##0.00"
          }]
        };  

    $scope.loadData()
      .then((resp) =>{
          chart.data = resp.data.value;
          $scope.chart = chart;
    })  
  }


  new APIProvider($scope)
    .config( () => {console.log("Config Geochart");$scope.update()} )
    .openCustomSettings(function () {
        $scope.wizard = GeoChartWizard;
        $scope.wizard.start($scope);
    })

});

  
  
  