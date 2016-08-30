// Timeline Utils
// 





function generatePath(points){
  return d3.svg.area()
        .interpolate("linear")
        .x(function (p, i) {
              return p.x;
        })
        .y0(function (p, i) {
              return p.y;
        })
        .y1(function (p, i) {
              return p.y;
        })
        .apply(this, [points]);
} 


var layout = function(){
  this._layout = d3.layout.timeline();
  this._data = undefined;
  this._width = undefined;
  this._height = undefined;
  this._extent = undefined;
  this._childAccessor = function(d){return d.childs}
  this._bands = [];
}

layout.prototype = {
  
  size : function(_){
    if(!_) return [this._width, this._height]; 
    this._width = _[0];
    this._height = _[1];
    return this;
  },
 
  width : function(_){
    if(!_) return this._width; 
    this._width = _;
    return this;
  },
  
  height : function(_){
    if(!_) return this._height; 
    this._height = _;
    return this;
  },

  extent : function(_){
    if(!_) return this._extent; 
    this._extent = _;
    return this;
  },

  childAccessor : function(_){
    if(!_) return this._childAccessor; 
    this._childAccessor = _;
    return this;
  },

  bands : function(){
   return this._bands; 
  },

  data : function(_){
    if(!_) return this._data; 
    this._data = _;
    return this;
  },

  fit : function(){
        var swimlines = [];
        var thos = this;
        this._data.forEach(function(serie,i){
            thos._layout
              .size([thos._width,thos._height/thos._data.length])
              .extent(thos._extent)
              .childAccessor(thos._childAccessor)
            
            var tmp = thos._layout(serie.values);
            var swimline = {y:[],dy:[]}
            tmp.forEach(function(d){
              if(swimline.y.indexOf(d.y)<0){swimline.y.push(d.y)}
              if(swimline.dy.indexOf(d.dy)<0){swimline.dy.push(d.dy)}
            })
            swimline.dy = d3.min(swimline.dy,function(t){return t})
            swimlines.push(swimline);
            thos._bands.push(tmp)
        })

        
        var minWidth = d3.min(swimlines,function(d){return d.dy})
        var sumWidth = 0;
        swimlines.forEach(function(d){
          d.ratio = minWidth * d.y.length;
          sumWidth += d.ratio;
        })
        var cumulate = 0
        swimlines.forEach(function(d){
          d.ratio /= sumWidth;
          d.height = minWidth;
          d.hOffset = cumulate;
          cumulate+= d.ratio
        })

        this._data.forEach(function(serie,i){
          serie.layout = {
            ratio : swimlines[i].ratio,
            eventHeight : swimlines[i].height,
            yOffset :  swimlines[i].hOffset
          }
        });
        return this;
      }
  }




