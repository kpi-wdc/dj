// Timeline Utils
// 





function generatePath(points){
  return d3.svg.area()
        .interpolate("linear-closed")
        .x(function (p, i) {
              return p.x;
        })
        .y0(function (p, i) {
              return p.y;
        })
        .y1(function (p, i) {
              return 0;
        })
        .x1(function(p,i){
        	return 0;
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
  this.line = [];
  this.domain = new Array(2);
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
    if(!this._extent){
	    var thos = this;
	    function _min(s){
	    	var r = s[0].start;

	    	s.forEach(function(d){
	    		
	    		r = (date.subtract(new Date(r), new Date(d.start)).toMilliseconds() > 0) ? d.start : r;
	    		if(d.childs){
	    			var c = _min(d.childs)
	    			r = (date.subtract(new Date(r), new Date(c)).toMilliseconds() > 0) ? c : r; 
	    		}
	    	})
	    	return r;
	    }

	    function _max(s){
	    	var r = s[0].end;

	    	s.forEach(function(d){
	    		
	    		r = (date.subtract(new Date(r), new Date(d.end)).toMilliseconds() < 0) ? d.end : r;
	    		if(d.childs){
	    			var c = _max(d.childs)
	    			r = (date.subtract(new Date(r), new Date(c)).toMilliseconds() < 0) ? c : r; 
	    		}
	    	})
	    	return r;
	    }

	    this._data.forEach(function(serie){
	    	var min = _min(serie.values)
	    	var max = _max(serie.values)
	    	if(thos.domain[0]){
	    		thos.domain[0] = (thos.domain[0] > min) ? min : thos.domain[0];
	    	} else{
	    		thos.domain[0] = min;
	    	}	
	    	if(thos.domain[1]){
		    	thos.domain[1] = (thos.domain[1] < max) ? max : thos.domain[1];
		    }else{
		    	thos.domain[1] = max
		    }	
	    })
	    
	    this._extent = this.domain;	
    }
    return this;
  },

  fit : function(){
        var swimlines = [];
        this._band = [];
        this.lanes =[];
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

        swimlines.forEach(function(d,i){
          d.ratio /= sumWidth;
          d.height = minWidth;
          d.hOffset = cumulate;
          cumulate+= d.ratio
        })

        this._bands.forEach(function(band,i){
        	band.forEach(function(item,j){
        		item._id = j
        		item.height = swimlines[i].height;
        		item.y += swimlines[i].hOffset*thos._height;
        		item.band = i;
        		if(item.type != "flow"){
        			item.height = (item.height > 16) ? 16 : item.height ;
        			item.y = item.y+swimlines[i].height/2 - item.height/2 
        		}
        		var laneY = (item.type != "flow") ? item.y+item.height/2 : item.y+minWidth/2;
        		var lane = {serie:item.serieIndex, lane:item.lane, y:laneY}
	        	var foundedLane = thos.lanes.filter(function(t){return t.serie == lane.serie && t.lane == lane.lane}) 
	        	if(foundedLane.length == 0){
	        		thos.lanes.push(lane)
	        	}	 
        	})
        })

       

        
        this.line = [];
        
        this._bands.forEach(function(band){
        	thos.line = thos.line.concat(band);
        })	

        thos.line.sort(function(a,b){
        	if(date.subtract(new Date(a.originalStart), new Date(b.originalStart)).toMilliseconds() !=0)
		        return date.subtract(new Date(a.originalStart), new Date(b.originalStart)).toMilliseconds();
		    if((a.band - b.band) != 0)
		    	return a.band-b.band
		    if((a.level - b.level) != 0)
		    	return a.level - b.level
		    return a.lane - b.lane
        })

        // this.domain = [this.line[0].originalStart, this.line[this.line.length-1].originalEnd] 
        return this;
      }
  }



var foTooltip = function(w){
	this._stopped = true;
	this._initState = true;
	this._timer = undefined;
	this._chart = undefined;
	this._wrapper = w;
	this._anchor = 50;
	this._x =  0;
	this._y = 0;
	this._width = 100;
	this._height = 100;
	this._color = "gray";
	this._bgColor = "white";
	this._dateFormat = {
		flow: "%Y",
		process:"%b.%Y",
		instant:"%d.%b.%Y"
	};
	
	this._content =  function(d){
			return "tooltip"	
	}
	this._margin = {top:5,right:10,bottom:5,left:10}
	this.showed = false;
}



foTooltip.prototype = {

	destroy: function(){
		this.hide();
		if (this._timer) this._timer.stop();
		this._stopped = true;
		return this;
	},

	stop: function(){
		if (this._timer) this._timer.stop();
		this._stopped = true;
		return this;
	},

	chart: function(_){
		if(!_) return this._chart;
		this._chart = _;
		return this;
	},
	
	wrapper: function(_){
		if(!_) return this._wrapper;
		this._wrapper = _;
		return this;
	},

	anchor: function(_){
		if(!_) return this._anchor;
		this._anchor = _;
		return this;
	},

	x: function(_){
		if(!_) return this._x;
		this._x = _;
		return this;
	},

	y: function(_){
		if(!_) return this._y;
		this._y = _;
		return this;
	},

	width: function(_){
		if(!_) return this._width;
		this._width = _;
		return this;
	},

	height: function(_){
		if(!_) return this._height;
		this._height = _;
		return this;
	},

	content: function(_){
		if(!_) return this._content;
		this._content = _;
		return this;
	},

	bgColor: function(_){
		if(!_) return this._bgColor;
		this._bgColor = _;
		return this;
	},

	color: function(_){
		if(!_) return this._color;
		this._color = _;
		return this;
	},
	
	dateFormat: function(_){
		if(!_) return this._dateFormat;
		this._dateFormat = _;
		return this;
	},
	
	show: function(d){
		if(this.showed) this.hide();
		this.showed = true;
		
		var thos = this;
		var wr = {
			x : thos.x()+thos._margin.left,
			y:(thos._anchor-5<10) ? (thos.y()+thos._margin.top-10) : (thos.y()+thos._margin.top),
			width: thos.width()-thos._margin.left-thos._margin.right-15,
			height:thos.height()-thos._margin.top-thos._margin.bottom,
			class: 'fo-tooltip'
		}
		
		// console.log("show",wr)

		this.contentWrapper = this._wrapper.append("foreignObject")
							.attr(wr)
		
		var nav = 	'<center>'
					+'&nbsp;'
					+'<button class="navigator first" style="opacity:0;font-size: 10px;margin: 2px;padding: 2px 5px;color: #666666;background: #eaeaea;border: 1px solid #666666;width:15%;'+((thos._stopped) ? '' : 'visibility:hidden;')+'"> &lt;&lt; </button>'
					+'<button class="navigator prev" style="opacity:0;font-size: 10px;margin: 2px;padding: 2px 5px;color: #666666;background: #eaeaea;border: 1px solid #666666;width:15%;'+((thos._stopped) ? '' : 'visibility:hidden;')+'"> &lt; </button>'
					+'<button class="navigator play" style="opacity:0;font-size: 10px;margin: 2px;padding: 2px 7px;color: #666666;background: #eaeaea;border: 1px solid #666666;text-align:center;">'+((thos._stopped) ? 'Play' : 'Stop')+'</button>'
					+'<button class="navigator next" style="opacity:0;font-size: 10px;margin: 2px;padding: 2px 5px;color: #666666;background: #eaeaea;border: 1px solid #666666;width:15%;'+((thos._stopped) ? '' : 'visibility:hidden;')+'"> &gt; </button>'
					+'<button class="navigator last" style="opacity:0;font-size: 10px;margin: 2px;padding: 2px 5px;color: #666666;background: #eaeaea;border: 1px solid #666666;width:15%;'+((thos._stopped) ? '' : 'visibility:hidden;')+'"> &gt;&gt; </button>'
					+'</center>'					

		var c = this.contentWrapper
				.append('xhtml:div')
				
	            .append('div')
			    .attr({
			           'class': 'tooltip-container'
			    })
			    .html(this._content(d))

		c.append("div").html(nav)	    
		c.select("button.navigator.prev").on("click",function(){thos._chart.prev()})
        c.select("button.navigator.next").on("click",function(){thos._chart.next()})
        c.select("button.navigator.first").on("click",function(){thos._chart.first()})
        c.select("button.navigator.last").on("click",function(){thos._chart.last()})
        c.select("button.navigator.play").on("click",function(){
        	var onPlayNext = function(tooltip){
        		thos._chart.next();
        		if(!thos._stopped) thos._timer = d3.timeout(onPlayNext,3000)
        	}

        	if(thos._stopped){
        		thos._stopped = false;
        		thos.show(d);
        		thos._timer = d3.timeout(onPlayNext,3000)
        	}else{
        		thos._stopped = true;
        		thos._timer.stop();
        		thos.show(d);
        	}
        	
        })

        c.selectAll("button.navigator")
        	.transition()
        	.duration(500)
        	.style("opacity",1)

        // console.log(c,this.contentWrapper.select("div.tooltip-container").node())
					    	
		d3.timeout(function(){
				thos._height = c[0][0].getBoundingClientRect().height;
				wr.y = thos._y+thos._anchor-thos._height/2//+this._margin.top;
				wr.y = (wr.y < (thos._margin.top+2)) ? thos._margin.top+2 : wr.y;
				wr.height = thos._height;

				// console.log("calc", wr)
				if(thos._height>0){
						thos.contentWrapper.attr(wr);
						
						var fo = {
							lt: {
									x: 0,
									y: wr.y-thos._margin.top-thos._y
							},

							rt:{
									x: thos._width-15,
									y:wr.y-thos._margin.top-thos._y
							},
								
							rb:{
									x:thos._width-15,
									y:wr.y+thos._height+thos._margin.bottom-thos._y
							},

							lb:{
								x: 0,
								y: wr.y+thos._height+thos._margin.bottom-thos._y
							},

							sa:{
								x:thos._width-15,
								y:thos._anchor-5
							},

							ma:{
								x:thos._width,
								y:thos._anchor
							},

							ea:{
								x:thos._width-15,
								y:thos._anchor+5
							}		
						}
						
						
						thos._wrapper.insert("path",":first-child")
					       	.attr("d", function(d,i){
					       		return generatePath(
					            	[fo.lt,fo.rt,fo.sa,fo.ma,fo.ea,fo.rb,fo.lb,fo.lt]
					          	)
					        })
					        .attr("transform","translate("+thos._x+","+thos._y+")")
					        .style("stroke",d3.rgb(thos._color).darker(1))//this._color)
					        .style("stroke-width",0.6)
					        .style("fill", thos._bgColor)//d3.rgb(this._color).brighter(5.4))
					        .style("fill-opacity", 1)
					        .style("filter","url("+document.location.href+"#drop-shadow)")	
						thos._wrapper
						.transition()
						.duration(500)
						.ease("cubic-in")
						.attr("opacity",1)
				}		
		},50)
		
	},

	hide: function(d){
		if(!this.showed) return;
		this.showed = false;
		this._wrapper.attr("opacity",0)
		this._wrapper.select(".fo-tooltip").remove()
		this._wrapper.select("path").remove()

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
		
		axis = nv.models.axis(),

        
        tooltipContent = function(d){ return "tooltip"},

        showTooltip = true,

        localeDef = {
	      "decimal": ",",
	      "thousands": "\u00A0",
	      "grouping": [3],
	      "currency": ["", " руб."],
	      "dateTime": "%A, %e %B %Y г. %X",
	      "date": "%d.%m.%Y",
	      "time": "%H:%M:%S",
	      "periods": ["AM", "PM"],
	      "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
	      "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
	      "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
	      "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
	    },

        legend = nv.models.legend()
        	.key(function(d){return d.category})
        	.radioButtonMode(false),

        dispatch = d3.dispatch("stateChange", "changeState"),

        state = {},

        defaultState = null,

        dateFormat = {
						flow: "%Y",
						process:"%b.%Y",
						instant:"%d.%b.%Y"
					},

    	showNavigator = true,

		onNavigate = function(d){
			console.log("navigate",d)
		};


        // local variables
        //  

        var domain = [];
        var currentIndex, _currentEvent, _prevEvent;
        var tooltip =  new foTooltip();
       
        var zoom = d3.behavior
        			.zoom()
        			.scaleExtent([1, 5]);
        var prevTranslate,prevZoom;			

   
/////////////////////////////////////////////////////////////////////////////////////////////////
		
	


		var insertSerieIndex = function(values,i){
		  values.forEach(function(d){
		    d.serieIndex = i;
		    if(d.childs) insertSerieIndex(d.childs,i);
		  })
		}


		var getDomain = function(_data){
			    var _domain= new Array(2);

			    function _min(s){
			    	var r = s[0].start;

			    	s.forEach(function(d){
			    		
			    		r = (date.subtract(new Date(r), new Date(d.start)).toMilliseconds() > 0) ? d.start : r;
			    		if(d.childs){
			    			var c = _min(d.childs)
			    			r = (date.subtract(new Date(r), new Date(c)).toMilliseconds() > 0) ? c : r; 
			    		}
			    	})
			    	return r;
			    }

			    function _max(s){
			    	var r = s[0].end;

			    	s.forEach(function(d){
			    		
			    		r = (date.subtract(new Date(r), new Date(d.end)).toMilliseconds() < 0) ? d.end : r;
			    		if(d.childs){
			    			var c = _max(d.childs)
			    			r = (date.subtract(new Date(r), new Date(c)).toMilliseconds() < 0) ? c : r; 
			    		}
			    	})
			    	return r;
			    }

			    _data.forEach(function(serie){
			    	var min = _min(serie.values)
			    	var max = _max(serie.values)
			    	if(_domain[0]){
			    		_domain[0] = (_domain[0] > min) ? min : _domain[0];
			    	} else{
			    		_domain[0] = min;
			    	}	
			    	if(_domain[1]){
				    	_domain[1] = (_domain[1] < max) ? max : _domain[1];
				    }else{
				    	_domain[1] = max
				    }	
			    })
			    
			   return [new Date(_domain[0]), new Date(_domain[1])];	
		}    


		

/////////////////////////////////////////////////////////////////////////////////////////////////
    
    function chart (selection){

    	selection.each(function (_d) {
    		if (_d.length ==0) return;

    		_d.forEach(function(d,i){
		      insertSerieIndex(d.values,i)
		    })

    		var data = _d.filter(function(item){return item.disabled == false || item.disabled == undefined})
        	
        	
     
    	// prepare visualization
    	 
        
    	var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom;
        
        
    	 domain =  getDomain(data);
    		var xScale = d3.time.scale()
	            .domain(domain)
	            .range([0, availableWidth]);
	        
	        var middle = availableWidth/2;
	        var start = xScale.invert(middle-availableWidth/2/zoom.scale())
	        var end =   xScale.invert(middle+availableWidth/2/zoom.scale())
	
        container = d3.select(this);
       


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

	    
	    	// filters go in defs element
		var defsWrap = container.selectAll("defs").data([data])

		var defs = defsWrap.enter().append("defs");

		// create filter with id #drop-shadow
		// height=130% so that the shadow is not clipped
		var filter = defs.append("filter")
		    .attr("id", "drop-shadow")
		    .attr("height", "130%");

		// SourceAlpha refers to opacity of graphic that this filter will be applied to
		// convolve that with a Gaussian with standard deviation 3 and store result
		// in blur
		filter.append("feGaussianBlur")
		    .attr("in", "Source")//"SourceAlpha")
		    .attr("stdDeviation", 2)
		    .attr("result", "blur");

		// translate output of Gaussian blur to the right and downwards with 2px
		// store result in offsetBlur
		filter.append("feOffset")
		    .attr("in", "blur")
		    .attr("dx", 0)
		    .attr("dy", 2)
		    .attr("result", "offsetBlur");

		// overlay original SourceGraphic over translated blurred opacity by using
		// feMerge filter. Order of specifying inputs is important!
		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
		    .attr("in", "offsetBlur")
		feMerge.append("feMergeNode")
		    .attr("in", "SourceGraphic");

		defsWrap.exit().remove();    
    
        
        var wrap = container.selectAll("g.nv-wrap.nv-timeline").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-timeline").append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-zoom");
        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "series");
        gEnter.append("g").attr("class", "nv-legendWrap");
		gEnter.append("g").attr("class", "nv-playerWrap");
		gEnter.append("g").attr("class", "fo-tooltipWrap");
		
		
		


        legend.width(availableWidth);

        var temp = g.select(".nv-legendWrap").datum(_d)
          temp.call(legend);
         
            margin.top = legend.height() + 5;
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + 0 + ")");

		  var l = new layout()
		    .data(data)
		    .extent(domain)
		    .size([availableWidth,availableHeight])
		    .fit();
		
		  
        
					
		var zoomLayer = g.select("g.nv-zoom").selectAll("rect.nv-zoom").data([_d])
		zoomLayer
			.enter()
			.append("rect")
			.attr({
				"class":"nv-zoom",
				x:0,
				y:0,
				width:availableWidth,
				height:availableHeight,
				transform:"translate("+margin.left+","+margin.top+")"
			})
			.style("fill-opacity",0)
			.call(zoom)
			

		
		zoomLayer
			.exit()
			.remove()	

 	      var x = d3.time.scale()
	            .domain(domain)
	            .range([0, availableWidth]);

		  var startScale = d3.time.scale()
		            .domain(domain)
		            .range([0, availableWidth]);          
		  
		  axis
		  	.scale(x)
            .orient("bottom")
            .tickSize(-availableHeight, 0)
            .tickPadding(7)
            .tickFormat(d3.locale(localeDef).timeFormat.multi([
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
           

        //------------------------------------------------------------
        // Setup containers and skeleton of chart
        

        var xAxisG =  g.select(".nv-x.nv-axis")
					    .attr("transform", "translate("+margin.left+","+(availableHeight+margin.top)+")")

	 	if(showTooltip){
		 	tooltip
		 		.chart(chart)
				.wrapper(g.select(".fo-tooltipWrap"))
				.x(margin.left)
				.y(margin.top)
				.width(availableWidth*0.25)
				.height(availableHeight)
				.content(tooltipContent)
		}		


		chart.destroy = function(){
			tooltip.destroy(); 
		}

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


		seriesContainer
			.exit()
			.remove()

		

		var lanes = g
					.select("g.series")
					.selectAll("line.lane")
					.data(l.lanes)

		lanes
			.enter()
			.append("line")
			.attr("class", "lane")
			.attr("x1", 0)
			.attr("y1",function(d){ return d.y})
			.attr("x2", availableWidth)
			.attr("y2",function(d){ return d.y})
			.style("stroke",function(d){return color(d, d.serie)})
			.style("stroke-width",0.25)

		lanes.exit().remove();	
		
		var items = g
					.select("g.series")
					.selectAll(".serie")
					.selectAll("rect.item")
					.data(function (d) {
			          return d;
			        });

		items
			.enter()
			.append("rect")
			.attr("class", "item")
			.attr("x", function (d) {
		    	return 0
	      	})
	      	.attr("width", function (d) {
	      		return 0
	      	})
			.style("fill-opacity", function(d){
	      		return 0
	      	}) 
	      	// .style("stroke-width", function(d){
	      	// 	return 0
	      	// })
	      	// .style("opacity", function(d){
	      	// 	return 0
	      	// })
	      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
			.style("stroke", function (d,i) {
				return color(d,d.serieIndex)
			})
			.style("cursor", "pointer")
			.on("mouseover", function(d){
				if(!showTooltip){
					 nv.tooltip.show(
					 	[d3.event.pageX, d3.event.pageY], 
					 	'<div style="width:'+(Math.round(availableWidth/4))+'px; white-space: normal;margin:5px;">'+tooltipContent(d)+'</div>', 
					 	"n", 
					 	null, 
					 	null,
					 	"xy-tooltip with-3d-shadow with-transitions"
					);
				}
			})
			.on("mouseout", function(d){
				if(!showTooltip){
					 nv.tooltip.cleanup()
				}
			})
			.on("click",function(d){
				if(!showTooltip){

					var index = l.line.map(function(item) {return item.context}).indexOf(d.context)
					if(index >=0){
						currentIndex = index;
						navigate();
						chart.redraw();
						
						// g.select("g.nv-x.nv-axis")
						// .transition()
						// .attr("transform",
						// 		"translate("+zoom.translate()[0]+","+(availableHeight+margin.top)+")")
						// g.select(".series")
						// 	.transition()
						// 	.attr("transform",
						// 		"translate("+zoom.translate()[0]+","+(margin.top)+")") 
					}else{
						currentIndex = undefined;
						_currentEvent = undefined;
						_prevEvent = undefined;
						navigate();
						chart.redraw();
					}	
				}else{
					// console.log("click with navigator")
					tooltip.stop();
					var index = l.line.map(function(item) {return item.context}).indexOf(d.context)
					if(index >=0){
						currentIndex = index;
						navigate();
						chart.redraw();
						translateWrap(_currentEvent)
					}	
				}		
			})
		
		items.exit().remove()      	
		
		


		chart.redraw = function(){
			lanes
				.transition().attr("x1", 0)
				.attr("y1",function(d){ return d.y})
				// .attr("x2", availableWidth)
				.attr("y2",function(d){ return d.y})
				.style("stroke",function(d){return color(d, d.serie)})
				.style("stroke-width",0.25)
				.attr("x2", availableWidth*zoom.scale())
				
			items
				.transition()
		//		.duration(500)
				// .ease("cubic-in")//"cubic-in", "linear", "quad", "cubic", "sin", "exp", "circle", "elastic", "back", "bounce"
				.attr("x", function (d) {
			    	return (d.type == "instant")? d.start*zoom.scale()-2.5 : d.start*zoom.scale()
		      	})
		      	.attr("y", function (d) {
		      		return  (d.type == "instant")
		      		? d.y+d.height/2-2.5
		      		:(d.type == "process") 
		      			? d.y+d.height/2-3.5
		      			: d.y
		      	})
		      	.attr("width", function (d) {
		      		return ((d.end*zoom.scale() - d.start*zoom.scale())<5) ? 5 : d.end*zoom.scale() - d.start*zoom.scale()
		      	})
		      	.attr("height", function (d) {
		      	  return (d.type == "flow") 
		      	  	? d.dy 
		      	  	: (d.type == "instant")
		      	  		? 5
		      	  		: 7 // || d.type == "process") ? 5 : d.height
		        })
		        .attr("rx", function(d){
		        	if(d.type != "instant") return 0;
		        	var w =  ((d.end*zoom.scale() - d.start*zoom.scale())<5) ? 5 : (d.end*zoom.scale() - d.start*zoom.scale())
		        	var h = (d.type == "flow") ? d.dy : d.height
		        	return (w >= h)? h/2 : w/2
		        })	
		        .attr("ry", function(d){
		        	if(d.type != "instant") return 0;
					var w =  ((d.end*zoom.scale() - d.start*zoom.scale())<5) ? 5 : (d.end*zoom.scale() - d.start*zoom.scale())
		        	var h = (d.type == "flow") ? d.dy : d.height
		        	return (w >= h)? h/2 : w/2
		        })
		      	.style("fill-opacity", function(d){
		      		return (d.type == "flow") 
		      				? ( _currentEvent && d.context == _currentEvent.context ) ? 0.5 : 0.05 
		      				: ( _currentEvent && d.context == _currentEvent.context ) ? 0.7 : 0.3
		      	}) 
		      	// 		? ((currentIndex!=undefined) && l.line[currentIndex] && d.id == l.line[currentIndex].id) ? 0.5 : 0.05 
		      	// 		: ((currentIndex!=undefined) && l.line[currentIndex] && d.id == l.line[currentIndex].id) ? 0.7 : 0.3
		      	// }) 
		      	.style("stroke-width", function(d){
		      		return (d.type == "flow") 
		      		
		      			? ( _currentEvent && d.context == _currentEvent.context ) ? 2 : 0.3 
		      			: ( _currentEvent && d.context == _currentEvent.context ) ? 2 : 1.5
		      			// ? ((currentIndex!=undefined) && l.line[currentIndex] && d.id == l.line[currentIndex].id) ? 2 : 0.3 
		      			// : ((currentIndex!=undefined) && l.line[currentIndex] && d.id == l.line[currentIndex].id) ? 3 : 1.5
		      	})
		      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
				.style("stroke", function (d,i) {
					if(!_currentEvent){
						return color(d,d.serieIndex);
					}

					return (
						(d.context == _currentEvent.context)
									? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
									: color(d,d.serieIndex)	
					)
									
					// if(_currentEvent && (d.context == _currentEvent.context))
					// console.log(_prevEvent, _currentEvent, color(d,d.serieIndex))
					
					// if(!_currentEvent){
					// 	console.log("return",(d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()));
					// 	return (d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString());
					// } 					
					// if(!_prevEvent){
					// 	if(_currentEvent && (d.context == _currentEvent.context))
					// 	console.log("return",(( _currentEvent && (d.context == _currentEvent.context))
					// 			? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
					// 			: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()));

					// 	return (( _currentEvent && (d.context == _currentEvent.context))
					// 			? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
					// 			: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString());
					// }
					// if(_currentEvent && (d.context == _currentEvent.context)){
					// 	console.log(d.context,_prevEvent.context,_currentEvent.context,( d.context == _prevEvent.context && d.context == _currentEvent.context ))
					// 	console.log("return",(
					// 		( d.context == _prevEvent.context ) 
					// 			? (d.context == _currentEvent.context)
					// 				? color(d,d.serieIndex)
					// 				: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()
					// 			: (d.context == _currentEvent.context)
					// 				? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
					// 				: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()	
					// 	));
					// }				 
					// return (
					// 	( d.context == _prevEvent.context) 
					// 		? (d.context == _currentEvent.context)
					// 			? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
					// 			: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()
					// 		: (d.context == _currentEvent.context)
					// 			? d3.rgb(color(d,d.serieIndex)).darker(0.7).toString()
					// 			: d3.rgb(color(d,d.serieIndex)).brighter(0.7).toString()	
					// )			

				})
			
			
			x.range([0,availableWidth*zoom.scale()])
			xAxisG.call(axis);	
		      	
		}	   	

		chart.redraw();

		var navigate = function(){
			// console.log(currentIndex)
		    var currentEvent = l.line[currentIndex];
		    _prevEvent = _currentEvent;
		    _currentEvent =  l.line[currentIndex]; 
		    // console.log("navigate",currentIndex,_currentEvent)
		    if(showTooltip)
			    tooltip
			       	.anchor((currentEvent.type == "flow")? currentEvent.y+currentEvent.dy/2  :currentEvent.y+currentEvent.height/2)
			    	.color(color(currentEvent, currentEvent.serieIndex))
			    	.show(currentEvent); 
		    // var f = d3.locale(localeDef).timeFormat(dateFormat[currentEvent.type])
		    currentEvent._color = d3.rgb(color(currentEvent, currentEvent.serieIndex)).darker(0.7).toString()
		    currentEvent._bgColor = d3.rgb(color(currentEvent, currentEvent.serieIndex)).brighter(5.55).toString()
		    
		    onNavigate(currentEvent)	
		  }

		
	 	var first = function(){
	 		currentIndex = 0;
	 		navigate()
	 		return l.line[currentIndex]
	 	}

	 	var last = function(){
	 		currentIndex =  l.line.length-1;
	 		navigate()
	 		return l.line[currentIndex]
	 	}

	 	var prev = function(){
	 		if(currentIndex == undefined){
	 			return first();
	 		}
	 		currentIndex--;
	 		if(currentIndex<0) return last(); 
	 		navigate()
	 		return l.line[currentIndex]
	 	}

	 	var next = function(){
	 		if(currentIndex == undefined){
	 			return first();
	 		}
	 		currentIndex = (currentIndex) ? currentIndex : 0;
	 		currentIndex++;
	 		if((currentIndex > l.line.length-1)) return first();
	 		navigate()
	 		return l.line[currentIndex]
	 	}

	 	var current = function(){
	 		if(currentIndex == undefined){
	 			return first();
	 		}
	 		navigate()
	 		return l.line[currentIndex]
	 	}

	 	var translateWrap = function(e){
	 		chart.redraw();
	 		g.select("g.nv-x.nv-axis")
				.transition()
				.duration(500)
				.ease("cubic-in")
				.attr("transform","translate("+(-e.start*zoom.scale()+margin.left+2+availableWidth*0.25)+","+(availableHeight+margin.top)+")")
			g.select(".series")
				.transition()
				.duration(500)
				.ease("cubic-in")
				.attr("transform","translate("+(-e.start*zoom.scale()+margin.left+2+availableWidth*0.25)+","+(margin.top)+")")
		}

	 	chart.next = function(){
	 		var e = next();
	 		translateWrap(e)
		}

		chart.first = function(){
	 		var e = first();
	 		translateWrap(e)
		}

		chart.last = function(){
	 		var e = last();
	 		translateWrap(e)
		}

	 	chart.prev = function(){
	 		var e = prev();
	 		translateWrap(e)
	 	}

		var onZoomWithTooltip = function(){
					
					var e = current();
					if(prevZoom 
						&& prevZoom != zoom.scale()){
						zoom.translate(prevTranslate)

					}

					if(
						prevZoom 
						&& prevZoom == zoom.scale() 
					){
						if(prevTranslate && (zoom.translate()[0] != prevTranslate[0])){
							if(zoom.translate()[0]-prevTranslate[0]>0){
								e = prev();
							}else{
								e = next()
							}
						} else if(!prevTranslate){
							e = first()
						}
					}else{
						e = current()
					}	

					prevTranslate = zoom.translate();
					prevZoom = zoom.scale();

					translateWrap(e)
			}

		var onZoomWithoutTooltip = function(){
			chart.redraw();
		}	

		if(showTooltip){	
			zoom.on("zoomend", onZoomWithTooltip)
			
		} else{
			zoom
				.on("zoomend", onZoomWithoutTooltip)
				.on("zoom", function(){
					g.select("g.nv-x.nv-axis")
						.transition()
						// .duration(500)
						// .ease("cubic-in")
						.attr("transform","translate("+zoom.translate()[0]+","+(availableHeight+margin.top)+")")
					g.select(".series")
						.transition()
						// .duration(500)
						// .ease("cubic-in")
						.attr("transform","translate("+zoom.translate()[0]+","+(margin.top)+")")
						})
		}	

		if(_currentEvent){

				var index = l.line.map(function(d) {return d.context}).indexOf(_currentEvent.context)
				if(index >=0){
					currentIndex = index;
					if(showTooltip)	{
						translateWrap(current());
					}else{
						current();
						chart.redraw();
					}	
				}else{
						if(showTooltip)	translateWrap(first())
				}
			}else{
				if(showTooltip)	translateWrap(first())
			}

	
 		legend.dispatch.on("stateChange", function (newState) {
          tooltip.hide();
          state = newState;
          dispatch.changeState(state);
        });
	        
	    
 		dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined" && data.length === e.disabled.length) {
            _d.forEach(function (series, i) {
              series.disabled = !!e.disabled[i];
            });

            state.disabled = e.disabled;
          }
          onNavigate();
          if(showTooltip) tooltip.hide();
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

	chart.localeDef = function (_) {
      if (!arguments.length) return localeDef;
      localeDef = _;
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

	chart.dateFormat = function (_) {
      if (!arguments.length) return dateFormat;
      dateFormat = _;
      return chart;
    };

    chart.showNavigator = function (_) {
      if (!arguments.length) return showNavigator;
      showNavigator = _;
      return chart;
    };

	chart.onNavigate = function (_) {
      if (!arguments.length) return onNavigate;
      onNavigate = _;
      return chart;
    };

     chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltipContent;
      tooltipContent = _;
      return chart;
    };

	chart.showTooltip = function (_) {
      if (!arguments.length) return showTooltip;
      showTooltip = _;
      return chart;
    };




  
    //============================================================
    
 	return chart;   
}



