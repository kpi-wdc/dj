import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';


const m = angular.module("app.widgets.v2.simple-map",
  ["app.widgets.nvd3-widget"]);


m.service("NVD3MapAdapter", function () {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.color = decoration.color ? decoration.color : null;

      options.chart.showLabels = decoration.showLabels;
      options.chart.showValues = decoration.showValues;
      options.chart.showTiles = decoration.showTiles;
      options.chart.selectedTiles = decoration.selectedTiles;
      options.chart.interactive = decoration.interactive;
      options.chart.defaultFill = decoration.defaultFill;
      options.chart.defaultFillOpacity = decoration.defaultFillOpacity;
      options.chart.defaultStroke = decoration.defaultStroke;
      options.chart.defaultStrokeWidth = decoration.defaultStrokeWidth;
      options.chart.defaultStrokeOpacity = decoration.defaultStrokeOpacity;
      options.chart.selectedFillOpacity = decoration.selectedFillOpacity;
      options.chart.selectedStrokeWidth = decoration.selectedStrokeWidth;
           
    }

       options.chart.tooltipContent = function (serie, x, y, s) {
        console.log("Tooltip",serie, x, y);
          var result = "<center><b>" + serie.properties.name.en + "</center></b>";
          if (serie.properties.values && serie.properties.values[y.index()].c>=0) {
            result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + 
                      serie.properties.values[y.index()].l + 
                      " : " + 
                      serie.properties.values[y.index()].v + "</div>";
          }
          return result;
          // console.log("Tooltip",serie, x, y);
          // return "TOOLTIP"
        }
     options.chart.showTiles = false;

     options.chart.showTiles = false;

    return options;
  };

  this.getDecoration = function (options) {
    // console.log(options)
    if (angular.isDefined(options)) {

       options.chart.tooltipContent = function (serie, x, y, s) {
        console.log("Tooltip",serie, x, y);
          var result = "<center><b>" + serie.properties.name.en + "</center></b>";
          if (serie.properties.values && serie.properties.values[y.index()].c>=0) {
            result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + 
                      serie.properties.values[y.index()].l + 
                      " : " + 
                      serie.properties.values[y.index()].v + "</div>";
          }
          return result;
          // console.log("Tooltip",serie, x, y);
          // return "TOOLTIP"
        }
     options.chart.showTiles = false;




      var decoration = {};
      decoration.height = options.chart.height;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.color = options.chart.color;

      decoration.showLabels = options.chart.showLabels;
      decoration.showValues = options.chart.showValues;
      decoration.showTiles = options.chart.showTiles;
      decoration.selectedTiles = options.chart.selectedTiles;
      decoration.interactive = options.chart.interactive;
      decoration.defaultFill = options.chart.defaultFill;
      decoration.defaultFillOpacity = options.chart.defaultFillOpacity;
      decoration.defaultStroke = options.chart.defaultStroke;
      decoration.defaultStrokeWidth = options.chart.defaultStrokeWidth;
      decoration.defaultStrokeOpacity = options.chart.defaultStrokeOpacity;
      decoration.selectedFillOpacity = options.chart.selectedFillOpacity;
      decoration.selectedStrokeWidth = options.chart.selectedStrokeWidth;


      return decoration;
    }
  };
});
//console.log("Nvd3ChordChartCtrl");
m.controller("Nvd3SimpleMapCtrl",




  function ($scope, NVD3Widget, NVD3MapAdapter,$http, APIProvider, $q) {
    $scope.APIProvider = new APIProvider($scope);
      
      $scope.decorationAdapter = NVD3MapAdapter ;
      $scope.settings = {};
      $scope.options;
      $scope.data;
      $scope.APIProvider = new APIProvider($scope);
      

      $scope.update = function(){

        function loadOptions(){
            return $http.get("./widgets/v2.simple-map/options.json");
        }

        function loadData(){
          return $http.get("."+$scope.widget.serieID)
        
          // return $http.get("./api/data/process/"+$scope.widget.serieID)
        }

        $q.all([
            loadOptions().then( (resp) =>{
                $scope.options = resp.data;

                if($scope.widget.decoration){
                    $scope.decorationAdapter.applyDecoration($scope.options,$scope.widget.decoration)
                  }else{
                    $scope.widget.decoration = $scope.decorationAdapter.getDecoration($scope.options);
                  }
                 
            }),
            loadData().then( (resp) =>{
              console.log(resp);
                $scope.data = 
                // (params.serieAdapter && params.serieAdapter.getSeries) ? 
                //     params.serieAdapter.getSeries(resp.data.value) : 
                   // [ resp.data.value ];
                   [ resp.data ]
            })
        ]).then( () =>{
            // console.log("NVD3 options", $scope.options)
            // console.log("NVD3 data", $scope.data)
              
          
            $scope.settings = {
                options : angular.copy($scope.options), 
                data : angular.copy($scope.data)
            }
           
        });
    }    

    new APIProvider($scope)
      .config(function(){
        if($scope.widget.serieID) $scope.update();
      })







    // new NVD3Widget($scope, {
    //   dialog: MapChartDialog,
    //   decorationAdapter: NVD3MapAdapter,
    //   optionsURL: "/widgets/nvd3-map/options.json",
    //   serieAdapter: {
    //     //getX:function(d){return d.label},
    //     //getY:function(d){return d.value}
    //     tooltipContent: function (serie, x, y, s) {
    //       var result = "<center><b>" + serie.properties.name + "</center></b>";
    //       if (serie.properties.value != null) {
    //         result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + serie.properties.key + " : " + serie.properties.value + "</div>";
    //       }
    //       return result;
    //     }
    //   },
    //   // serieGenerator: MapSerieGenerator
    // });
  });
//console.log("Loaded")
