import angular from 'angular';


const m = angular.module('app.widgets.v2.hbar-chart-adapter', []);

m.service('HBarChartAdapter', function () {

  this.onSelectSerie = (selection,settings,api) => {
    let data = d3.select(api.getSVG()).data();
    settings.data.forEach((s) => {
      let f = selection.filter(l => l.key == s.key)[0]
      if(f){
        s.disabled =  f.disabled
      }
    })
    return settings;
  }

  this.onSelectObject = this.onSelectSerie;
  
  this.applyDecoration = function (options, decoration, selector,api) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      //console.log(options)
      options.chart.height = decoration.height;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.xAxis.axisLabel = decoration.xAxisName;
      options.chart.yAxis.axisLabel = decoration.yAxisName;
      // options.chart.xAxis.staggerLabels = decoration.staggerLabels;
      // options.chart.rotateLabels = decoration.xAxisAngle;
      // options.chart.reduceXTicks = decoration.reduceXTicks;
      options.chart.showControls = decoration.showControls;
      options.chart.stacked = decoration.stacked;
      options.chart.color = (decoration.color) ? decoration.color : null;

       if(decoration.enableEmitEvents){
        
        if(api){
          
          api.onReady(function(){
              d3
                .select(api.getSVG())
                .selectAll("g.nv-bar")
                .style("cursor", "pointer");  
            })
          
        }

        options.chart.legend.dispatch = {
          stateChange: function(e) {
            selector.selectSerie(e.disabled);
          }
        }

        options.chart.multibar.dispatch = {
          elementClick : function(e) {
            selector.selectObject(e.point.label);
            var labels = d3
              .select(api.getSVG())
              .select(".nv-x")
              .selectAll("text")
              .style("fill",function(d){
                var o = selector.object(d);
                return (o && o.disabled) ? "#000000": "#f04124"
              })
              .style("font-weight",function(d){
                var o = selector.object(d);
                return (o && o.disabled) ? "normal": "bold"
              })
          },
          
          elementDblClick: function(e) {
            selector.selectOneObject(e.point.label);
            var labels = d3
              .select(api.getSVG())
              .select(".nv-x")
              .selectAll("text")
              .style("fill",function(d){
                var o = selector.object(d);
                return (o && o.disabled) ? "#000000": "#f04124"
              })
              .style("font-weight",function(d){
                var o = selector.object(d);
                return (o && o.disabled) ? "normal": "bold"
              })
          }
        }

      }
    }
    return options;
  }

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      var decoration = {}
      decoration.height = options.chart.height;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.xAxisName = options.chart.xAxis.axisLabel;
      decoration.yAxisName = options.chart.yAxis.axisLabel;
      // decoration.xAxisAngle = options.chart.rotateLabels;
      // decoration.reduceXTicks = options.chart.reduceXTicks;
      // decoration.staggerLabels = options.chart.xAxis.staggerLabels;
      decoration.color = options.chart.color;
      decoration.showControls = options.chart.showControls;
      decoration.stacked = options.chart.stacked;
      return decoration;
    }
  }
});