nv.models.timelineChart = function(){
	"use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        
        width = 960,
        
        height = 500,
        
        color = nv.utils.defaultColor(),

        // timeline = nv.models.timeline(),

        axis = nv.models.axis(),

        brush = d3.svg.brush(),
        
        brushAxis = nv.models.axis(),

        brushRatio = 0.2,

        legend = nv.models.legend()
        	.key(function(d){return d.category})
        	// .min(1)
        	.radioButtonMode(false),

        dispatch = d3.dispatch("stateChange", "changeState"),

        state = {},

        defaultState = null;


        // local variables
        //  

        var domain = [],
        	_domain = [],
        	line = [];
/////////////////////////////////////////////////////////////////////////////////////////////////
		var insert_Id = function(data,id){
			if(id == undefined) id = 0
		    data.forEach(function(d,i){
		      d._id = id;
		      id++;
		      if(d.childs) insert_Id(d.childs,id)
		    }) 
		}



		var createLine = function(values,line){
			if (line == undefined) line = [];
		    values.forEach(function(d){
		        line.push({
		          start:d.start,
		          end:d.end,
		          context:d.context,
		          _id:d._id
		        })
		        if(d.childs) line = createLine(d.childs)
		    })
		    return line;
		}


		var insertId = function(data,line,index){
			if(index == undefined) index = 0
			data.forEach(function(d,i){
			  d.id = line[index]._id;
			  index++;
			  if(d.childs) insertId(d.childs,line,index)
			}) 
		}


		var insertSerieIndex = function(values,s,i){
		  values.forEach(function(d){
		    d.serieIndex = s;
		    d.bandIndex = i;
		    
		    if(d.childs) insertSerieIndex(d.childs,s,i);
		  })
		}

		var convertData = function(series){
		    
		    series.forEach(function(d){
		      insert_Id(d.values);
		    })
		    
		    line = [];
		    
		    series.forEach(function(d){
		      line = createLine(d.values,line);
		    })
		    
		    line.sort(function(a,b){
		      if(date.subtract(new Date(a.start), new Date(b.start)).toMilliseconds() !=0)
		        return date.subtract(new Date(a.start), new Date(b.start)).toMilliseconds()
		      return a._id - b._id
		    })

		    domain = [line[0].start, line[line.length-1].end]

		    line.forEach(function(d,i){d.id = i})

		    line.sort(function(a,b){
		       return a._id - b._id
		    })
		    
		    series.forEach(function(d,i){
		      insertId(d.values,line);
		      insertSerieIndex(d.values,d.colorIndex,i)
		    })
		    
		   
		}


/////////////////////////////////////////////////////////////////////////////////////////////////
    
    function chart (selection){

    	selection.each(function (_d) {
    		
    		var data = _d.filter(function(item){return item.disabled == false || item.disabled == undefined})
        	
        	convertData(data);
        	// domain = _domain;
        	


    	// prepare visualization
    	// 
    	 
    	var brushHeight = (height - margin.top - margin.bottom)*brushRatio;    
        
    	var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom-brushHeight-20;
        
        container = d3.select(this);


       	var btm = d3.layout.timeline()
		              .size([2*availableWidth/3,brushHeight])
		              .childAccessor(function (d) {return d.childs});
		 
		  var brushedTimelineBands = btm(line)
		  brushedTimelineBands.sort(function(a,b){
		        return a.id-b.id
		      })

		  var container = d3.select(this),
              that = this;

           state.disabled = _d.map(function (item) {
	          return !!item.disabled;
	        });

	        if (!defaultState) {
	          var key;
	          defaultState = {};
	          for (key in state) {
	            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
	          }
	        }


	        chart.update = function() { container.transition().call(chart); };
	        
	        chart.container = this;      

        
        var wrap = container.selectAll("g.nv-wrap.nv-timeline").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-timeline").append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "brush");
        gEnter.append("g").attr("class", "series");
        gEnter.append("g").attr("class", "nv-legendWrap");
      




        // gEnter.append("g").attr("class", "nv-legendWrap");

          legend.width(availableWidth);

          var temp = g.select(".nv-legendWrap").datum(_d)
          // console.log("gEnter.select(\".nv-legendWrap\").datum(data)",temp)
          temp.call(legend);
         
          // if (margin.top != legend.height()) {
            margin.top = legend.height() + 5;
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom -brushHeight-20;
          // }

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + 0 + ")");





		  var l = new layout()
		    .data(data)
		    .size([availableWidth,availableHeight])
		    .extent(domain)
		    .fit();
		 
		  var data1 = l.data(); 
      		
 	      var x = d3.time.scale()
	            .domain(btm.extent())
	            .range([0, availableWidth]);

		  var startScale = d3.time.scale()
		            .domain(btm.extent())
		            .range([0, availableWidth]);          
		  




		  axis
		  	.scale(x)
            .orient("bottom")
            .tickSize(-availableHeight, 0)
            .tickPadding(7)
            .tickFormat(d3.time.format.multi([
                [".%L", function(d) { return d.getMilliseconds(); }],
                [":%S", function(d) { return d.getSeconds(); }],
                ["%I:%M", function(d) { return d.getMinutes(); }],
                ["%I %p", function(d) { return d.getHours(); }],
                ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                ["%b %d", function(d) { return d.getDate() != 1; }],
                ["%B", function(d) { return d.getMonth(); }],
                ["%Y", function() { return true; }]
              ]))
            // .ticks(20)	

        //------------------------------------------------------------
        // Setup containers and skeleton of chart
        

        var xAxisG =  g.select(".nv-x.nv-axis")
					    .attr("transform", "translate("+margin.left+","+(availableHeight+margin.top)+")")

		xAxisG.transition().call(axis);

		var invertScale = d3.time.scale()
							.domain(startScale.range())
							.range(startScale.domain())
  
  		var brushScale =  d3.time.scale()
            .domain([
              new Date(invertScale(0-availableWidth*0.25)), 
              new Date(invertScale(availableWidth+availableWidth*0.25))
            ])
            .range([0, availableWidth]);

        brush
        	.x(brushScale.range([0, availableWidth]))         

         brushAxis
		  	.scale(brushScale)
            .orient("bottom")
            .tickSize(-brushHeight, 0)
            .tickPadding(7)
            .tickFormat(d3.time.format.multi([
                [".%L", function(d) { return d.getMilliseconds(); }],
                [":%S", function(d) { return d.getSeconds(); }],
                ["%I:%M", function(d) { return d.getMinutes(); }],
                ["%I %p", function(d) { return d.getHours(); }],
                ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                ["%b %d", function(d) { return d.getDate() != 1; }],
                ["%B", function(d) { return d.getMonth(); }],
                ["%Y", function() { return true; }]
              ]))
            .showMaxMin(false)      
        

		var brushG = g.select(".brush")
						.attr("transform", "translate("+margin.left+","+(availableHeight+margin.top+20)+")")									    

		brushG
		    .append("g")
		    .attr("class", "nv-x nv-axis")
		    .attr("transform", "translate("+0+","+(brushHeight)+")")
		
		g.select(".brush").select(".nv-x.nv-axis")    
		    .transition()
		    .call(brushAxis)

		brushG
		    .append("g")
		    .attr("class", "brush-control")
		
		g.select(".brush").select(".brush-control")    
		    .transition()
		    .call(brush)    

		var seriesG = g.select(".series")
						.attr("transform",function(d){
							return "translate("+margin.left+","+margin.top+")"
						})

		var timelineBands = l.bands();
		

		var seriesContainer = g.select(".series").selectAll(".serie").data(timelineBands)

		seriesContainer
			.enter()
			.append("g")
			.attr("class","serie")
			.attr("transform",function(d,i){
				return "translate("+0+","+ ((availableHeight)*data1[i].layout.yOffset)+")"
			})

		seriesContainer
			.exit()
			.remove()

		g.select("g.series").selectAll(".serie")
			.transition()
			.attr("transform",function(d,i){
				return "translate("+0+","+ ((availableHeight)*data1[i].layout.yOffset)+")"
			})
		
		var items = g
					.select("g.series")
					.selectAll(".serie")
					.selectAll(".item")
					.data(function (d) {
			          return d;
			        });

		items
			.enter()
			.append("rect")
			.attr("class", "item")
			.style("fill-opacity", function(d){
	      		return 0
	      	}) 
	      	.style("stroke-width", function(d){
	      		0
	      	})
	      	.style("stroke-opacity", function(d){
	      		0
	      	})
	      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
			.style("stroke", function (d,i) {return color(d,d.serieIndex)})
		
		items.exit().remove()      	
		      	
		
		items
			.transition()
			.attr("x", function (d) {
		    	return (d.type == "instant")? d.start-2.5 : d.start
	      	})
	      	.attr("y", function (d) {return d.y})
	      	.attr("width", function (d) {
	      		return ((d.end - d.start)<5) ? 5 : d.end - d.start
	      	})
	      	.attr("height", function (d) {
	      	  return (d.type == "flow") ? d.dy : data1[d.bandIndex].layout.eventHeight
	        })
	      	.style("fill-opacity", function(d){
	      		return (d.type == "flow") ? 0.05 : 0.5
	      	}) 
	      	.style("stroke-width", function(d){
	      		return (d.type == "flow") ? 0.3 : 0.5
	      	})
	      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
			.style("stroke", function (d,i) {return color(d,d.serieIndex)})
	      	
   		
 		legend.dispatch.on("stateChange", function (newState) {
          console.log("state change", newState)
          state = newState;
          // dispatch.changeState(state);
          data.forEach(function (series, i) {
              series.disabled = state.disabled[i];
            });

          chart.update();
        });
	        
	    
 		dispatch.on("stateChange", function (e) {
          // console.log("stateChange",e)
          if (typeof e.disabled !== "undefined" && data.length === e.disabled.length) {
            data.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          chart.update();
        });

    	});

    	return chart;

    }

     //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    
    // d3.rebind(chart, scatter, "id", "interactive", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "forceX", "forceY", "forceSize", "clipVoronoi", "useVoronoi", "clipRadius", "padData", "highlightPoint", "clearHighlights");

    chart.options = nv.utils.optionsFunc.bind(chart);
    chart.legend = legend;
    chart.dispatch = dispatch; 

    // chart.timeline = timeline;

    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin.top = typeof _.top != "undefined" ? _.top : margin.top;
      margin.right = typeof _.right != "undefined" ? _.right : margin.right;
      margin.bottom = typeof _.bottom != "undefined" ? _.bottom : margin.bottom;
      margin.left = typeof _.left != "undefined" ? _.left : margin.left;
      return chart;
    };

    chart.width = function (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    
    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      this.color = color;
      legend.color(color);
      return chart;
    };

    chart.state = function (_) {
      if (!arguments.length) return state;
      state = _;
      return chart;
    };

    chart.defaultState = function (_) {
      if (!arguments.length) return defaultState;
      defaultState = _;
      return chart;
    };

  
    //============================================================
    
 	return chart;   
}





  // nv.models.radar = function () {
  //   "use strict";
  //   //============================================================
  //   // Public Variables with Default Settings
  //   //------------------------------------------------------------

  //   var scatter = nv.models.scatter();
  //   //console.log("Before",scatter)
  //   scatter.x(function (d, i) {
  //     return calculateX(d.value, i);
  //   }).y(function (d, i) {
  //     return calculateY(d.value, i);
  //   });
  //   //console.log("After",scatter)


  //   var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  //       width = 960,
  //       height = 500,
  //       color = nv.utils.defaultColor() // a function that returns a color
  //   ,
  //       getX = function (d, i) {
  //     return calculateX(d.value, i);
  //   } // accessor to get the x value from a data point
  //   ,
  //       getY = function (d, i) {
  //     return calculateY(d.value, i);
  //   } // accessor to get the y value from a data point
  //   ,
  //       getLabel = undefined //function(d) { return d.y }
  //   ,
  //       defined = function (d, i) {
  //     return !isNaN(getY(d, i)) && getY(d, i) !== null;
  //   } // allows a line to be not continuous when it is not defined
  //   ,
  //       isArea = function (d) {
  //     return d.area;
  //   } // decides if a line is an area or just a line
  //   ,
  //       clipEdge = false // if true, masks lines within x and y scale
  //   ,
  //       x //can be accessed via chart.xScale()
  //   ,
  //       y //can be accessed via chart.yScale()
  //   ,
  //       interpolate = "linear" // controls the line interpolation
  //   ,
  //       serieLength,
  //       serieCount,
  //       max,
  //       tickCount = 10,
  //       scales = d3.scale.linear(),
  //       showGrid = true,
  //       showTickLabels = true,
  //       showAxisLabels = true;

  //   scatter.size(16) // default size
  //   .sizeDomain([16, 256]);

  //   //============================================================


  //   //============================================================
  //   // Private Variables
  //   //------------------------------------------------------------

  //   var x0, y0 //used to store previous scales
  //   ;

  //   //============================================================


  //   function chart(selection) {
  //     //console.log("Selection",selection)

  //     selection.each(function (data) {
  //       // console.log("RADAR",data)
  //       serieCount = data.length;
  //       serieLength = data[0].values.length;
  //       max = data[0].values[0].value;
  //       for (var i in data) {
  //         var m = data[i].values[0].value;
  //         m = data[i].values.reduce(function (v, item) {
  //           m = Math.max(m, item.value);
  //           return m;
  //         });
  //         max = Math.max(max, m);
  //       }
  //       max += max * 0.1;


  //       var availableWidth = width - margin.left - margin.right,
  //           availableHeight = height - margin.top - margin.bottom,





  //       //radius = Math.min(availableWidth,availableHeight),
  //       container = d3.select(this);
  //       //console.log("RADAR",availableWidth,availableHeight,radius)
  //       //------------------------------------------------------------
  //       // Setup Scales

  //       scales.domain([-1, 1]);

  //       //console.log("SCALES",radius,scales(-1),scales(1));

  //       scatter.xDomain([-1, 1]).yDomain([-1, 1]).xScale(scales).yScale(scales);

  //       y = scatter.yScale();
  //       x = scatter.xScale();

  //       x0 = x0 || x;
  //       y0 = y0 || y;

  //       //------------------------------------------------------------


  //       //------------------------------------------------------------
  //       // Setup containers and skeleton of chart

  //       var wrap = container.selectAll("g.nv-wrap.nv-line").data([data]);
  //       var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-line");
  //       var defsEnter = wrapEnter.append("defs");
  //       var gEnter = wrapEnter.append("g");
  //       var g = wrap.select("g");

  //       gEnter.append("g").attr("class", "nv-groups");
  //       gEnter.append("g").attr("class", "nv-scatterWrap");
  //       gEnter.append("g").attr("class", "nv-grid");
  //       var mt = margin.top + 20;
  //       var ml = margin.left;
  //       wrap.attr("transform", "translate(" + ml + "," + mt + ")");

  //       //------------------------------------------------------------


  //       scatter.width(availableWidth).height(availableHeight);
  //       //    //.xScale(scatter.yScale())
  //       //    .useVoronoi(false)

  //       //scatter
  //       //    .width(radius)
  //       //    .height(radius)
  //       //    //.xScale(scales)
  //       //    //.yScale(scales)
  //       //    //.useVoronoi(false)

  //       var scatterWrap = wrap.select(".nv-scatterWrap");
  //       //.datum(data); // Data automatically trickles down from the wrap

  //       scatterWrap.transition().call(scatter);


  //       defsEnter.append("clipPath").attr("id", "nv-edge-clip-" + scatter.id()).append("rect");

  //       wrap.select("#nv-edge-clip-" + scatter.id() + " rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);

  //       g.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");
  //       scatterWrap.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");

  //       var grid = wrap.select(".nv-grid");
  //       grid.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");


  //       var groups = wrap.select(".nv-groups").selectAll(".nv-group").data(data)
  //       // .data(function (d) {
  //       //   return d;
  //       // }, function (d) {
  //       //   return d.key;
  //       // });
  //       groups.enter().append("g").style("stroke-opacity", 0.000001).style("fill-opacity", 0.000001);

  //       groups.exit().remove();

  //       groups.attr("class", function (d, i) {
  //         return "nv-group nv-series-" + i;
  //       }).classed("hover", function (d) {
  //         return d.hover;
  //       }).style("fill", function (d, i) {
  //         return color(d, i);
  //       }).style("stroke", function (d, i) {
  //         return color(d, i);
  //       });
  //       groups.transition().style("stroke-opacity", 1).style("fill-opacity", 0.3);


  //       var areaPaths = groups.selectAll("path.nv-area").data(function (d) {
  //         return isArea(d) ? [d] : [];
  //       }); // this is done differently than lines because I need to check if series is an area
  //       areaPaths.enter().append("path").attr("class", "nv-area").attr("d", function (d) {
  //         return d3.svg.area().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX(d, i)));
  //         }).y0(function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY(d, i)));
  //         })
  //         //.y1(function(d,i) { return y0( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
  //         .y1(function (d, i) {
  //           return y0(0);
  //         }) //assuming 0 is within y domain.. may need to tweak this
  //         .apply(this, [d.values]);
  //       });

  //       groups.exit().selectAll("path.nv-area").remove();

  //       areaPaths.transition().attr("d", function (d) {
  //         return d3.svg.area().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX(d, i)));
  //         }).y0(function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY(d, i)));
  //         })
  //         //.y1(function(d,i) { return y( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
  //         .y1(function (d, i) {
  //           return y0(0);
  //         }) //assuming 0 is within y domain.. may need to tweak this
  //         .apply(this, [d.values]);
  //       });


  //       var linePaths = groups.selectAll("path.nv-line").data(function (d) {
  //         return [d.values];
  //       });
  //       linePaths.enter().append("path").attr("class", "nv-line").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //         return nv.utils.NaNtoZero(x0(getX(d, i)));
  //       }).y(function (d, i) {
  //         return nv.utils.NaNtoZero(y0(getY(d, i)));
  //       }));

  //       linePaths.transition().style("stroke-width", "2px").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //         return nv.utils.NaNtoZero(x(getX(d, i)));
  //       }).y(function (d, i) {
  //         return nv.utils.NaNtoZero(y(getY(d, i)));
  //       }));

  //       // create grid levels
  //       if (showGrid) {
  //         var gridLevels = wrap.select(".nv-grid").selectAll("path.nv-grid-level").data(getGridData());

  //         gridLevels.exit().remove();

  //         gridLevels.enter().append("path").attr("class", "nv-grid-level").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX(d, i)));
  //         }).y(function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY(d, i)));
  //         }));


  //         gridLevels.style("stroke", "#000000").style("fill", "none").style("opacity", 0.3).style("stroke-width", "0.6px");

  //         gridLevels.transition().attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX(d, i)));
  //         }).y(function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY(d, i)));
  //         }));

  //         // create grid axises
  //         gridLevels = wrap.select(".nv-grid").selectAll("line.nv-grid-axis").data(getGridAxis(data));
  //         gridLevels.exit().remove();
  //         gridLevels.enter().append("svg:line").attr("class", "nv-grid-axis").attr("x1", function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX({ value: max * 0.00001 }, i)));
  //         }).attr("y1", function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY({ value: max * 0.00001 }, i)));
  //         }).attr("x2", function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX(d, i)));
  //         }).attr("y2", function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY(d, i)));
  //         });

  //         gridLevels.style("stroke", "#000").style("fill", "none").style("opacity", 0.3).style("stroke-width", "1px");


  //         gridLevels.transition().attr("class", "nv-grid-axis").attr("x1", function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX({ value: max * 0.00001 }, i)));
  //         }).attr("y1", function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY({ value: max * 0.00001 }, i)));
  //         }).attr("x2", function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX(d, i)));
  //         }).attr("y2", function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY(d, i)));
  //         });
  //       }
  //       //create  grid labels
  //       if (showAxisLabels) {
  //         var gridLevels = wrap.select(".nv-grid").selectAll("text.nv-grid-label").data(getGridAxis(data));
  //         gridLevels.exit().remove();
  //         gridLevels.enter().append("text").attr("class", "nv-grid-label").style("fill", function (d, i) {
  //           return "#000000";
  //         }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
  //           return getTextAnchor(d, i);
  //         }).attr("x", function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX(d, i)));
  //         }).attr("y", function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY(d, i)));
  //         }).attr("dy", function (d, i) {
  //           return getDy(d, i);
  //         }).classed("nv-label", true).text(function (d, i) {
  //           return d.label;
  //         });

  //         gridLevels.style("stroke", "none").style("opacity", 0.9);

  //         gridLevels.transition().attr("class", "nv-grid-label").style("fill", function (d, i) {
  //           return "#000000";
  //         }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
  //           return getTextAnchor(d, i);
  //         }).attr("x", function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX(d, i)));
  //         }).attr("y", function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY(d, i)));
  //         }).attr("dy", function (d, i) {
  //           return getDy(d, i);
  //         })
  //         //.classed('nv-label',true)
  //         .text(function (d, i) {
  //           return d.label;
  //         });
  //       }

  //       // create tick labels
  //       if (showTickLabels) {
  //         var gridLevels = wrap.select(".nv-grid").selectAll("text.nv-grid-tick-label").data(getTickLabels());
  //         gridLevels.exit().remove();
  //         gridLevels.enter().append("text").attr("class", "nv-grid-tick-label").style("fill", function (d, i) {
  //           return "#000000";
  //         }).style("font", "bold x-small Arial").style("text-anchor", "start").attr("x", function (d, i) {
  //           return nv.utils.NaNtoZero(x0(getX({ value: 0 }, 0)));
  //         }).attr("y", function (d, i) {
  //           return nv.utils.NaNtoZero(y0(getY(d, 0)));
  //         }).attr("dy", "-0.2em").classed("nv-label", true).text(function (d, i) {
  //           return d.value.toFixed(2);
  //         });

  //         gridLevels.style("stroke", "none").style("opacity", 0.7);

  //         gridLevels.transition().attr("class", "nv-grid-tick-label").style("fill", function (d, i) {
  //           return "#000000";
  //         }).style("text-anchor", "start").style("font", "bold x-small Arial").attr("x", function (d, i) {
  //           return nv.utils.NaNtoZero(x(getX({ value: 0 }, 0)));
  //         }).attr("y", function (d, i) {
  //           return nv.utils.NaNtoZero(y(getY(d, 0)));
  //         }).attr("dy", "-0.2em").text(function (d, i) {
  //           return d.value.toFixed(2);
  //         });
  //       }


  //       //store old scales for use in transitions on update
  //       x0 = x.copy();
  //       y0 = y.copy();
  //     });

  //     return chart;
  //   }

  //   function getTextAnchor(d, i) {
  //     var x = Math.sin(angle(i));
  //     if (Math.abs(x) < 0.1) return "middle";
  //     if (x > 0.1) return "end";
  //     return "start";
  //   }

  //   function getDy(d, i) {
  //     if (i == 0) return "-1.5em";
  //     var y = Math.cos(angle(i));
  //     if (Math.abs(y) < 0.1) return ".72em";
  //     if (y > 0.1) return "-.3em";
  //     return "1em";
  //   }

  //   function angle(i) {
  //     return -i * (2 * Math.PI / serieLength); // + ((2 * Math.PI) * startAngle / 360) + (cursor * 2 * Math.PI) / length;
  //   }


  //   // x-caclulator
  //   // d is the datapoint, i is the index, length is the length of the data
  //   function calculateX(d, i) {
  //     var l = d / max; // x(d);
  //     //console.log("X",d,l,length,i,angle(i, length),2*Math.PI/angle(i, length),Math.sin(angle(i, length)) * l);
  //     return Math.sin(angle(i)) * l;
  //   }

  //   // y-calculator
  //   function calculateY(d, i) {
  //     var l = d / max; // y(d);
  //     //console.log("Y",d,l,length,i,angle(i, length),2*Math.PI/angle(i, length),Math.cos(angle(i, length)) * l);
  //     return Math.cos(angle(i)) * l;
  //   }

  //   function getGridData() {
  //     var gridData = [];
  //     for (var i = 0; i < tickCount; i++) {
  //       var levelKey = max * (i + 1) / tickCount;
  //       var level = [];
  //       level.key = (levelKey * 100).toFixed(0) + "%";
  //       //level.values = [];
  //       for (var j = 0; j < serieLength; j++) {
  //         level.push({ value: levelKey });
  //       }
  //       gridData.push(level);
  //     }
  //     //console.log(gridData)
  //     return gridData;
  //   }

  //   function getGridAxis(data) {
  //     var gridAxis = [];
  //     for (var j = 0; j < serieLength; j++) {
  //       //var axis = [];
  //       //axis.push({label:"",value:0});
  //       //axis.push({label:data[0].values[j].label,value:max});
  //       gridAxis.push({ label: data[0].values[j].label, value: max });
  //     }

  //     //console.log(gridData)
  //     return gridAxis;
  //   }

  //   function getTickLabels() {
  //     var tickLabels = [];
  //     for (var i = 0; i < tickCount; i++) {
  //       tickLabels.push({ value: max * (i + 1) / tickCount });
  //     }
  //     //console.log(gridData)
  //     return tickLabels;
  //   }


  //   //============================================================
  //   // Expose Public Variables
  //   //------------------------------------------------------------

  //   chart.dispatch = scatter.dispatch;
  //   chart.scatter = scatter;

  //   d3.rebind(chart, scatter, "id", "interactive", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "forceX", "forceY", "forceSize", "clipVoronoi", "useVoronoi", "clipRadius", "padData", "highlightPoint", "clearHighlights");

  //   chart.options = nv.utils.optionsFunc.bind(chart);

  //   chart.margin = function (_) {
  //     if (!arguments.length) return margin;
  //     margin.top = typeof _.top != "undefined" ? _.top : margin.top;
  //     margin.right = typeof _.right != "undefined" ? _.right : margin.right;
  //     margin.bottom = typeof _.bottom != "undefined" ? _.bottom : margin.bottom;
  //     margin.left = typeof _.left != "undefined" ? _.left : margin.left;
  //     return chart;
  //   };

  //   chart.width = function (_) {
  //     if (!arguments.length) return width;
  //     width = _;
  //     return chart;
  //   };

  //   chart.height = function (_) {
  //     if (!arguments.length) return height;
  //     height = _;
  //     return chart;
  //   };

  //   chart.x = function (_) {
  //     if (!arguments.length) return getX;
  //     getX = _;
  //     scatter.x(_);
  //     return chart;
  //   };

  //   chart.y = function (_) {
  //     if (!arguments.length) return getY;
  //     getY = _;
  //     scatter.y(_);
  //     return chart;
  //   };

  //   chart.grid = function (_) {
  //     if (!arguments.length) return showGrid;
  //     showGrid = _;
  //     return chart;
  //   };

  //   chart.axisLabel = function (_) {
  //     if (!arguments.length) return showAxisLabels;
  //     showAxisLabels = _;
  //     return chart;
  //   };

  //   chart.tickLabel = function (_) {
  //     if (!arguments.length) return showTickLabels;
  //     showTickLabels = _;
  //     return chart;
  //   };

  //   chart.ticks = function (_) {
  //     if (!arguments.length) return tickCount;
  //     tickCount = _;
  //     return chart;
  //   };

  //   chart.label = function (_) {
  //     //console.log("chart label",_)
  //     if (!arguments.length) return getLabel;
  //     getLabel = _;
  //     scatter.label(_);
  //     return chart;
  //   };

  //   chart.clipEdge = function (_) {
  //     if (!arguments.length) return clipEdge;
  //     clipEdge = _;
  //     return chart;
  //   };

  //   chart.color = function (_) {
  //     if (!arguments.length) return color;
  //     color = nv.utils.getColor(_);
  //     scatter.color(color);
  //     return chart;
  //   };

  //   chart.interpolate = function (_) {
  //     if (!arguments.length) return interpolate;
  //     interpolate = _;
  //     return chart;
  //   };

  //   chart.defined = function (_) {
  //     if (!arguments.length) return defined;
  //     defined = _;
  //     return chart;
  //   };

  //   chart.isArea = function (_) {
  //     if (!arguments.length) return isArea;
  //     isArea = d3.functor(_);
  //     return chart;
  //   };

  //   //============================================================


  //   return chart;
  // };