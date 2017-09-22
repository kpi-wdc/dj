import angular from 'angular';



const m = angular.module("app.widgets.v2.geochart-adapter",[]);


m.service("GeochartAdapter", [

  "i18n",

  function (i18n) {

   this.onSelectSerie = (selection,settings,api) => {
    // let data = d3.select(api.getSVG()).data();
    settings.data[0].series.forEach((s) => {
      let f = selection.filter(l => l.key == s.key)[0]
      if(f){
        s.disabled =  f.disabled
      }
    })
    return settings;
  }

  this.onSelectObject = (selection,settings,api) => {
    // console.log("selectObjects",selection)
    let selectedObjects = selection.filter(s => !s.disabled);
    // console.log("features", settings.data[0].features)
    settings.data[0].features.forEach((o) => {
      if(selectedObjects.filter(so => 
                           o.properties.name.en == so.key
                        || o.properties.name.uk == so.key
                        || o.properties.name.ru == so.key
                        || o.properties.geocode == so.key
                        
                        || o.properties.name.en.indexOf(so.key)>=0
                        || o.properties.name.uk.indexOf(so.key)>=0
                        || o.properties.name.ru.indexOf(so.key)>=0

                        || so.key.indexOf(o.properties.name.en)>=0
                        || so.key.indexOf(o.properties.name.uk)>=0
                        || so.key.indexOf(o.properties.name.ru)>=0


                        || o.properties.name.en == so.id
                        || o.properties.name.uk == so.id
                        || o.properties.name.ru == so.id
                        || o.properties.geocode == so.id
                        
                        || o.properties.name.en.indexOf(so.id)>=0
                        || o.properties.name.uk.indexOf(so.id)>=0
                        || o.properties.name.ru.indexOf(so.id)>=0

                        || so.id.indexOf(o.properties.name.en)>=0
                        || so.id.indexOf(o.properties.name.uk)>=0
                        || so.id.indexOf(o.properties.name.ru)>=0
                      ).length > 0){
        o.disabled = false
      }else{
        o.disabled = true
      }      
    })
     // console.log("settings",settings)  
    return settings;
  }  
    
  this.applyDecoration = function (options, decoration, selector,api) {
    if (angular.isDefined(decoration) && angu
      options.chart.height = decoration.height;
      // options.chart.width = decoration.width;
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
      options.chart.boundary = decoration.boundary;
      
      options.chart.locale = i18n.locale();
      if(decoration.enableEmitEvents){
        
        // if(api){
          
        //   api.onReady(function(){
        //       d3
        //         .select(api.getSVG())
        //         .selectAll(".nv-bar")
        //         .style("cursor", "pointer");  
        //     })
          
        // }

        options.chart.legend.dispatch = {
          stateChange: function(e) {
            selector.selectSerie(e.disabled);
          }
        }

        // options.chart.multibar.dispatch = {
        //   elementClick : function(e) {
        //     selector.selectObject(e.point.label);
        //     var labels = d3
        //       .select(api.getSVG())
        //       .select(".nv-x")
        //       .selectAll("text")
        //       .style("fill",function(d){
        //         var o = selector.object(d);
        //         return (o && o.disabled) ? "#000000": "#f04124"
        //       })
        //       .style("font-weight",function(d){
        //         var o = selector.object(d);
        //         return (o && o.disabled) ? "normal": "bold"
        //       })
        //   },
          
        //   elementDblClick: function(e) {
        //     selector.selectOneObject(e.point.label);
        //     var labels = d3
        //       .select(api.getSVG())
        //       .select(".nv-x")
        //       .selectAll("text")
        //       .style("fill",function(d){
        //         var o = selector.object(d);
        //         return (o && o.disabled) ? "#000000": "#f04124"
        //       })
        //       .style("font-weight",function(d){
        //         var o = selector.object(d);
        //         return (o && o.disabled) ? "normal": "bold"
        //       })
        //   }
        // }

      }
           
    }
    return options;
  };

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;

      // decoration.width = options.chart.width;

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
      decoration.boundary = options.chart.boundary;
      return decoration;
    }
  };
}]);

