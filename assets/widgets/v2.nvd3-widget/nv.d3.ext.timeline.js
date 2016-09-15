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
        
        var thos = this;
        
        console.log(this._data)

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

        this._bands.forEach(function(band,i){
        	band.forEach(function(item,j){
        		item._id = j
        		item.height = swimlines[i].height;
        		item.y += swimlines[i].hOffset*thos._height;
        		item.band = i; 
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

        this.domain = [this.line[0].originalStart, this.line[this.line.length-1].originalEnd] 
        
        return this;
      }
  }



var foTooltip = function(w){
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
	this._margin = {top:10,right:10,bottom:10,left:10}
	this.showed = false;
}

foTooltip.prototype = {
	
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
		this.contentWrapper = this._wrapper.append("foreignObject")
							.attr(wr)
		
		
		var c = this.contentWrapper
				.append('xhtml:div')
	            .append('div')
			    .attr({
			           'class': 'tooltip-container'
			    })
			    .html(this._content(d))
		
		this._height = c[0][0].getBoundingClientRect().height;
		wr.y = this._y+this._anchor-this._height/2+this._margin.top;
		wr.y = (wr.y < -10) ? -10 : wr.y;
		this.contentWrapper.attr(wr);

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
		
		this._wrapper.insert("path",":first-child")
	       	.attr("d", function(d,i){
	       		return generatePath(
	            	[fo.lt,fo.rt,fo.sa,fo.ma,fo.ea,fo.rb,fo.lb,fo.lt]
	          	)
	        })
	        .attr("transform","translate("+this._x+","+this._y+")")
	        .style("stroke",this._color)
	        .style("stroke-width",1.5)
	        .style("fill", this._bgColor)
	        .style("fill-opacity", 0.75)	
		this._wrapper.transition().attr("opacity",1)
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

        brush = d3.svg.brush(),
        
        brushAxis = nv.models.axis(),

        brushRatio = 0.1,

        playerHeight = 20,

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
        var brushScale;
        var brushCurrentPos;
        var currentIndex;
        var tooltip = new foTooltip();
        var buttons = [
	 		{
	 			d:  d3.svg.symbol().size((playerHeight-6)*10).type("triangle-up").call(this),
	 			transform: "translate("+(playerHeight/2)+","+(playerHeight/2)+") rotate(-90)",
	 			onClick: function(){
	 				chart.first()
	 			}
	 	   },
		   {
	 			d:  d3.svg.symbol().size((playerHeight-6)*10).type("triangle-up").call(this),
	 			transform: "translate("+(playerHeight+playerHeight/2)+","+(playerHeight/2)+") rotate(-90)",
	 			onClick: function(){
	 				chart.prev()
	 			}
		   },
		   {
	 			d:  d3.svg.symbol().size((playerHeight-6)*10).type("triangle-up").call(this),
	 			transform: "translate("+(2*playerHeight+playerHeight/2)+","+(playerHeight/2)+") rotate(90)",
	 			onClick: function(){
	 				chart.next()
	 			}
		   },
		    {
	 			d:  d3.svg.symbol().size((playerHeight-6)*10).type("triangle-up").call(this),
	 			transform: "translate("+(3*playerHeight+playerHeight/2)+","+(playerHeight/2)+") rotate(90)",
	 			onClick: function(){
	 				chart.last()
	 			}
		   }

	 	 ]
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
    		
    		_d.forEach(function(d,i){
		      insertSerieIndex(d.values,i)
		    })

    		var data = _d.filter(function(item){return item.disabled == false || item.disabled == undefined})
        	
        	var needBrushSettings = (brush.extent() == null) || brush.empty();
        	
        	if(needBrushSettings){
        		buttons.forEach(function(b){
        			b.disabled = false;
        			currentIndex = undefined;
        		})
        	}
    		
    		domain = needBrushSettings ? getDomain(data) : brush.extent();

    	// prepare visualization
    	// 
    	 
    	var brushHeight = (height - margin.top - margin.bottom)*brushRatio;    
        
    	var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom-brushHeight-20-playerHeight;
        
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

        
        var wrap = container.selectAll("g.nv-wrap.nv-timeline").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-timeline").append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "brush");
        gEnter.append("g").attr("class", "series");
        gEnter.append("g").attr("class", "nv-legendWrap");
		// gEnter.append("g").attr("class", "nv-playerWrap");
		gEnter.append("g").attr("class", "fo-tooltipWrap");

		
		
					



          legend.width(availableWidth);

          var temp = g.select(".nv-legendWrap").datum(_d)
          temp.call(legend);
         
            margin.top = legend.height() + 5;
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom -brushHeight-20-playerHeight;

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + 0 + ")");

		  var l = new layout()
		    .data(data)
		    .extent(domain)
		    .size([availableWidth,availableHeight])
		    .fit();
		
		  
          

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

		xAxisG.transition().call(axis);

		var invertScale = d3.time.scale()
							.domain(startScale.range())
							.range(startScale.domain())
  
  		

  		if(needBrushSettings){
  			brushScale =  d3.time.scale().range([0, availableWidth]);
  			brushScale.domain([
              new Date(invertScale(0 - availableWidth*0.25)), 
              new Date(invertScale(availableWidth + availableWidth*0.25))
            ])
  		}
  		
        
        
        brush
        	.x(brushScale.range([0, availableWidth]))         
        	.extent(domain)

         brushAxis
		  	.scale(brushScale)
            .orient("bottom")
            .tickSize(-brushHeight, 0)
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
        

		var brushG = g.select(".brush")
						.attr("transform", "translate("+margin.left+","+(availableHeight+margin.top+20)+")")									    

		var brushAxisWrap = brushG.selectAll(".nv-x.nv-axis").data([_d])
		
		brushAxisWrap
			.enter()
		    .append("g")
		    .attr("class", "nv-x nv-axis")
		    .attr("transform", "translate("+0+","+(brushHeight)+")")
		
		brushAxisWrap.exit().remove();
		
		brushAxisWrap 
		    .transition()
		    .call(brushAxis)


		var brushControlWrap =  brushG.selectAll(".brush-control").data([_d])   
		    
		brushControlWrap
			.enter()
		    .append("g")
		    .attr("class", "brush-control")
		
		brushControlWrap.exit().remove();

		brushControlWrap   
		    .transition()
		    .call(brush)  
		
		brushControlWrap.selectAll("rect")
			.attr("height", brushHeight)   


		brushCurrentPos = brushG.selectAll(".current").data([_d]);
		var e = brush.extent().map(function(d){return brushScale(d)}); 
	 	brushCurrentPos
 		.enter()
	 		.append("rect")
	 		.attr("class", "current")
	 		.attr("height", brushHeight)
		    .attr("width", 1)
		    .attr("y", 0)
		    .attr("x", e[0]+(e[1]-e[0])*0.25)//2)
		      // .attr("transform", "translate("+(0)+","+(avaibleHeight+30)+")")
		    .style("fill","red")  

	 	brushCurrentPos.exit().remove();

	 	tooltip
			.wrapper(g.select(".fo-tooltipWrap"))
			.x(margin.left)
			.y(margin.top)
			.width(availableWidth*0.25)
			.height(availableHeight)
			.content(tooltipContent)
			

		var navigate = function(){

		    var e = brush.extent().map(function(d){return startScale(d)});
		    var p = startScale(l.line[currentIndex].originalStart);
		    // var m = (e[1]-e[0])/2;
		    var m = e[1]-e[0]
		    brush.extent([new Date(startScale.invert(p-m*0.25)), new Date(startScale.invert(p+m*0.75))])
		    chart.update();
		    var currentEvent = l.line[currentIndex]; 
		    if(showTooltip)
			    tooltip
			       	.anchor((currentEvent.type == "flow")? currentEvent.y+currentEvent.dy/2  :currentEvent.y+currentEvent.height/2)
			    	.color(color(currentEvent, currentEvent.serieIndex))
			    	.show(currentEvent); 
		    var f = d3.locale(localeDef).timeFormat(dateFormat[currentEvent.type])
		    onNavigate(currentEvent)	
		  }

			if(currentIndex!=undefined){
				var currentEvent = l.line[currentIndex];
				onNavigate(currentEvent)	
			}else{
				onNavigate()
			}

	 	chart.first = function(){
	 		
	 		currentIndex = 0;
	 		buttons[0].disabled = true;
			buttons[1].disabled = true;
			buttons[2].disabled = false;
			buttons[3].disabled = false;
	 		navigate()
	 	}

	 	chart.prev = function(){
	 		
	 		if(currentIndex == undefined){
	 			chart.first();
	 			return;
	 		}
	 		currentIndex--;
	 		currentIndex = (currentIndex<0) ? 0 : currentIndex; 
	 		if(currentIndex == 0){
	 			buttons[0].disabled = true;
	 			buttons[1].disabled = true;
	 		}else{
	 			buttons[0].disabled = false;
	 			buttons[1].disabled = false;
	 		}
	 		buttons[2].disabled = false;
	 		buttons[3].disabled = false;
	 		navigate()
	 	}

	 	chart.next = function(){
	 		
	 		if(currentIndex == undefined){
	 			chart.last();
	 			return;
	 		}
	 		currentIndex = (currentIndex) ? currentIndex : 0;
	 		currentIndex++;
	 		currentIndex = (currentIndex > l.line.length-1) ? l.line.length-1 : currentIndex;
	 		if(currentIndex == l.line.length-1){
	 			buttons[2].disabled = true;
	 			buttons[3].disabled = true;
	 		}else{
	 			buttons[2].disabled = false;
	 			buttons[3].disabled = false;
	 		}
	 		buttons[0].disabled = false;
	 		buttons[1].disabled = false; 
	 		navigate()
	 	}

	 	chart.last = function(){
	 		
	 		currentIndex = l.line.length-1; 
	 		buttons[0].disabled = false;
			buttons[1].disabled = false;
			buttons[2].disabled = true;
			buttons[3].disabled = true;
	 		navigate()
	 	}	

	 	brushCurrentPos
	 		.attr("x", e[0]+(e[1]-e[0])/2);

	 	if(showNavigator){	
		 	var player = brushG.selectAll(".nv-playerWrap").data([_d])
		 	player
		 		.enter()
		 		.append("g").attr("class", "nv-playerWrap")
				.attr("transform", "translate("	+(0)
									+","
									+(brushHeight/2-playerHeight/2)
									+")")	 	

			player.exit().remove();	
		 
		    
		  	buttons[2].transform =  "translate("
		  							+(availableWidth-2*playerHeight+playerHeight/2)
		  							+","
		  							+(playerHeight/2)
		  							+") rotate(90)";

			buttons[3].transform =  "translate("
		  							+(availableWidth-playerHeight/2)
		  							+","
		  							+(playerHeight/2)
		  							+") rotate(90)";
		 		
			var playerButtons = player.selectAll(".nv-player-button").data(buttons) 

		 	playerButtons
		 		.enter()
		 		.append("path")
		 		.attr("class","nv-player-button") 


			playerButtons.exit().remove();
		 	
			playerButtons
				.style("fill","#d5d5ea")
				.style("fill-opacity", function(d){return (!d.disabled)? 1 : 0 })
	            .style("stroke", "gray")
	            .style("stroke-width", function(d){return (!d.disabled)? 1.5 : 0 })
	            .style("cursor",function(d){return (!d.disabled)? "hand" : "" })
	            .attr("d", function(d){return d.d})            
	            .attr("transform", function(d){return d.transform})
	            .on("click", function(d){ if(!d.disabled) d.onClick()})

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
			.attr("x", function (d) {
		    	return 0
	      	})
	      	.attr("width", function (d) {
	      		return 0
	      	})
			.style("fill-opacity", function(d){
	      		return 0
	      	}) 
	      	.style("stroke-width", function(d){
	      		0
	      	})
	      	.style("opacity", function(d){
	      		0
	      	})
	      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
			.style("stroke", function (d,i) {return color(d,d.serieIndex)})
		
		items.exit().remove()      	
		      	
		
		items
			.transition()
	//		.duration(500)
			// .ease("cubic-in")//"cubic-in", "linear", "quad", "cubic", "sin", "exp", "circle", "elastic", "back", "bounce"
			.attr("x", function (d) {
		    	return (d.type == "instant")? d.start-2.5 : d.start
	      	})
	      	.attr("y", function (d) {return d.y})
	      	.attr("width", function (d) {
	      		return ((d.end - d.start)<5) ? 5 : d.end - d.start
	      	})
	      	.attr("height", function (d) {
	      	  return (d.type == "flow") ? d.dy : d.height
	        })
	        .attr("rx", function(d){
	        	var w =  ((d.end - d.start)<5) ? 5 : (d.end - d.start)
	        	var h = (d.type == "flow") ? d.dy : d.height
	        	return (w >= h)? h/2 : w/2
	        })	
	        .attr("ry", function(d){
				var w =  ((d.end - d.start)<5) ? 5 : (d.end - d.start)
	        	var h = (d.type == "flow") ? d.dy : d.height
	        	return (w >= h)? h/2 : w/2
	        })
	      	.style("fill-opacity", function(d){
	      		return (d.type == "flow") 
	      			? ((currentIndex!=undefined) && d.id == l.line[currentIndex].id) ? 0.5 : 0.05 
	      			: ((currentIndex!=undefined) && d.id == l.line[currentIndex].id) ? 0.7 : 0.3
	      	}) 
	      	.style("stroke-width", function(d){
	      		return (d.type == "flow") 
	      			? ((currentIndex!=undefined) && d.id == l.line[currentIndex].id) ? 2 : 0.3 
	      			: ((currentIndex!=undefined) && d.id == l.line[currentIndex].id) ? 3 : 1.5
	      	})
	      	.style("fill", function (d,i) {return color(d, d.serieIndex)})
			.style("stroke", function (d,i) {return color(d,d.serieIndex)})
		      	
	   	




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
          tooltip.hide();
          brush.clear();
          chart.update();
        });

    	});
		
		var redrawBrushCurrentPos = function(){
			tooltip.hide();
			
			buttons.forEach(function(b){b.disabled = false})
			currentIndex = undefined;
		    var e = brush.extent().map(function(d){return brushScale(d)});
		    brushCurrentPos
		    	.attr("x", e[0]+(e[1]-e[0])/2)
		}   

		brush
			.on("brushend", function(){onNavigate(); tooltip.hide(); chart.update()})
			.on("brush", redrawBrushCurrentPos)
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



