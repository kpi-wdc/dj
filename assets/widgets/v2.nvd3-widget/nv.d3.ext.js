"use strict";

(function () {
 // console.log("LOAD nv.d3.ext")
 // console.log(date)

 var customTimeFormat = d3.time.format.multi([
                [".%L", function(d) { return d.getMilliseconds(); }],
                [":%S", function(d) { return d.getSeconds(); }],
                ["%I:%M", function(d) { return d.getMinutes(); }],
                ["%I %p", function(d) { return d.getHours(); }],
                ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                ["%b %d", function(d) { return d.getDate() != 1; }],
                ["%B", function(d) { return d.getMonth(); }],
                ["%Y", function() { return true; }]
              ]);

 var convertDateTime = function(data){
      data.forEach(function(serie,i) {
            if(serie.role == "time"){
              serie.key = date.format(new Date(serie.key), ((serie.format)?serie.format:"YY.MM.DD"))
            }
            if(serie.label){
              if(serie.label.role == "time"){
                serie.values.forEach(function(value){
                  value.label = date.format(new Date(value.label), ((serie.label.format)?serie.label.format:"YY.MM.DD"))
                })
              }
            }  
        })
 }     

d3.geo.tileServerEnable = true;

d3.html(
  "http://api.tiles.mapbox.com/v4/"
            + "mapbox.outdoors" + "/"
            + "0" + "/" + "0" + "/" + "0" + ".png"
            + "?access_token=" +"pk.eyJ1IjoiYm9sZGFrIiwiYSI6InZrSEF6RXMifQ.c8WIV6zoinhXwXXY2cFurg",
            function(error,doc){
              // console.log(error)
              if(error == null || error == undefined) d3.geo.tileServerEnable = true;
            }
);

d3.geo.tile = function () {
  var size = [960, 500],
      scale = 256,
      translate = [size[0] / 2, size[1] / 2],
      zoomDelta = 0;

  function tile() {
    var z = Math.max(Math.log(scale) / Math.LN2 - 8, 0),
        z0 = Math.round(z + zoomDelta),
        k = Math.pow(2, z - z0 + 8),
        origin = [(translate[0] - scale / 2) / k, (translate[1] - scale / 2) / k],
        tiles = [],
        cols = d3.range(Math.max(0, Math.floor(-origin[0])), 1+Math.max(0, Math.ceil(size[0] / k - origin[0]))),
        rows = d3.range(Math.max(0, Math.floor(-origin[1])), 1+Math.max(0, Math.ceil(size[1] / k - origin[1])));

    rows.forEach(function (y) {
      cols.forEach(function (x) {
        tiles.push([x, y, z0]);
      });
    });

    tiles.translate = origin;
    tiles.scale = k;

    return tiles;
  }

  tile.size = function (_) {
    if (!arguments.length) return size;
    size = _;
    return tile;
  };

  tile.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return tile;
  };

  tile.translate = function (_) {
    if (!arguments.length) return translate;
    translate = _;
    return tile;
  };

  tile.zoomDelta = function (_) {
    if (!arguments.length) return zoomDelta;
    zoomDelta = +_;
    return tile;
  };

  return tile;
};

  nv.tooltip.show = function (pos, content, gravity, dist, parentContainer, classes) {
    //Create new tooltip div if it doesn't exist on DOM.
    var container = document.createElement("div");
    container.className = "nvtooltip " + (classes ? classes : "xy-tooltip");

    var body = parentContainer;
    if (!parentContainer || parentContainer.tagName.match(/g|svg/i)) {
      //If the parent element is an SVG element, place tooltip in the <body> element.
      body = document.getElementsByTagName("body")[0];
    }

    container.style.left = 0;
    container.style.top = 0;
    //container.style.opacity = 0;
    container.innerHTML = content;
    body.appendChild(container);

    //If the parent container is an overflow <div> with scrollbars, subtract the scroll offsets.
    if (parentContainer) {
      pos[0] = pos[0] - parentContainer.scrollLeft;
      pos[1] = pos[1] - parentContainer.scrollTop;
    }
    nv.tooltip.calcTooltipPosition(pos, gravity, dist, container);
  };

  nv.tooltip.calcTooltipPosition = function (pos, gravity, dist, container) {
    var height = parseInt(container.offsetHeight),
        width = parseInt(container.offsetWidth),
        windowWidth = nv.utils.windowSize().width,
        windowHeight = nv.utils.windowSize().height,
        scrollTop = window.pageYOffset,
        scrollLeft = window.pageXOffset,
        left,
        top;

    windowHeight = window.innerWidth >= document.body.scrollWidth ? windowHeight : windowHeight - 16;
    windowWidth = window.innerHeight >= document.body.scrollHeight ? windowWidth : windowWidth - 16;

    gravity = gravity || "s";
    dist = dist || 20;

    var tooltipTop = function (Elem) {
      return nv.tooltip.findTotalOffsetTop(Elem, top);
    };

    var tooltipLeft = function (Elem) {
      return nv.tooltip.findTotalOffsetLeft(Elem, left);
    };

    switch (gravity) {
      case "e":
        left = pos[0] - width - dist;
        top = pos[1] - height / 2;
        var tLeft = tooltipLeft(container);
        var tTop = tooltipTop(container);
        if (tLeft < scrollLeft) left = pos[0] + dist > scrollLeft ? pos[0] + dist : scrollLeft - tLeft + left;
        if (tTop < scrollTop) top = scrollTop - tTop + top;
        if (tTop + height > scrollTop + windowHeight) top = scrollTop + windowHeight - tTop + top - height;
        break;
      case "w":
        left = pos[0] + dist;
        top = pos[1] - height / 2;
        var tLeft = tooltipLeft(container);
        var tTop = tooltipTop(container);
        if (tLeft + width > windowWidth) left = pos[0] - width - dist;
        if (tTop < scrollTop) top = scrollTop + 5;
        if (tTop + height > scrollTop + windowHeight) top = scrollTop + windowHeight - tTop + top - height;
        break;
      case "n":
        left = pos[0] - width / 2 - 5;
        top = pos[1] + dist;
        var tLeft = tooltipLeft(container);
        var tTop = tooltipTop(container);
        if (tLeft < scrollLeft) left = scrollLeft + 5;
        if (tLeft + width > windowWidth) left = left - width / 2 + 5;
        if (tTop + height > scrollTop + windowHeight) top = scrollTop + windowHeight - tTop + top - height;
        break;
      case "s":
        left = pos[0] - width / 2;
        top = pos[1] - height - dist;
        var tLeft = tooltipLeft(container);
        var tTop = tooltipTop(container);
        if (tLeft < scrollLeft) left = scrollLeft + 5;
        if (tLeft + width > windowWidth) left = left - width / 2 + 5;
        if (scrollTop > tTop) top = scrollTop;
        break;
      case "none":
        left = pos[0];
        top = pos[1] - dist;
        var tLeft = tooltipLeft(container);
        var tTop = tooltipTop(container);
        break;
    }


    container.style.left = left + "px";
    container.style.top = top + "px";
    container.style.opacity = 1;
    container.style.position = "absolute";

    return container;
  };




  nv.models.pieChart = function() {
      "use strict";
      //============================================================
      // Public Variables with Default Settings
      //------------------------------------------------------------

      var pie = nv.models.pie()
        , legend = nv.models.legend()
        ;

      var margin = {top: 30, right: 20, bottom: 20, left: 20}
        , width = null
        , height = null
        , showLegend = true
        , color = nv.utils.defaultColor()
        , tooltips = true
        , tooltip = function(key, y, e, graph) {
            return '<h3>' + key + '</h3>' +
                   '<p>' +  y + '</p>'
          }
        , state = {}
        , defaultState = null
        , noData = "No Data Available."
        , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
        ;

      //============================================================


      //============================================================
      // Private Variables
      //------------------------------------------------------------

      var showTooltip = function(e, offsetElement) {
        var tooltipLabel = pie.description()(e.point) || pie.x()(e.point)
        var left = e.pos[0] + ( (offsetElement && offsetElement.offsetLeft) || 0 ),
            top = e.pos[1] + ( (offsetElement && offsetElement.offsetTop) || 0),
            y = pie.valueFormat()(pie.y()(e.point)),
            content = tooltip(tooltipLabel, y, e, chart);

        nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
      };

      //============================================================


      function chart(selection) {
        selection.each(function(data) {
          // console.log("PIE", data)
          
          if(data && data.length){
            var _temp = [data[0]]
            convertDateTime(_temp);
            data = _temp[0].values;
          }

          var container = d3.select(this),
              that = this;

          var availableWidth = (width || parseInt(container.style('width')) || 960)
                                 - margin.left - margin.right,
              availableHeight = (height || parseInt(container.style('height')) || 400)
                                 - margin.top - margin.bottom;

          chart.update = function() { container.transition().call(chart); };
          chart.container = this;

          //set state.disabled
          state.disabled = data.map(function(d) { return !!d.disabled });

          if (!defaultState) {
            var key;
            defaultState = {};
            for (key in state) {
              if (state[key] instanceof Array)
                defaultState[key] = state[key].slice(0);
              else
                defaultState[key] = state[key];
            }
          }

          //------------------------------------------------------------
          // Display No Data message if there's nothing to show.

          if (!data || !data.length) {
            var noDataText = container.selectAll('.nv-noData').data([noData]);

            noDataText.enter().append('text')
              .attr('class', 'nvd3 nv-noData')
              .attr('dy', '-.7em')
              .style('text-anchor', 'middle');

            noDataText
              .attr('x', margin.left + availableWidth / 2)
              .attr('y', margin.top + availableHeight / 2)
              .text(function(d) { return d });

            return chart;
          } else {
            container.selectAll('.nv-noData').remove();
          }

          //------------------------------------------------------------


          //------------------------------------------------------------
          // Setup containers and skeleton of chart

          var wrap = container.selectAll('g.nv-wrap.nv-pieChart').data([data]);
          var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-pieChart').append('g');
          var g = wrap.select('g');

          gEnter.append('g').attr('class', 'nv-pieWrap');
          gEnter.append('g').attr('class', 'nv-legendWrap');

          //------------------------------------------------------------


          //------------------------------------------------------------
          // Legend

          if (showLegend) {
            legend
              .width( availableWidth )
              .key(pie.x());

            wrap.select('.nv-legendWrap')
                .datum(data)
                .call(legend);

            if ( margin.top != legend.height()) {
              margin.top = legend.height();
              availableHeight = (height || parseInt(container.style('height')) || 400)
                                 - margin.top - margin.bottom;
            }

            wrap.select('.nv-legendWrap')
                .attr('transform', 'translate(0,' + (-margin.top) +')');
          }

          //------------------------------------------------------------


          wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


          //------------------------------------------------------------
          // Main Chart Component(s)

          pie
            .width(availableWidth)
            .height(availableHeight);


          var pieWrap = g.select('.nv-pieWrap')
              .datum([data]);

          d3.transition(pieWrap).call(pie);

          //------------------------------------------------------------


          //============================================================
          // Event Handling/Dispatching (in chart's scope)
          //------------------------------------------------------------

          legend.dispatch.on('stateChange', function(newState) {
            state = newState;
            dispatch.stateChange(state);
            chart.update();
          });

          pie.dispatch.on('elementMouseout.tooltip', function(e) {
            dispatch.tooltipHide(e);
          });

          // Update chart from a state object passed to event handler
          dispatch.on('changeState', function(e) {

            if (typeof e.disabled !== 'undefined') {
              data.forEach(function(series,i) {
                series.disabled = e.disabled[i];
              });

              state.disabled = e.disabled;
            }

            chart.update();
          });

          //============================================================


        });

        return chart;
      }

      //============================================================
      // Event Handling/Dispatching (out of chart's scope)
      //------------------------------------------------------------

      pie.dispatch.on('elementMouseover.tooltip', function(e) {
        e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
        dispatch.tooltipShow(e);
      });

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) showTooltip(e);
      });

      dispatch.on('tooltipHide', function() {
        if (tooltips) nv.tooltip.cleanup();
      });

      //============================================================


      //============================================================
      // Expose Public Variables
      //------------------------------------------------------------

      // expose chart's sub-components
      chart.legend = legend;
      chart.dispatch = dispatch;
      chart.pie = pie;

      d3.rebind(chart, pie, 'valueFormat', 'values', 'x', 'y', 'description', 'id', 'showLabels', 'donutLabelsOutside', 'pieLabelsOutside', 'labelType', 'donut', 'donutRatio', 'labelThreshold');
      chart.options = nv.utils.optionsFunc.bind(chart);
      
      chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
        margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
        margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
        margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
        return chart;
      };

      chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };

      chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
      };

      chart.color = function(_) {
        if (!arguments.length) return color;
        color = nv.utils.getColor(_);
        legend.color(color);
        pie.color(color);
        return chart;
      };

      chart.showLegend = function(_) {
        if (!arguments.length) return showLegend;
        showLegend = _;
        return chart;
      };

      chart.tooltips = function(_) {
        if (!arguments.length) return tooltips;
        tooltips = _;
        return chart;
      };

      chart.tooltipContent = function(_) {
        if (!arguments.length) return tooltip;
        tooltip = _;
        return chart;
      };

      chart.state = function(_) {
        if (!arguments.length) return state;
        state = _;
        return chart;
      };

      chart.defaultState = function(_) {
        if (!arguments.length) return defaultState;
        defaultState = _;
        return chart;
      };

      chart.noData = function(_) {
        if (!arguments.length) return noData;
        noData = _;
        return chart;
      };

      //============================================================


      return chart;
    }




  //
  // SCATTER Model
  //
  nv.models.scatter = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 960,
        height = 500,
        color = nv.utils.defaultColor() // chooses color
    ,
        id = Math.floor(Math.random() * 100000) //Create semi-unique ID incase user doesn't select one
    ,
        x = d3.scale.linear(),
        y = d3.scale.linear(),
        z = d3.scale.linear() //linear because d3.svg.shape.size is treated as area
    ,   showPoints = true 
    ,
        getX = function (d) {
      return d.x;
    } // accessor to get the x value
    ,
        getY = function (d) {
      return d.y;
    } // accessor to get the y value
    ,
        getOX = function (d) {
      return d.ox;
    },
        getOY = function (d) {
      return d.oy;
    },
        getRadiusVectorWeight = function (d) {
      return d.weight;
    },
        getLabel = undefined //function(d) {return (d.label) ? d.label : ''}
    ,
        getSize = function (d) {
      return d.size || 1;
    } // accessor to get the point size
    ,
        getShape = function (d) {
      return d.shape || "circle";
    } // accessor to get point shape
    ,
        onlyCircles = true // Set to false to use shapes
    ,
        forceX = [] // List of numbers to Force into the X scale (ie. 0, or a max / min, etc.)
    ,
        forceY = [] // List of numbers to Force into the Y scale
    ,
        forceSize = [] // List of numbers to Force into the Size scale
    ,
        interactive = true // If true, plots a voronoi overlay for advanced point intersection
    ,
        pointKey = null,
        pointActive = function (d) {
      return !d.notActive;
    } // any points that return false will be filtered out
    ,
        padData = false // If true, adds half a data points width to front and back, for lining up a line chart with a bar chart
    ,
        padDataOuter = 0.1 //outerPadding to imitate ordinal scale outer padding
    ,
        clipEdge = false // if true, masks points within x and y scale
    ,
        clipVoronoi = true // if true, masks each point with a circle... can turn off to slightly increase performance
    ,
        clipRadius = function () {
      return 25;
    } // function to get the radius for voronoi point clips
    ,
        xDomain = null // Override x domain (skips the calculation from data)
    ,
        yDomain = null // Override y domain
    ,
        xRange = null // Override x range
    ,
        yRange = null // Override y range
    ,
        sizeDomain = null // Override point size domain
    ,
        sizeRange = null,
        singlePoint = false,
        dispatch = d3.dispatch("elementClick", "elementDblClick","elementMouseover", "elementMouseout"),
        useVoronoi = true,
        showRadiusVector = true;


    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var x0,
        y0,
        z0 // used to store previous scales
    ,
        timeoutID,
        needsUpdate = false // Flag for when the points are visually updating, but the interactive layer is behind, to disable tooltips
    ;

    //============================================================


    function chart(selection) {
      //console.log(selection)
      selection.each(function (data) {
        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            container = d3.select(this);

        //add series index to each data point for reference
        data.forEach(function (series, i) {
          series.values.forEach(function (point) {
            point.series = i;
            if (series.radiusVector && point.ox !== undefined && point.oy !== undefined) point.radiusVector = true;
          });
        });
        //console.log("data",data)
        //------------------------------------------------------------
        // Setup Scales

        // remap and flatten the data for use in calculating the scales' domains
        var seriesData = xDomain && yDomain && sizeDomain ? [] : // if we know xDomain and yDomain and sizeDomain, no need to calculate.... if Size is constant remember to set sizeDomain to speed up performance
        d3.merge(data.map(function (d) {
          return d.values.map(function (d, i) {
            return { x: getX(d, i), y: getY(d, i), size: getSize(d, i) };
          });
        }));

        x.domain(xDomain || d3.extent(seriesData.map(function (d) {
          return d.x;
        }).concat(forceX)));

        if (padData && data[0]) x.range(xRange || [(availableWidth * padDataOuter + availableWidth) / (2 * data[0].values.length), availableWidth - availableWidth * (1 + padDataOuter) / (2 * data[0].values.length)]);
        //x.range([availableWidth * .5 / data[0].values.length, availableWidth * (data[0].values.length - .5)  / data[0].values.length ]);
        else x.range(xRange || [0, availableWidth]);

        y.domain(yDomain || d3.extent(seriesData.map(function (d) {
          return d.y;
        }).concat(forceY))).range(yRange || [availableHeight, 0]);

        z.domain(sizeDomain || d3.extent(seriesData.map(function (d) {
          return d.size;
        }).concat(forceSize))).range(sizeRange || [16, 256]);

        // If scale's domain don't have a range, slightly adjust to make one... so a chart can show a single data point
        if (x.domain()[0] === x.domain()[1] || y.domain()[0] === y.domain()[1]) singlePoint = true;
        if (x.domain()[0] === x.domain()[1]) x.domain()[0] ? x.domain([x.domain()[0] - x.domain()[0] * 0.01, x.domain()[1] + x.domain()[1] * 0.01]) : x.domain([-1, 1]);

        if (y.domain()[0] === y.domain()[1]) y.domain()[0] ? y.domain([y.domain()[0] - y.domain()[0] * 0.01, y.domain()[1] + y.domain()[1] * 0.01]) : y.domain([-1, 1]);

        if (isNaN(x.domain()[0])) {
          x.domain([-1, 1]);
        }

        if (isNaN(y.domain()[0])) {
          y.domain([-1, 1]);
        }


        x0 = x0 || x;
        y0 = y0 || y;
        z0 = z0 || z;

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-scatter").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-scatter nv-chart-" + id + (singlePoint ? " nv-single-point" : ""));
        var defsEnter = wrapEnter.append("defs");
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-groups");
        gEnter.append("g").attr("class", "nv-point-paths");

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //------------------------------------------------------------


        defsEnter.append("clipPath").attr("id", "nv-edge-clip-" + id).append("rect");

        wrap.select("#nv-edge-clip-" + id + " rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);

        g.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + id + ")" : "");


        function updateInteractiveLayer() {
          if (!interactive) return false;

          var eventElements;

          var vertices = d3.merge(data.map(function (group, groupIndex) {
            return group.values.map(function (point, pointIndex) {
              // *Adding noise to make duplicates very unlikely
              // *Injecting series and point index for reference
              /* *Adding a 'jitter' to the points, because there's an issue in d3.geom.voronoi.
               */
              var pX = getX(point, pointIndex);
              var pY = getY(point, pointIndex);

              return [x(pX) + Math.random() * 1e-7, y(pY) + Math.random() * 1e-7, groupIndex, pointIndex, point]; //temp hack to add noise untill I think of a better way so there are no duplicates
            }).filter(function (pointArray, pointIndex) {
              return pointActive(pointArray[4], pointIndex); // Issue #237.. move filter to after map, so pointIndex is correct!
            });
          }));


          //inject series and point index for reference into voronoi
          if (useVoronoi === true) {
            if (clipVoronoi) {
              var pointClipsEnter = wrap.select("defs").selectAll(".nv-point-clips").data([id]).enter();

              pointClipsEnter.append("clipPath").attr("class", "nv-point-clips").attr("id", "nv-points-clip-" + id);

              var pointClips = wrap.select("#nv-points-clip-" + id).selectAll("circle").data(vertices);

              pointClips.enter().append("circle").attr("r", clipRadius);

              pointClips.exit().remove();
              pointClips.attr("cx", function (d) {
                return d[0];
              }).attr("cy", function (d) {
                return d[1];
              });


              wrap.select(".nv-point-paths").attr("clip-path", "url(#nv-points-clip-" + id + ")");
            }


            if (vertices.length) {
              // Issue #283 - Adding 2 dummy points to the voronoi b/c voronoi requires min 3 points to work
              vertices.push([x.range()[0] - 20, y.range()[0] - 20, null, null]);
              vertices.push([x.range()[1] + 20, y.range()[1] + 20, null, null]);
              vertices.push([x.range()[0] - 20, y.range()[0] + 20, null, null]);
              vertices.push([x.range()[1] + 20, y.range()[1] - 20, null, null]);
            }

            var bounds = d3.geom.polygon([[-10, -10], [-10, height + 10], [width + 10, height + 10], [width + 10, -10]]);

            var voronoi = d3.geom.voronoi(vertices).map(function (d, i) {
              return {
                data: bounds.clip(d),
                series: vertices[i][2],
                point: vertices[i][3]
              };
            });


            var pointPaths = wrap.select(".nv-point-paths").selectAll("path").data(voronoi);
            pointPaths.enter().append("path").attr("class", function (d, i) {
              return "nv-path-" + i;
            });
            pointPaths.exit().remove();
            pointPaths.attr("d", function (d) {
              if (!d) return "M 0 0";
              //if(!d.data) return 'M 0 0'
              if (d.data.length === 0) return "M 0 0";else return "M" + d.data.join("L") + "Z";
            });

            var mouseEventCallback = function (d, mDispatch, event) {
              if (needsUpdate) return 0;
              var series = data[d.series];
              if (typeof series === "undefined") return;

              var point = series.values[d.point];

              mDispatch({
                event: event,
                point: point,
                series: series,
                pos: [x(getX(point, d.point)) + margin.left, y(getY(point, d.point)) + margin.top],
                seriesIndex: d.series,
                pointIndex: d.point
              });
            };

            pointPaths
              .on("click", function (d) {
                mouseEventCallback(d, dispatch.elementClick);
              })
              .on("dblclick", function (d) {
                mouseEventCallback(d, dispatch.elementDblClick);
              })
              .on("mouseover", function (d) {
                mouseEventCallback(d, dispatch.elementMouseover, d3.event);
              })
              .on("mouseout", function (d, i) {
                mouseEventCallback(d, dispatch.elementMouseout, d3.event);
              });
          } else {
            /*
             // bring data in form needed for click handlers
             var dataWithPoints = vertices.map(function(d, i) {
             return {
             'data': d,
             'series': vertices[i][2],
             'point': vertices[i][3]
             }
             });
             */

            // add event handlers to points instead voronoi paths
            wrap.select(".nv-groups").selectAll(".nv-group").selectAll(".nv-point")
            //.data(dataWithPoints)
            //.style('pointer-events', 'auto') // recativate events, disabled by css
            .on("click", function (d, i) {
              // console.log("scatter point click")
              //nv.log('test', d, i);
              if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
              var series = data[d.series],
                  point = series.values[i];
                  // console.log("scatter point click")
              dispatch.elementClick({
                point: point,
                series: series,
                pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                seriesIndex: d.series,
                pointIndex: i
              });
            })

            .on("dblclick", function (d, i) {
              // console.log("scatter point dblclick")
              //nv.log('test', d, i);
              if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
              var series = data[d.series],
                  point = series.values[i];

              dispatch.elementDblClick({
                point: point,
                series: series,
                pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                seriesIndex: d.series,
                pointIndex: i
              });
            })

            .on("mouseover", function (d, i) {
              if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
              var series = data[d.series],
                  point = series.values[i];

              dispatch.elementMouseover({
                point: point,
                series: series,
                pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                seriesIndex: d.series,
                pointIndex: i
              });
            })
            .on("mouseout", function (d, i) {
              if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
              var series = data[d.series],
                  point = series.values[i];

              dispatch.elementMouseout({
                point: point,
                series: series,
                seriesIndex: d.series,
                pointIndex: i
              });
            });
          }

          needsUpdate = false;
        }

        needsUpdate = true;

        var groups = wrap.select(".nv-groups").selectAll(".nv-group").data(function (d) {
          return d;
        }, function (d) {
          return d.key;
        });
        groups.enter().append("g").style("stroke-opacity", 0.000001).style("fill-opacity", 0.000001);
        groups.exit().remove();
        groups.attr("class", function (d, i) {
          return "nv-group nv-series-" + i;
        }).classed("hover", function (d) {
          return d.hover;
        });
        groups.transition().style("fill", function (d, i) {
          return color(d, i);
        }).style("stroke", function (d, i) {
          return color(d, i);
        }).style("stroke-opacity", 1).style("fill-opacity", 0.5);
        
        if(showPoints){
          if (onlyCircles) {
            var points = groups.selectAll("circle.nv-point").data(function (d) {
              return d.values;
            }, pointKey);
            var labels = groups.selectAll("text.nv-label").data(function (d) {
              return d.values;
            }, pointKey);
            if (showRadiusVector) {
              groups.selectAll("line.nv-radius-vector").data(function (d) {
                return d.values;
              }, pointKey).exit().remove();

              var rVectors = groups.selectAll("line.nv-radius-vector").data(function (d) {
                return d.values.filter(function (item) {
                  return item.radiusVector;
                });
              }, pointKey);


              //console.log("rVectors",rVectors)
              rVectors.exit().remove();

              rVectors.enter().append("svg:line").attr("class", "nv-radius-vector").attr("x1", function (d, i) {
                return nv.utils.NaNtoZero(x0(getOX(d, i)));
              }).attr("y1", function (d, i) {
                return nv.utils.NaNtoZero(y0(getOY(d, i)));
              }).attr("x2", function (d, i) {
                return nv.utils.NaNtoZero(x0(getX(d, i)));
              }).attr("y2", function (d, i) {
                return nv.utils.NaNtoZero(y0(getY(d, i)));
              }).style("stroke", function (d, i) {
                return d.color;
              }).style("stroke-width", "1px").style("opacity", 0.3);
            }

            points.enter().append("circle").style("fill", function (d, i) {
              return d.color;
            }).style("stroke", function (d, i) {
              return d.color;
            }).attr("cx", function (d, i) {
              return nv.utils.NaNtoZero(x0(getX(d, i)));
            }).attr("cy", function (d, i) {
              return nv.utils.NaNtoZero(y0(getY(d, i)));
            }).attr("r", function (d, i) {
              return Math.sqrt(z(getSize(d, i)) / Math.PI);
            });
            points.exit().remove();
            labels.enter().append("text").style("fill", function (d, i) {
              return d.color;
            }).style("text-anchor", "start").attr("x", function (d, i) {
              return nv.utils.NaNtoZero(x0(getX(d, i)));
            }).attr("y", function (d, i) {
              return nv.utils.NaNtoZero(y0(getY(d, i)));
            }).attr("dy", "-0.7em").classed("nv-label", true).text(function (d, i) {
              return getLabel ? getLabel(d, i) : "";
            });
            ;
            labels.exit().remove();

            groups.exit().selectAll("path.nv-point").transition().attr("cx", function (d, i) {
              return nv.utils.NaNtoZero(x(getX(d, i)));
            }).attr("cy", function (d, i) {
              return nv.utils.NaNtoZero(y(getY(d, i)));
            }).remove();
            points.each(function (d, i) {
              d3.select(this).classed("nv-point", true).classed("nv-point-" + i, true).classed("hover", false);
            });
            labels.each(function (d, i) {
              d3.select(this).classed("nv-label", true);
            });
            points.transition().attr("cx", function (d, i) {
              return nv.utils.NaNtoZero(x(getX(d, i)));
            }).attr("cy", function (d, i) {
              return nv.utils.NaNtoZero(y(getY(d, i)));
            }).attr("r", function (d, i) {
              return Math.sqrt(z(getSize(d, i)) / Math.PI);
            });
            labels.transition().attr("x", function (d, i) {
              return nv.utils.NaNtoZero(x(getX(d, i)));
            }).attr("y", function (d, i) {
              return nv.utils.NaNtoZero(y(getY(d, i)));
            });
            if (showRadiusVector) {
              rVectors.transition().attr("class", "nv-radius-vector").attr("x1", function (d, i) {
                return nv.utils.NaNtoZero(x(getOX(d, i)));
              }).attr("y1", function (d, i) {
                return nv.utils.NaNtoZero(y(getOY(d, i)));
              }).attr("x2", function (d, i) {
                return nv.utils.NaNtoZero(x(getX(d, i)));
              }).attr("y2", function (d, i) {
                return nv.utils.NaNtoZero(y(getY(d, i)));
              }).style("opacity", 0.8);
            }
          } else {
            var points = groups.selectAll("path.nv-point").data(function (d) {
              return d.values;
            });
            points.enter().append("path").style("fill", function (d, i) {
              return d.color;
            }).style("stroke", function (d, i) {
              return d.color;
            }).attr("transform", function (d, i) {
              return "translate(" + x0(getX(d, i)) + "," + y0(getY(d, i)) + ")";
            }).attr("d", d3.svg.symbol().type(getShape).size(function (d, i) {
              return z(getSize(d, i));
            }));
            points.exit().remove();
            groups.exit().selectAll("path.nv-point").transition().attr("transform", function (d, i) {
              return "translate(" + x(getX(d, i)) + "," + y(getY(d, i)) + ")";
            }).remove();
            points.each(function (d, i) {
              d3.select(this).classed("nv-point", true).classed("nv-point-" + i, true).classed("hover", false);
            });
            points.transition().attr("transform", function (d, i) {
              //nv.log(d,i,getX(d,i), x(getX(d,i)));
              return "translate(" + x(getX(d, i)) + "," + y(getY(d, i)) + ")";
            }).attr("d", d3.svg.symbol().type(getShape).size(function (d, i) {
              return z(getSize(d, i));
            }));
          }
        }


        // Delay updating the invisible interactive layer for smoother animation
        clearTimeout(timeoutID); // stop repeat calls to updateInteractiveLayer
        timeoutID = setTimeout(updateInteractiveLayer, 300);
        //updateInteractiveLayer();

        //store old scales for use in transitions on update
        x0 = x.copy();
        y0 = y.copy();
        z0 = z.copy();
      });
      // console.log(chart.dispatch) 
      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------
    chart.clearHighlights = function () {
      //Remove the 'hover' class from all highlighted points.
      d3.selectAll(".nv-chart-" + id + " .nv-point.hover").classed("hover", false);
    };

    chart.highlightPoint = function (seriesIndex, pointIndex, isHoverOver) {
      d3.select(".nv-chart-" + id + " .nv-series-" + seriesIndex + " .nv-point-" + pointIndex).classed("hover", isHoverOver);
    };


    dispatch.on("elementMouseover.point", function (d) {
      if (interactive) chart.highlightPoint(d.seriesIndex, d.pointIndex, true);
    });

    dispatch.on("elementMouseout.point", function (d) {
      if (interactive) chart.highlightPoint(d.seriesIndex, d.pointIndex, false);
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

    chart.x = function (_) {
      if (!arguments.length) return getX;
      //console.log("set accessor",_ )

      getX = d3.functor(_);
      return chart;
    };

    chart.label = function (_) {
      if (!arguments.length) return getLabel;
      getLabel = d3.functor(_);
      return chart;
    };

    chart.showPoints = function (_) {
      if (!arguments.length) return showPoints;
      showPoints = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = d3.functor(_);
      return chart;
    };


    chart.ox = function (_) {
      if (!arguments.length) return getOX;
      //console.log("set accessor",_ )

      getOX = d3.functor(_);
      return chart;
    };

    chart.oy = function (_) {
      if (!arguments.length) return getOY;
      //console.log("set accessor",_ )

      getOY = d3.functor(_);
      return chart;
    };

    chart.size = function (_) {
      if (!arguments.length) return getSize;
      getSize = d3.functor(_);
      return chart;
    };

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

    chart.xScale = function (_) {
      if (!arguments.length) return x;
      x = _;
      return chart;
    };

    chart.yScale = function (_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.zScale = function (_) {
      if (!arguments.length) return z;
      z = _;
      return chart;
    };

    chart.xDomain = function (_) {
      if (!arguments.length) return xDomain;
      xDomain = _;
      return chart;
    };

    chart.yDomain = function (_) {
      if (!arguments.length) return yDomain;
      yDomain = _;
      return chart;
    };

    chart.sizeDomain = function (_) {
      if (!arguments.length) return sizeDomain;
      sizeDomain = _;
      return chart;
    };

    chart.xRange = function (_) {
      if (!arguments.length) return xRange;
      xRange = _;
      return chart;
    };

    chart.yRange = function (_) {
      if (!arguments.length) return yRange;
      yRange = _;
      return chart;
    };

    chart.sizeRange = function (_) {
      if (!arguments.length) return sizeRange;
      sizeRange = _;
      return chart;
    };

    chart.forceX = function (_) {
      if (!arguments.length) return forceX;
      forceX = _;
      return chart;
    };

    chart.forceY = function (_) {
      if (!arguments.length) return forceY;
      forceY = _;
      return chart;
    };

    chart.forceSize = function (_) {
      if (!arguments.length) return forceSize;
      forceSize = _;
      return chart;
    };

    chart.interactive = function (_) {
      if (!arguments.length) return interactive;
      interactive = _;
      return chart;
    };

    chart.pointKey = function (_) {
      if (!arguments.length) return pointKey;
      pointKey = _;
      return chart;
    };

    chart.pointActive = function (_) {
      if (!arguments.length) return pointActive;
      pointActive = _;
      return chart;
    };

    chart.padData = function (_) {
      if (!arguments.length) return padData;
      padData = _;
      return chart;
    };

    chart.padDataOuter = function (_) {
      if (!arguments.length) return padDataOuter;
      padDataOuter = _;
      return chart;
    };

    chart.clipEdge = function (_) {
      if (!arguments.length) return clipEdge;
      clipEdge = _;
      return chart;
    };

    chart.clipVoronoi = function (_) {
      if (!arguments.length) return clipVoronoi;
      clipVoronoi = _;
      return chart;
    };

    chart.useVoronoi = function (_) {
      if (!arguments.length) return useVoronoi;
      useVoronoi = _;
      if (useVoronoi === false) {
        clipVoronoi = false;
      }
      return chart;
    };

    chart.showRadiusVector = function (_) {
      if (!arguments.length) return showRadiusVector;
      showRadiusVector = _;
      return chart;
    };

    chart.clipRadius = function (_) {
      if (!arguments.length) return clipRadius;
      clipRadius = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      return chart;
    };

    chart.shape = function (_) {
      if (!arguments.length) return getShape;
      getShape = _;
      return chart;
    };

    chart.onlyCircles = function (_) {
      if (!arguments.length) return onlyCircles;
      onlyCircles = _;
      return chart;
    };

    chart.id = function (_) {
      if (!arguments.length) return id;
      id = _;
      return chart;
    };

    chart.singlePoint = function (_) {
      if (!arguments.length) return singlePoint;
      singlePoint = _;
      return chart;
    };

    //============================================================

    // console.log("init",chart.dispatch) 
    return chart;
  };


  //
  // SCATTER CHART Model
  //

  nv.models.scatterChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var scatter = nv.models.scatter(),
        xAxis = nv.models.axis(),
        yAxis = nv.models.axis(),
        legend = nv.models.legend(),
        controls = nv.models.legend(),
        distX = nv.models.distribution(),
        distY = nv.models.distribution();

    var margin = { top: 30, right: 20, bottom: 50, left: 75 },
        width = null,
        height = null,
        color = nv.utils.defaultColor(),
        x = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.xScale(),
        y = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.yScale(),
        xPadding = 0,
        yPadding = 0,
        showDistX = false,
        showDistY = false,
        showLegend = true,
        showXAxis = true,
        showYAxis = true,
        rightAlignYAxis = false,
        showControls = !!d3.fisheye,
        fisheye = 0,
        pauseFisheye = false,
        tooltips = true,
        tooltipX = function (key, x, y) {
      return "<strong>" + x + "</strong>";
    },
        tooltipY = function (key, x, y) {
      return "<strong>" + y + "</strong>";
    },
        tooltip = null,
        state = {},
        defaultState = null,
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState"),
        noData = "No Data Available.",
        transitionDuration = 250,
        tooltipShift = { x: 0, y: 0 },
        showRadiusVector = true;

    scatter.xScale(x).yScale(y);
    xAxis.orient("bottom").tickPadding(10);
    yAxis.orient(rightAlignYAxis ? "right" : "left").tickPadding(10);
    distX.axis("x");
    distY.axis("y");

    controls.updateState(false);

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var x0, y0;


    function getOffset(elem) {
      if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem);
      } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem);
      }
    }

    function getOffsetSum(elem) {
      var top = 0,
          left = 0;
      while (elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
      }

      return { top: top, left: left };
    }

    function getOffsetRect(elem) {
      // (1)
      var box = elem.getBoundingClientRect();

      // (2)
      var body = document.body;
      var docElem = document.documentElement;

      // (3)
      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      // (4)
      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      // (5)
      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
    }


    var showTooltip = function (e, offsetElement) {
      //TODO: make tooltip style an option between single or dual on axes (maybe on all charts with axes?)

      var left = e.pos[0] + tooltipShift.x,




      // ( offsetElement.offsetLeft || 0 ),
      top = e.pos[1] + tooltipShift.y,




      //( offsetElement.offsetTop || 0),
      leftX = e.pos[0] + tooltipShift.x,




      //( offsetElement.offsetLeft || 0 ),
      topX = y.range()[0] + margin.top + tooltipShift.y,




      //margin.top + ( offsetElement.offsetTop || 0),
      leftY = x.range()[0] + margin.left + tooltipShift.x,




      //( offsetElement.offsetLeft || 0 ),
      topY = e.pos[1] + tooltipShift.y - margin.top,




      //( offsetElement.offsetTop || 0),
      xVal = xAxis.tickFormat()(scatter.x()(e.point, e.pointIndex)),
          yVal = yAxis.tickFormat()(scatter.y()(e.point, e.pointIndex));

      //if (tooltipX != null) nv.tooltip.show([leftX, topX], tooltipX(e.series.key, xVal, yVal, e, chart), "n", 1, offsetElement, "x-nvtooltip");
      //if (tooltipY != null) nv.tooltip.show([leftY, topY], tooltipY(e.series.key, xVal, yVal, e, chart), "e", 1, offsetElement, "y-nvtooltip");
      //if (tooltip != null) nv.tooltip.show([left, top], tooltip(e.series.key, xVal, yVal, e, chart), e.value < 0 ? "n" : "s", null, offsetElement);
      if (tooltip != null) nv.tooltip.show([e.event.pageX, e.event.pageY], tooltip(e.series.key, xVal, yVal, e, chart), e.value < 0 ? "n" : "s", null, null, "xy-tooltip with-3d-shadow with-transitions");
    };

    var controlsData = [{ key: "Magnify", disabled: true }];

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var container = d3.select(this),
            that = this;

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

        chart.update = function () {
          container.transition().duration(transitionDuration).call(chart);
        };
        chart.container = this;

        //set state.disabled
        state.disabled = data.map(function (d) {
          return !!d.disabled;
        });

        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display noData message if there's nothing to show.

        if (!data || !data.length || !data.filter(function (d) {
          return d.values.length;
        }).length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------
         //------------------------------------------------------------

          if(data[0].axisX.role == "time"){
            data.forEach(function(serie){
              serie.values.forEach(function(value){
                value.x = new Date(value.x)
              })
            })
            // console.log("Time format", data)
          }  

        //------------------------------------------------------------
        // Setup Scales
        if(data[0].axisX.role == "time"){
          x = d3.time.scale();
          x.domain([data[0].values[0].x,data[0].values[data[0].values.length-1].x])
          scatter.xScale = x;
          x.range([0, availableWidth])  
        }
        // else{
        //   x = scatter.xScale();
        // }

        // y = scatter.yScale();

        //------------------------------------------------------------

        //------------------------------------------------------------
        // Setup Scales

        x0 = x0 || x;
        y0 = y0 || y;

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-scatterChart").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-scatterChart nv-chart-" + scatter.id());
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        // background for pointer events
        gEnter.append("rect").attr("class", "nvd3 nv-background");

        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "nv-y nv-axis");
        gEnter.append("g").attr("class", "nv-scatterWrap");
        gEnter.append("g").attr("class", "nv-distWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");
        gEnter.append("g").attr("class", "nv-controlsWrap");

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Legend
        // 

         showLegend = showLegend && data.length > 1;


        if (showLegend) {
          var legendWidth = showControls ? availableWidth / 2 : availableWidth;
          legend.width(legendWidth);

          wrap.select(".nv-legendWrap").datum(data).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          wrap.select(".nv-legendWrap").attr("transform", "translate(" + (availableWidth - legendWidth) + "," + -margin.top + ")");
        }

        //------------------------------------------------------------

        tooltipShift.x = this.offsetLeft;
        tooltipShift.y = getOffset(this).top;
        //------------------------------------------------------------
        // Controls

        if (showControls) {
          controls.width(180).color(["#444"]);
          g.select(".nv-controlsWrap").datum(controlsData).attr("transform", "translate(0," + -margin.top + ")").call(controls);
        }

        //------------------------------------------------------------

        var mt = margin.top + 10;
        wrap.attr("transform", "translate(" + margin.left + "," + mt + ")");

        if (rightAlignYAxis) {
          g.select(".nv-y.nv-axis").attr("transform", "translate(" + availableWidth + ",0)");
        }

        //------------------------------------------------------------
        // Main Chart Component(s)

        scatter.width(availableWidth).height(availableHeight).color(data.map(function (d, i) {
          return d.color || color(d, i);
        }).filter(function (d, i) {
          return !data[i].disabled;
        }));

        if (xPadding !== 0) scatter.xDomain(null);

        if (yPadding !== 0) scatter.yDomain(null);

        wrap.select(".nv-scatterWrap").datum(data.filter(function (d) {
          return !d.disabled;
        })).attr("transform", "translate(0,10)").call(scatter);

        //Adjust for x and y padding
        if (xPadding !== 0) {
          var xRange = x.domain()[1] - x.domain()[0];
          scatter.xDomain([x.domain()[0] - xPadding * xRange, x.domain()[1] + xPadding * xRange]);
        }

        if (yPadding !== 0) {
          var yRange = y.domain()[1] - y.domain()[0];
          scatter.yDomain([y.domain()[0] - yPadding * yRange, y.domain()[1] + yPadding * yRange]);
        }

        //Only need to update the scatter again if x/yPadding changed the domain.
        if (yPadding !== 0 || xPadding !== 0) {
          wrap.select(".nv-scatterWrap").datum(data.filter(function (d) {
            return !d.disabled;
          })).call(scatter);
        }

        //------------------------------------------------------------
        if (showXAxis) {
            if(data[0].axisX.role == "time"){
              xAxis.tickFormat(customTimeFormat);
            }
            // else{
              // xAxis.scale(x).ticks(xAxis.ticks() && xAxis.ticks().length ? xAxis.ticks() : availableWidth / 100).tickSize(-availableHeight, 0);
            // }
            // else{
              xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);
            // }

           
            g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (y.range()[0] + 10) + ")");
            g.select(".nv-x.nv-axis").transition().call(xAxis);
          // }else{
          //   g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (y.range()[0] + 10) + ")").call(xAxis);
          // }
        }  


        //------------------------------------------------------------
        // Setup Axes

        if (showYAxis) {
          yAxis.scale(y).ticks(yAxis.ticks() && yAxis.ticks().length ? yAxis.ticks() : availableHeight / 36).tickSize(-availableWidth, 0);

          g.select(".nv-y.nv-axis").attr("transform", "translate(0," + 10 + ")").call(yAxis);
        }


        if (showDistX) {
          distX.getData(scatter.x()).scale(x).width(availableWidth).color(data.map(function (d, i) {
            return d.color || color(d, i);
          }).filter(function (d, i) {
            return !data[i].disabled;
          }));
          gEnter.select(".nv-distWrap").append("g").attr("class", "nv-distributionX");
          g.select(".nv-distributionX").attr("transform", "translate(0," + y.range()[0] + ")").datum(data.filter(function (d) {
            return !d.disabled;
          })).call(distX);
        }

        if (showDistY) {
          distY.getData(scatter.y()).scale(y).width(availableHeight).color(data.map(function (d, i) {
            return d.color || color(d, i);
          }).filter(function (d, i) {
            return !data[i].disabled;
          }));
          gEnter.select(".nv-distWrap").append("g").attr("class", "nv-distributionY");
          g.select(".nv-distributionY").attr("transform", "translate(" + (rightAlignYAxis ? availableWidth : -distY.size()) + ",0)").datum(data.filter(function (d) {
            return !d.disabled;
          })).call(distY);
        }

        //------------------------------------------------------------


        if (d3.fisheye) {
          g.select(".nv-background").attr("width", availableWidth).attr("height", availableHeight);

          g.select(".nv-background").on("mousemove", updateFisheye);
          g.select(".nv-background").on("click", function () {
            pauseFisheye = !pauseFisheye;
          });
          scatter.dispatch.on("elementClick.freezeFisheye", function () {
            pauseFisheye = !pauseFisheye;
          });
        }


        function updateFisheye() {
          if (pauseFisheye) {
            g.select(".nv-point-paths").style("pointer-events", "all");
            return false;
          }

          g.select(".nv-point-paths").style("pointer-events", "none");

          var mouse = d3.mouse(this);
          x.distortion(fisheye).focus(mouse[0]);
          y.distortion(fisheye).focus(mouse[1]);

          g.select(".nv-scatterWrap").call(scatter);

          if (showXAxis) g.select(".nv-x.nv-axis").call(xAxis);

          if (showYAxis) g.select(".nv-y.nv-axis").call(yAxis);

          g.select(".nv-distributionX").datum(data.filter(function (d) {
            return !d.disabled;
          })).call(distX);
          g.select(".nv-distributionY").datum(data.filter(function (d) {
            return !d.disabled;
          })).call(distY);
        }


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        controls.dispatch.on("legendClick", function (d, i) {
          d.disabled = !d.disabled;

          fisheye = d.disabled ? 0 : 2.5;
          g.select(".nv-background").style("pointer-events", d.disabled ? "none" : "all");
          g.select(".nv-point-paths").style("pointer-events", d.disabled ? "all" : "none");

          if (d.disabled) {
            x.distortion(fisheye).focus(0);
            y.distortion(fisheye).focus(0);

            g.select(".nv-scatterWrap").call(scatter);
            g.select(".nv-x.nv-axis").call(xAxis);
            g.select(".nv-y.nv-axis").call(yAxis);
          } else {
            pauseFisheye = false;
          }

          chart.update();
        });

        legend.dispatch.on("stateChange", function (newState) {
          state.disabled = newState.disabled;
          dispatch.stateChange(state);
          chart.update();
        });

        scatter.dispatch.on("elementMouseover.tooltip", function (e) {
          d3.select(".nv-chart-" + scatter.id() + " .nv-series-" + e.seriesIndex + " .nv-distx-" + e.pointIndex).attr("y1", function (d, i) {
            return e.pos[1] - availableHeight;
          });
          d3.select(".nv-chart-" + scatter.id() + " .nv-series-" + e.seriesIndex + " .nv-disty-" + e.pointIndex).attr("x2", e.pos[0] + distX.size());

          e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
          dispatch.tooltipShow(e);
        });

        dispatch.on("tooltipShow", function (e) {
          if (tooltips) showTooltip(e, that.parentNode);
        });

        // Update chart from a state object passed to event handler
        dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined") {
            data.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          chart.update();
        });

        //============================================================


        //store old scales for use in transitions on update
        x0 = x.copy();
        y0 = y.copy();
      });

      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    scatter.dispatch.on("elementMouseout.tooltip", function (e) {
      dispatch.tooltipHide(e);

      d3.select(".nv-chart-" + scatter.id() + " .nv-series-" + e.seriesIndex + " .nv-distx-" + e.pointIndex).attr("y1", 0);
      d3.select(".nv-chart-" + scatter.id() + " .nv-series-" + e.seriesIndex + " .nv-disty-" + e.pointIndex).attr("x2", distY.size());
    });
    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.dispatch = dispatch;
    chart.scatter = scatter;
    chart.legend = legend;
    chart.controls = controls;
    chart.xAxis = xAxis;
    chart.yAxis = yAxis;
    chart.distX = distX;
    chart.distY = distY;

    d3.rebind(chart, scatter, "id", "interactive", "pointActive", "x", "y", "shape", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "sizeRange", "forceX", "forceY", "forceSize", "clipVoronoi", "clipRadius", "useVoronoi");
    chart.options = nv.utils.optionsFunc.bind(chart);

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

    chart.showRadiusVector = function (_) {
      showRadiusVector = _;
      scatter.showRadiusVector(_);
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      legend.color(color);
      distX.color(color);
      distY.color(color);
      return chart;
    };

    chart.showDistX = function (_) {
      if (!arguments.length) return showDistX;
      showDistX = _;
      return chart;
    };

    chart.showDistY = function (_) {
      if (!arguments.length) return showDistY;
      showDistY = _;
      return chart;
    };

    chart.showControls = function (_) {
      if (!arguments.length) return showControls;
      showControls = _;
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.showXAxis = function (_) {
      if (!arguments.length) return showXAxis;
      showXAxis = _;
      return chart;
    };


    chart.showYAxis = function (_) {
      if (!arguments.length) return showYAxis;
      showYAxis = _;
      return chart;
    };

    chart.rightAlignYAxis = function (_) {
      if (!arguments.length) return rightAlignYAxis;
      rightAlignYAxis = _;
      yAxis.orient(_ ? "right" : "left");
      return chart;
    };


    chart.fisheye = function (_) {
      if (!arguments.length) return fisheye;
      fisheye = _;
      return chart;
    };

    chart.xPadding = function (_) {
      if (!arguments.length) return xPadding;
      xPadding = _;
      return chart;
    };

    chart.yPadding = function (_) {
      if (!arguments.length) return yPadding;
      yPadding = _;
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
      return chart;
    };

    chart.tooltipXContent = function (_) {
      if (!arguments.length) return tooltipX;
      tooltipX = _;
      return chart;
    };

    chart.tooltipYContent = function (_) {
      if (!arguments.length) return tooltipY;
      tooltipY = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    chart.transitionDuration = function (_) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = _;
      return chart;
    };

    //============================================================


    return chart;
  };


  nv.models.radar = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var scatter = nv.models.scatter();
    //console.log("Before",scatter)
    scatter.x(function (d, i) {
      return calculateX(d.value, i);
    }).y(function (d, i) {
      return calculateY(d.value, i);
    });
    //console.log("After",scatter)


    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 960,
        height = 500,
        color = nv.utils.defaultColor() // a function that returns a color
    ,
        getX = function (d, i) {
      return calculateX(d.value, i);
    } // accessor to get the x value from a data point
    ,
        getY = function (d, i) {
      return calculateY(d.value, i);
    } // accessor to get the y value from a data point
    ,
        getLabel = undefined //function(d) { return d.y }
    ,
        defined = function (d, i) {
      return !isNaN(getY(d, i)) && getY(d, i) !== null;
    } // allows a line to be not continuous when it is not defined
    ,
        isArea = function (d) {
      return d.area;
    } // decides if a line is an area or just a line
    ,
        clipEdge = false // if true, masks lines within x and y scale
    ,
        x //can be accessed via chart.xScale()
    ,
        y //can be accessed via chart.yScale()
    ,
        interpolate = "linear" // controls the line interpolation
    ,
        serieLength,
        serieCount,
        max,
        tickCount = 10,
        scales = d3.scale.linear(),
        showGrid = true,
        showTickLabels = true,
        showAxisLabels = true;

    scatter.size(16) // default size
    .sizeDomain([16, 256]);

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var x0, y0 //used to store previous scales
    ;

    //============================================================


    function chart(selection) {
      //console.log("Selection",selection)

      selection.each(function (data) {
        // console.log("RADAR",data)
        serieCount = data.length;
        serieLength = data[0].values.length;
        max = data[0].values[0].value;
        for (var i in data) {
          var m = data[i].values[0].value;
          m = data[i].values.reduce(function (v, item) {
            m = Math.max(m, item.value);
            return m;
          });
          max = Math.max(max, m);
        }
        max += max * 0.1;


        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,





        //radius = Math.min(availableWidth,availableHeight),
        container = d3.select(this);
        //console.log("RADAR",availableWidth,availableHeight,radius)
        //------------------------------------------------------------
        // Setup Scales

        scales.domain([-1, 1]);

        //console.log("SCALES",radius,scales(-1),scales(1));

        scatter.xDomain([-1, 1]).yDomain([-1, 1]).xScale(scales).yScale(scales);

        y = scatter.yScale();
        x = scatter.xScale();

        x0 = x0 || x;
        y0 = y0 || y;

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-line").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-line");
        var defsEnter = wrapEnter.append("defs");
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-groups");
        gEnter.append("g").attr("class", "nv-scatterWrap");
        gEnter.append("g").attr("class", "nv-grid");
        var mt = margin.top + 20;
        var ml = margin.left;
        wrap.attr("transform", "translate(" + ml + "," + mt + ")");

        //------------------------------------------------------------


        scatter.width(availableWidth).height(availableHeight);
        //    //.xScale(scatter.yScale())
        //    .useVoronoi(false)

        //scatter
        //    .width(radius)
        //    .height(radius)
        //    //.xScale(scales)
        //    //.yScale(scales)
        //    //.useVoronoi(false)

        var scatterWrap = wrap.select(".nv-scatterWrap");
        //.datum(data); // Data automatically trickles down from the wrap

        scatterWrap.transition().call(scatter);


        defsEnter.append("clipPath").attr("id", "nv-edge-clip-" + scatter.id()).append("rect");

        wrap.select("#nv-edge-clip-" + scatter.id() + " rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);

        g.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");
        scatterWrap.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");

        var grid = wrap.select(".nv-grid");
        grid.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");


        var groups = wrap.select(".nv-groups").selectAll(".nv-group").data(data)
        // .data(function (d) {
        //   return d;
        // }, function (d) {
        //   return d.key;
        // });
        groups.enter().append("g").style("stroke-opacity", 0.000001).style("fill-opacity", 0.000001);

        groups.exit().remove();

        groups.attr("class", function (d, i) {
          return "nv-group nv-series-" + i;
        }).classed("hover", function (d) {
          return d.hover;
        }).style("fill", function (d, i) {
          return color(d, i);
        }).style("stroke", function (d, i) {
          return color(d, i);
        });
        groups.transition().style("stroke-opacity", 1).style("fill-opacity", 0.3);


        var areaPaths = groups.selectAll("path.nv-area").data(function (d) {
          return isArea(d) ? [d] : [];
        }); // this is done differently than lines because I need to check if series is an area
        areaPaths.enter().append("path").attr("class", "nv-area").attr("d", function (d) {
          return d3.svg.area().interpolate("linear-closed").defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x0(getX(d, i)));
          }).y0(function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, i)));
          })
          //.y1(function(d,i) { return y0( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
          .y1(function (d, i) {
            return y0(0);
          }) //assuming 0 is within y domain.. may need to tweak this
          .apply(this, [d.values]);
        });

        groups.exit().selectAll("path.nv-area").remove();

        areaPaths.transition().attr("d", function (d) {
          return d3.svg.area().interpolate("linear-closed").defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x(getX(d, i)));
          }).y0(function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, i)));
          })
          //.y1(function(d,i) { return y( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
          .y1(function (d, i) {
            return y0(0);
          }) //assuming 0 is within y domain.. may need to tweak this
          .apply(this, [d.values]);
        });


        var linePaths = groups.selectAll("path.nv-line").data(function (d) {
          return [d.values];
        });
        linePaths.enter().append("path").attr("class", "nv-line").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
          return nv.utils.NaNtoZero(x0(getX(d, i)));
        }).y(function (d, i) {
          return nv.utils.NaNtoZero(y0(getY(d, i)));
        }));

        linePaths.transition().style("stroke-width", "2px").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
          return nv.utils.NaNtoZero(x(getX(d, i)));
        }).y(function (d, i) {
          return nv.utils.NaNtoZero(y(getY(d, i)));
        }));

        // create grid levels
        if (showGrid) {
          var gridLevels = wrap.select(".nv-grid").selectAll("path.nv-grid-level").data(getGridData());

          gridLevels.exit().remove();

          gridLevels.enter().append("path").attr("class", "nv-grid-level").attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x0(getX(d, i)));
          }).y(function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, i)));
          }));


          gridLevels.style("stroke", "#000000").style("fill", "none").style("opacity", 0.3).style("stroke-width", "0.6px");

          gridLevels.transition().attr("d", d3.svg.line().interpolate("linear-closed").defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x(getX(d, i)));
          }).y(function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, i)));
          }));

          // create grid axises
          gridLevels = wrap.select(".nv-grid").selectAll("line.nv-grid-axis").data(getGridAxis(data));
          gridLevels.exit().remove();
          gridLevels.enter().append("svg:line").attr("class", "nv-grid-axis").attr("x1", function (d, i) {
            return nv.utils.NaNtoZero(x0(getX({ value: max * 0.00001 }, i)));
          }).attr("y1", function (d, i) {
            return nv.utils.NaNtoZero(y0(getY({ value: max * 0.00001 }, i)));
          }).attr("x2", function (d, i) {
            return nv.utils.NaNtoZero(x0(getX(d, i)));
          }).attr("y2", function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, i)));
          });

          gridLevels.style("stroke", "#000").style("fill", "none").style("opacity", 0.3).style("stroke-width", "1px");


          gridLevels.transition().attr("class", "nv-grid-axis").attr("x1", function (d, i) {
            return nv.utils.NaNtoZero(x(getX({ value: max * 0.00001 }, i)));
          }).attr("y1", function (d, i) {
            return nv.utils.NaNtoZero(y(getY({ value: max * 0.00001 }, i)));
          }).attr("x2", function (d, i) {
            return nv.utils.NaNtoZero(x(getX(d, i)));
          }).attr("y2", function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, i)));
          });
        }
        //create  grid labels
        if (showAxisLabels) {
          var gridLevels = wrap.select(".nv-grid").selectAll("text.nv-grid-label").data(getGridAxis(data));
          gridLevels.exit().remove();
          gridLevels.enter().append("text").attr("class", "nv-grid-label").style("fill", function (d, i) {
            return "#000000";
          }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
            return getTextAnchor(d, i);
          }).attr("x", function (d, i) {
            return nv.utils.NaNtoZero(x0(getX(d, i)));
          }).attr("y", function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, i)));
          }).attr("dy", function (d, i) {
            return getDy(d, i);
          }).classed("nv-label", true).text(function (d, i) {
            return d.label;
          });

          gridLevels.style("stroke", "none").style("opacity", 0.9);

          gridLevels.transition().attr("class", "nv-grid-label").style("fill", function (d, i) {
            return "#000000";
          }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
            return getTextAnchor(d, i);
          }).attr("x", function (d, i) {
            return nv.utils.NaNtoZero(x(getX(d, i)));
          }).attr("y", function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, i)));
          }).attr("dy", function (d, i) {
            return getDy(d, i);
          })
          //.classed('nv-label',true)
          .text(function (d, i) {
            return d.label;
          });
        }

        // create tick labels
        if (showTickLabels) {
          var gridLevels = wrap.select(".nv-grid").selectAll("text.nv-grid-tick-label").data(getTickLabels());
          gridLevels.exit().remove();
          gridLevels.enter().append("text").attr("class", "nv-grid-tick-label").style("fill", function (d, i) {
            return "#000000";
          }).style("font", "bold x-small Arial").style("text-anchor", "start").attr("x", function (d, i) {
            return nv.utils.NaNtoZero(x0(getX({ value: 0 }, 0)));
          }).attr("y", function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, 0)));
          }).attr("dy", "-0.2em").classed("nv-label", true).text(function (d, i) {
            return d.value.toFixed(2);
          });

          gridLevels.style("stroke", "none").style("opacity", 0.7);

          gridLevels.transition().attr("class", "nv-grid-tick-label").style("fill", function (d, i) {
            return "#000000";
          }).style("text-anchor", "start").style("font", "bold x-small Arial").attr("x", function (d, i) {
            return nv.utils.NaNtoZero(x(getX({ value: 0 }, 0)));
          }).attr("y", function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, 0)));
          }).attr("dy", "-0.2em").text(function (d, i) {
            return d.value.toFixed(2);
          });
        }


        //store old scales for use in transitions on update
        x0 = x.copy();
        y0 = y.copy();
      });

      return chart;
    }

    function getTextAnchor(d, i) {
      var x = Math.sin(angle(i));
      if (Math.abs(x) < 0.1) return "middle";
      if (x > 0.1) return "end";
      return "start";
    }

    function getDy(d, i) {
      if (i == 0) return "-1.5em";
      var y = Math.cos(angle(i));
      if (Math.abs(y) < 0.1) return ".72em";
      if (y > 0.1) return "-.3em";
      return "1em";
    }

    function angle(i) {
      return -i * (2 * Math.PI / serieLength); // + ((2 * Math.PI) * startAngle / 360) + (cursor * 2 * Math.PI) / length;
    }


    // x-caclulator
    // d is the datapoint, i is the index, length is the length of the data
    function calculateX(d, i) {
      var l = d / max; // x(d);
      //console.log("X",d,l,length,i,angle(i, length),2*Math.PI/angle(i, length),Math.sin(angle(i, length)) * l);
      return Math.sin(angle(i)) * l;
    }

    // y-calculator
    function calculateY(d, i) {
      var l = d / max; // y(d);
      //console.log("Y",d,l,length,i,angle(i, length),2*Math.PI/angle(i, length),Math.cos(angle(i, length)) * l);
      return Math.cos(angle(i)) * l;
    }

    function getGridData() {
      var gridData = [];
      for (var i = 0; i < tickCount; i++) {
        var levelKey = max * (i + 1) / tickCount;
        var level = [];
        level.key = (levelKey * 100).toFixed(0) + "%";
        //level.values = [];
        for (var j = 0; j < serieLength; j++) {
          level.push({ value: levelKey });
        }
        gridData.push(level);
      }
      //console.log(gridData)
      return gridData;
    }

    function getGridAxis(data) {
      var gridAxis = [];
      for (var j = 0; j < serieLength; j++) {
        //var axis = [];
        //axis.push({label:"",value:0});
        //axis.push({label:data[0].values[j].label,value:max});
        gridAxis.push({ label: data[0].values[j].label, value: max });
      }

      //console.log(gridData)
      return gridAxis;
    }

    function getTickLabels() {
      var tickLabels = [];
      for (var i = 0; i < tickCount; i++) {
        tickLabels.push({ value: max * (i + 1) / tickCount });
      }
      //console.log(gridData)
      return tickLabels;
    }


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = scatter.dispatch;
    chart.scatter = scatter;

    d3.rebind(chart, scatter, "id", "interactive", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "forceX", "forceY", "forceSize", "clipVoronoi", "useVoronoi", "clipRadius", "padData", "highlightPoint", "clearHighlights");

    chart.options = nv.utils.optionsFunc.bind(chart);

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

    chart.x = function (_) {
      if (!arguments.length) return getX;
      getX = _;
      scatter.x(_);
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = _;
      scatter.y(_);
      return chart;
    };

    chart.grid = function (_) {
      if (!arguments.length) return showGrid;
      showGrid = _;
      return chart;
    };

    chart.axisLabel = function (_) {
      if (!arguments.length) return showAxisLabels;
      showAxisLabels = _;
      return chart;
    };

    chart.tickLabel = function (_) {
      if (!arguments.length) return showTickLabels;
      showTickLabels = _;
      return chart;
    };

    chart.ticks = function (_) {
      if (!arguments.length) return tickCount;
      tickCount = _;
      return chart;
    };

    chart.label = function (_) {
      //console.log("chart label",_)
      if (!arguments.length) return getLabel;
      getLabel = _;
      scatter.label(_);
      return chart;
    };

    chart.clipEdge = function (_) {
      if (!arguments.length) return clipEdge;
      clipEdge = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      scatter.color(color);
      return chart;
    };

    chart.interpolate = function (_) {
      if (!arguments.length) return interpolate;
      interpolate = _;
      return chart;
    };

    chart.defined = function (_) {
      if (!arguments.length) return defined;
      defined = _;
      return chart;
    };

    chart.isArea = function (_) {
      if (!arguments.length) return isArea;
      isArea = d3.functor(_);
      return chart;
    };

    //============================================================


    return chart;
  };


  nv.models.radarChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var lines = nv.models.radar(),
        xAxis = nv.models.axis(),
        yAxis = nv.models.axis(),
        legend = nv.models.legend(),
        interactiveLayer = nv.interactiveGuideline();

    var margin = { top: 30, right: 20, bottom: 50, left: 60 },
        color = nv.utils.defaultColor(),
        width = null,
        height = null,
        showLegend = true,
        showXAxis = false,
        showYAxis = false,
        rightAlignYAxis = false,
        useInteractiveGuideline = false,
        tooltips = true,
        tooltip = function (key, x, y, e, graph) {
      return "<h3>" + key + "</h3>" + "<p>" + y + " at " + x + "</p>";
    },
        x,
        y,
        state = {},
        defaultState = null,
        noData = "No Data Available.",
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState"),
        transitionDuration = 250,
        tickCount = 5,
        tooltipShift = { x: 0, y: 0 };

    xAxis.orient("bottom").tickPadding(7);
    yAxis.orient(rightAlignYAxis ? "right" : "left");

    //============================================================
    function getOffset(elem) {
      if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem);
      } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem);
      }
    }

    function getOffsetSum(elem) {
      var top = 0,
          left = 0;
      while (elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
      }

      return { top: top, left: left };
    }

    function getOffsetRect(elem) {
      // (1)
      var box = elem.getBoundingClientRect();

      // (2)
      var body = document.body;
      var docElem = document.documentElement;

      // (3)
      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      // (4)
      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      // (5)
      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
    }


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var showTooltip = function (e, offsetElement) {
      // console.log(e);
      var left = e.event.pageX,

      //pos[0],
      top = e.event.pageY,

      //pos[1],
      x = xAxis.tickFormat()(lines.x()(e.point, e.pointIndex)),
          y = yAxis.tickFormat()(lines.y()(e.point, e.pointIndex)),
          content = tooltip(e.series.key, x, y, e, chart);
      // console.log(left, top, tooltipShift);
      nv.tooltip.show([left /* + tooltipShift.x*/, top /*+ tooltipShift.y*/], content, null, null, offsetElement, "xy-tooltip with-3d-shadow with-transitions");
    };

    //============================================================


    function chart(selection) {
      selection.each(function (data) {

        convertDateTime(data);

        var container = d3.select(this),
            that = this;
            // console.log(container)

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;


        chart.update = function () {
          container.transition().duration(transitionDuration).call(chart);
        };
        chart.container = this;

        //set state.disabled
        state.disabled = data.map(function (d) {
          return !!d.disabled;
        });


        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display noData message if there's nothing to show.

        if (!data || !data.length || !data.filter(function (d) {
          return d.values.length;
        }).length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup Scales

        x = lines.xScale();
        y = lines.yScale();

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart
        // console.log(this)
        // console.log(container.selectAll("g.nv-wrap.nv-lineChart"))
        var wrap = container.selectAll("g.nv-wrap.nv-lineChart").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-lineChart").append("g");
        var g = wrap.select("g");

        gEnter.append("rect").style("opacity", 0);
        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "nv-y nv-axis");
        gEnter.append("g").attr("class", "nv-linesWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");
        gEnter.append("g").attr("class", "nv-interactive");


        g.select("rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);
        //------------------------------------------------------------
        // Legend

         showLegend = showLegend && data.length > 1;


        if (showLegend) {
          legend.width(availableWidth);

          var temp = g.select(".nv-legendWrap").datum(data)
          // console.log("RADAR gEnter.select(\".nv-legendWrap\").datum(data)",temp)
          temp.call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height() + 5;
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        }

        //------------------------------------------------------------

        var ml = margin.left;
        wrap.attr("transform", "translate(" + ml + "," + margin.top + ")");

        if (rightAlignYAxis) {
          g.select(".nv-y.nv-axis").attr("transform", "translate(" + availableWidth + ",0)");
        }

        //------------------------------------------------------------
        // Main Chart Component(s)


        //------------------------------------------------------------
        //Set up interactive layer
        if (useInteractiveGuideline) {
          interactiveLayer.width(availableWidth).height(availableHeight).margin({ left: margin.left, top: margin.top }).svgContainer(container).xScale(x);
          wrap.select(".nv-interactive").call(interactiveLayer);
        }


        var radius = Math.min(availableWidth, availableHeight);
        tooltipShift.x = this.offsetLeft + availableWidth / 2 - radius / 2;
        tooltipShift.y = getOffset(this).top + margin.top + 10;


        lines.width(radius).height(radius).color(data.map(function (d, i) {
          return d.color || color(d, i);
        }).filter(function (d, i) {
          return !data[i].disabled;
        }));


        var linesWrap = g.select(".nv-linesWrap").datum(data.filter(function (d,i) {
          // console.log( "linesWrap",i,d)
          return !d.disabled;
        }));


        linesWrap.transition().call(lines);


        var lws = availableWidth / 2 - radius / 2;
        linesWrap.attr("transform", "translate(" + lws + ",0)");

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup Axes

        if (showXAxis) {
          xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);

          g.select(".nv-x.nv-axis").attr("transform", "translate(0," + y.range()[0] + ")");
          g.select(".nv-x.nv-axis").transition().call(xAxis);
        }

        if (showYAxis) {
          yAxis.scale(y).ticks(availableHeight / 36).tickSize(-availableWidth, 0);

          g.select(".nv-y.nv-axis").transition().call(yAxis);
        }
        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        legend.dispatch.on("stateChange", function (newState) {
          // console.log("state change legent event", newState)
          state = newState;
          // dispatch.changeState(state);
          data.forEach(function (series, i) {
              series.disabled = state.disabled[i];
            });

          chart.update();
        });

        interactiveLayer.dispatch.on("elementMousemove", function (e) {
          lines.clearHighlights();
          var singlePoint,
              pointIndex,
              pointXLocation,
              allData = [];
          data.filter(function (series, i) {
            series.seriesIndex = i;
            return !series.disabled;
          }).forEach(function (series, i) {
            pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
            lines.highlightPoint(i, pointIndex, true);
            var point = series.values[pointIndex];
            if (typeof point === "undefined") return;
            if (typeof singlePoint === "undefined") singlePoint = point;
            if (typeof pointXLocation === "undefined") pointXLocation = chart.xScale()(chart.x()(point, pointIndex));
            allData.push({
              key: series.key,
              value: chart.y()(point, pointIndex),
              color: color(series, series.seriesIndex)
            });
          });
          //Highlight the tooltip entry based on which point the mouse is closest to.
          if (allData.length > 2) {
            var yValue = chart.yScale().invert(e.mouseY);
            var domainExtent = Math.abs(chart.yScale().domain()[0] - chart.yScale().domain()[1]);
            var threshold = 0.03 * domainExtent;
            var indexToHighlight = nv.nearestValueIndex(allData.map(function (d) {
              return d.value;
            }), yValue, threshold);
            if (indexToHighlight !== null) allData[indexToHighlight].highlight = true;
          }

          var xValue = xAxis.tickFormat()(chart.x()(singlePoint, pointIndex));
          interactiveLayer.tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top }).chartContainer(that.parentNode).enabled(tooltips).valueFormatter(function (d, i) {
            return new Number(yAxis.tickFormat()(d)).toFixed(2);
          }).data({
            value: xValue,
            series: allData
          })();

          interactiveLayer.renderGuideLine(pointXLocation);
        });

        interactiveLayer.dispatch.on("elementMouseout", function (e) {
          dispatch.tooltipHide();
          lines.clearHighlights();
        });

        dispatch.on("tooltipShow", function (e) {
          if (tooltips) {
            showTooltip(e);
          }
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

        //============================================================
      });

      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    lines.dispatch.on("elementMouseover.tooltip", function (e) {
      dispatch.tooltipShow(e);
    });

    lines.dispatch.on("elementMouseout.tooltip", function (e) {
      dispatch.tooltipHide(e);
    });

    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.dispatch = dispatch;
    chart.lines = lines;
    chart.legend = legend;
    chart.xAxis = xAxis;
    chart.yAxis = yAxis;
    chart.interactiveLayer = interactiveLayer;

    d3.rebind(
      chart, 
      lines, 
      "defined", 
      "isArea", 
      "x", 
      "y", 
      "size", 
      "xScale", 
      "yScale", 
      "xDomain", 
      "yDomain", 
      "xRange", 
      "yRange", 
      "forceX", 
      "forceY", 
      "interactive", 
      "clipEdge", 
      "clipVoronoi", 
      "useVoronoi", 
      "id", 
      "interpolate");

    chart.options = nv.utils.optionsFunc.bind(chart);

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
      legend.color(color);
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.showXAxis = function (_) {
      if (!arguments.length) return showXAxis;
      showXAxis = _;
      return chart;
    };

    chart.showYAxis = function (_) {
      if (!arguments.length) return showYAxis;
      showYAxis = _;
      return chart;
    };

    chart.rightAlignYAxis = function (_) {
      if (!arguments.length) return rightAlignYAxis;
      rightAlignYAxis = _;
      yAxis.orient(_ ? "right" : "left");
      return chart;
    };

    chart.useInteractiveGuideline = function (_) {
      if (!arguments.length) return useInteractiveGuideline;
      useInteractiveGuideline = _;
      if (_ === true) {
        chart.interactive(false);
        chart.useVoronoi(false);
      }
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    chart.transitionDuration = function (_) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = _;
      return chart;
    };

    //============================================================

    //chart.update();

    return chart;
  };


  nv.models.line = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var scatter = nv.models.scatter();

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 960,
        height = 500,
        color = nv.utils.defaultColor() // a function that returns a color
       
    ,
        getX = function (d, i) {
      return d.x;
    } // accessor to get the x value from a data point
    ,
        getY = function (d, i) {
      return d.y;
    } // accessor to get the y value from a data point
    ,
        getLabel = undefined //function(d) { return d.y }
    ,
        defined = function (d, i) {
      return !isNaN(getY(d, i)) && getY(d, i) !== null;
    } // allows a line to be not continuous when it is not defined
    ,
        isArea = function (d) {
      return d.area;
    } // decides if a line is an area or just a line
    ,
        clipEdge = false // if true, masks lines within x and y scale
    ,
        x //can be accessed via chart.xScale()
    ,
        y //can be accessed via chart.yScale()
    ,
        interpolate = "linear" // controls the line interpolation
    ;

    scatter.size(16) // default size
    .sizeDomain([16, 256]);

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var x0, y0 //used to store previous scales
    ;

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            container = d3.select(this);

        //------------------------------------------------------------
        // Setup Scales

        x = scatter.xScale();
        y = scatter.yScale();

        x0 = x0 || x;
        y0 = y0 || y;

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-line").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-line");
        var defsEnter = wrapEnter.append("defs");
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-groups");
        gEnter.append("g").attr("class", "nv-scatterWrap");
        var mt = margin.top + 10;
        wrap.attr("transform", "translate(" + margin.left + "," + mt + ")");

        //------------------------------------------------------------


        scatter.width(availableWidth).height(availableHeight);

        var scatterWrap = wrap.select(".nv-scatterWrap");
        //.datum(data); // Data automatically trickles down from the wrap

        scatterWrap.transition().call(scatter);


        defsEnter.append("clipPath").attr("id", "nv-edge-clip-" + scatter.id()).append("rect");

        wrap.select("#nv-edge-clip-" + scatter.id() + " rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);

        g.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");
        scatterWrap.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + scatter.id() + ")" : "");


        var groups = wrap.select(".nv-groups").selectAll(".nv-group").data(function (d) {
          return d;
        }, function (d) {
          return d.key;
        });
        groups.enter().append("g").style("stroke-opacity", 0.000001).style("fill-opacity", 0.000001);

        groups.exit().remove();

        groups.attr("class", function (d, i) {
          return "nv-group nv-series-" + i;
        }).classed("hover", function (d) {
          return d.hover;
        }).style("fill", function (d, i) {
          return color(d, i);
        }).style("stroke", function (d, i) {
          return color(d, i);
        });
        groups.transition().style("stroke-opacity", 1).style("fill-opacity", 0.5);


        var areaPaths = groups.selectAll("path.nv-area").data(function (d) {
          return isArea(d) ? [d] : [];
        }); // this is done differently than lines because I need to check if series is an area
        areaPaths.enter().append("path").attr("class", "nv-area").attr("d", function (d) {
          return d3.svg.area().interpolate(interpolate).defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x0(getX(d, i)));
          }).y0(function (d, i) {
            return nv.utils.NaNtoZero(y0(getY(d, i)));
          }).y1(function (d, i) {
            return y0(y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0]);
          })
          //.y1(function(d,i) { return y0(0) }) //assuming 0 is within y domain.. may need to tweak this
          .apply(this, [d.values]);
        });
        groups.exit().selectAll("path.nv-area").remove();

        areaPaths.transition().attr("d", function (d) {
          return d3.svg.area().interpolate(interpolate).defined(defined).x(function (d, i) {
            return nv.utils.NaNtoZero(x(getX(d, i)));
          }).y0(function (d, i) {
            return nv.utils.NaNtoZero(y(getY(d, i)));
          }).y1(function (d, i) {
            return y(y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0]);
          })
          //.y1(function(d,i) { return y0(0) }) //assuming 0 is within y domain.. may need to tweak this
          .apply(this, [d.values]);
        });


        var linePaths = groups.selectAll("path.nv-line").data(function (d) {
          return [d.values];
        });
        linePaths.enter().append("path").attr("class", "nv-line").attr("d", d3.svg.line().interpolate(interpolate).defined(defined).x(function (d, i) {
          return nv.utils.NaNtoZero(x0(getX(d, i)));
        }).y(function (d, i) {
          return nv.utils.NaNtoZero(y0(getY(d, i)));
        }));

        linePaths.transition().attr("d", d3.svg.line().interpolate(interpolate).defined(defined).x(function (d, i) {
          return nv.utils.NaNtoZero(x(getX(d, i)));
        }).y(function (d, i) {
          return nv.utils.NaNtoZero(y(getY(d, i)));
        }));


        //store old scales for use in transitions on update
        x0 = x.copy();
        y0 = y.copy();
      });

      return chart;
    }


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = scatter.dispatch;
    chart.scatter = scatter;

    d3.rebind(chart, scatter, "id", "interactive", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "forceX", "forceY", "forceSize", "clipVoronoi", "useVoronoi", "clipRadius", "padData", "highlightPoint", "clearHighlights");

    chart.options = nv.utils.optionsFunc.bind(chart);

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

    chart.x = function (_) {
      if (!arguments.length) return getX;
      getX = _;
      scatter.x(_);
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = _;
      scatter.y(_);
      return chart;
    };

    chart.label = function (_) {
      //console.log("chart label",_)
      if (!arguments.length) return getLabel;
      getLabel = _;
      scatter.label(_);
      return chart;
    };

    



    chart.clipEdge = function (_) {
      if (!arguments.length) return clipEdge;
      clipEdge = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      scatter.color(color);
      return chart;
    };

    chart.interpolate = function (_) {
      if (!arguments.length) return interpolate;
      interpolate = _;
      return chart;
    };

    chart.defined = function (_) {
      if (!arguments.length) return defined;
      defined = _;
      return chart;
    };

    chart.isArea = function (_) {
      if (!arguments.length) return isArea;
      isArea = d3.functor(_);
      return chart;
    };

    //============================================================


    return chart;
  };


  nv.models.lineChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var lines = nv.models.line(),
        xAxis = nv.models.axis(),
        yAxis = nv.models.axis(),
        legend = nv.models.legend(),
        interactiveLayer = nv.interactiveGuideline();

    var margin = { top: 30, right: 20, bottom: 50, left: 60 },
        color = nv.utils.defaultColor(),
        width = null,
        height = null,
        showLegend = true,
        showXAxis = true,
        showYAxis = true,
        rightAlignYAxis = false,
        useInteractiveGuideline = false,
        label = function(d,i){return d.label},
        tooltips = true,
        tooltip = function (key, x, y, e, graph) {
      return "<h3>" + key + "</h3>" + "<p>" + y + " at " + x + "</p>";
    },
        x,
        y,
        state = {},
        defaultState = null,
        noData = "No Data Available.",
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState"),
        transitionDuration = 250;

    xAxis.orient("bottom").tickPadding(7);
    yAxis.orient(rightAlignYAxis ? "right" : "left");

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var showTooltip = function (e, offsetElement) {
      var left = e.pos[0] + (offsetElement.offsetLeft || 0),
          top = e.pos[1] + (offsetElement.offsetTop || 0),
          x = xAxis.tickFormat()(lines.x()(e.point, e.pointIndex)),
          y = yAxis.tickFormat()(lines.y()(e.point, e.pointIndex)),
          content = tooltip(e.series.key, x, y, e, chart);
          // console.log(e)
      nv.tooltip.show([left, top], content, null, null, offsetElement);
    };

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        // console.log("ScatterSerie",data)
        // console.log("scatter", lines.scatter)

        var container = d3.select(this),
            that = this;

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;


        chart.update = function () {
          container.transition().duration(transitionDuration).call(chart);
        };
        chart.container = this;

        //set state.disabled
        state.disabled = data.map(function (d) {
          return !!d.disabled;
        });


        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display noData message if there's nothing to show.

        if (!data || !data.length || !data.filter(function (d) {
          return d.values.length;
        }).length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------

          if(data[0].axisX.role == "time"){
            data.forEach(function(serie){
              serie.values.forEach(function(value){
                value.x = new Date(value.x)
              })
            })
            // console.log("Time format", data)
          }  

        //------------------------------------------------------------
        // Setup Scales
        if(data[0].axisX.role == "time"){
          x = d3.time.scale();
          x.domain([data[0].values[0].x,data[0].values[data[0].values.length-1].x])
          x.range([0, availableWidth])  
          lines.xScale(x);
        }else{
          x = lines.xScale();
        }

        y = lines.yScale();

        //------------------------------------------------------------




        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-lineChart").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-lineChart").append("g");
        var g = wrap.select("g");

        gEnter.append("rect").style("opacity", 0);
        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "nv-y nv-axis");
        gEnter.append("g").attr("class", "nv-linesWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");
        gEnter.append("g").attr("class", "nv-interactive");

        g.select("rect").attr("width", availableWidth).attr("height", availableHeight > 0 ? availableHeight : 0);
        //------------------------------------------------------------
        // Legend
        
        showLegend = showLegend && data.length > 1;

        if (showLegend) {
          legend.width(availableWidth);

          g.select(".nv-legendWrap").datum(data).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        }

        //------------------------------------------------------------

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (rightAlignYAxis) {
          g.select(".nv-y.nv-axis").attr("transform", "translate(" + availableWidth + ",0)");
        }

        //------------------------------------------------------------
        // Main Chart Component(s)


        //------------------------------------------------------------
        //Set up interactive layer
        if (useInteractiveGuideline) {
          interactiveLayer.width(availableWidth).height(availableHeight).margin({ left: margin.left, top: margin.top }).svgContainer(container).xScale(x);
          wrap.select(".nv-interactive").call(interactiveLayer);
        }


        lines.width(availableWidth).height(availableHeight).color(data.map(function (d, i) {
          return d.color || color(d, i);
        }).filter(function (d, i) {
          return !data[i].disabled;
        }));


        var linesWrap = g.select(".nv-linesWrap").datum(data.filter(function (d) {
          return !d.disabled;
        }));

        linesWrap.transition().call(lines);

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup Axes

          if (showXAxis) {
            if(data[0].axisX.role == "time"){
                xAxis.tickFormat(customTimeFormat);
          }
          // else{
          
            xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);
          // }

          // console.log("AXIS LINE ", xAxis.ticks(), xAxis.tickFormat())

          g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (y.range()[0] + 10) + ")");
          g.select(".nv-x.nv-axis").transition().call(xAxis);
        }

        if (showYAxis) {
          yAxis.scale(y).ticks(availableHeight / 36).tickSize(-availableWidth, 0);

          g.select(".nv-y.nv-axis").attr("transform", "translate(0," + 10 + ")").transition().call(yAxis);
        }
        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        legend.dispatch.on("stateChange", function (newState) {
          state = newState;
          dispatch.stateChange(state);
          chart.update();
        });

        interactiveLayer.dispatch.on("elementMousemove", function (e) {
          lines.clearHighlights();
          var singlePoint,
              pointIndex,
              pointXLocation,
              allData = [];
          data.filter(function (series, i) {
            series.seriesIndex = i;
            return !series.disabled;
          }).forEach(function (series, i) {
            pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
            lines.highlightPoint(i, pointIndex, true);
            var point = series.values[pointIndex];
            if (typeof point === "undefined") return;
            if (typeof singlePoint === "undefined") singlePoint = point;
            if (typeof pointXLocation === "undefined") pointXLocation = chart.xScale()(chart.x()(point, pointIndex));
            allData.push({
              key: series.key,
              value: chart.y()(point, pointIndex),
              color: color(series, series.seriesIndex)
            });
          });
          //Highlight the tooltip entry based on which point the mouse is closest to.
          if (allData.length > 2) {
            var yValue = chart.yScale().invert(e.mouseY);
            var domainExtent = Math.abs(chart.yScale().domain()[0] - chart.yScale().domain()[1]);
            var threshold = 0.03 * domainExtent;
            var indexToHighlight = nv.nearestValueIndex(allData.map(function (d) {
              return d.value;
            }), yValue, threshold);
            if (indexToHighlight !== null) allData[indexToHighlight].highlight = true;
          }

          var xValue = xAxis.tickFormat()(chart.x()(singlePoint, pointIndex));
          // ,
          //   label : chart.label()(singlePoint, pointIndex)
          // };
          interactiveLayer
            .tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top })
            .chartContainer(that.parentNode)
            .enabled(tooltips)
            .valueFormatter(function (d, i) {
              // console.log("VAlue Formatter", d,i)
              return yAxis.tickFormat()(d);
            })
            .headerFormatter(function(d){
              return d;
              // console.log("Header Formatter", d,i)
              // var v = xAxis.tickFormat()(d);
              // if(new Number((v).toFixed(0)) == v){
              //   v = new Number(v.toFixed(0));
              //   return v//d.label
              // }else{
              //   return v.toFixed(2)
              // }
               // v = (new Number((v).toFixed(0)) == v) ? v.toFixed(0) : v.toFixed(2);
               // return v;
              // return (xAxis.tickFormat()(d)).toFixed(2);
            })
            .data({
              value: xValue,
              series: allData
            })();

          interactiveLayer.renderGuideLine(pointXLocation);
        });

        interactiveLayer.dispatch.on("elementMouseout", function (e) {
          dispatch.tooltipHide();
          lines.clearHighlights();
        });

        dispatch.on("tooltipShow", function (e) {
          // console.log(" dispath tooltipShow",tooltips,e)
          if (tooltips) showTooltip(e, that.parentNode);
        });


        dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined" && data.length === e.disabled.length) {
            data.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          chart.update();
        });

        //============================================================
      });

      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    lines.dispatch.on("elementMouseover.tooltip", function (e) {
      e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
      dispatch.tooltipShow(e);
    });

    lines.dispatch.on("elementMouseout.tooltip", function (e) {
      dispatch.tooltipHide(e);
    });

    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.dispatch = dispatch;
    chart.lines = lines;
    chart.legend = legend;
    chart.xAxis = xAxis;
    chart.yAxis = yAxis;
    chart.interactiveLayer = interactiveLayer;
    chart.label = label;

    d3.rebind(chart, lines, "defined", "isArea", "x", "y", "size", "xScale", "yScale", "xDomain", "yDomain", "xRange", "yRange", "forceX", "forceY", "interactive", "clipEdge", "clipVoronoi", "useVoronoi", "id", "interpolate","label");

    chart.options = nv.utils.optionsFunc.bind(chart);

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
      legend.color(color);
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.showPoints = function (_) {
      
      if (!arguments.length) return lines.scatter.showPoints;
     lines.scatter.showPoints(_);
      return chart;
    }; 

    chart.showXAxis = function (_) {
      if (!arguments.length) return showXAxis;
      showXAxis = _;
      return chart;
    };

    chart.showYAxis = function (_) {
      if (!arguments.length) return showYAxis;
      showYAxis = _;
      return chart;
    };

    // chart.showPoints = function (_) {
    //   if (!arguments.length) return line.showPoints;
    //   line.showPoins(_);
    //   return chart;
    // };

    chart.rightAlignYAxis = function (_) {
      if (!arguments.length) return rightAlignYAxis;
      rightAlignYAxis = _;
      yAxis.orient(_ ? "right" : "left");
      return chart;
    };

    chart.useInteractiveGuideline = function (_) {
      if (!arguments.length) return useInteractiveGuideline;
      useInteractiveGuideline = _;
      if (_ === true) {
        chart.interactive(false);
        chart.useVoronoi(false);
      }
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    chart.transitionDuration = function (_) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = _;
      return chart;
    };

    //============================================================


    return chart;
  };


  nv.models.stackedArea = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 960,
        height = 500,
        color = nv.utils.defaultColor() // a function that computes the color
    ,
        id = Math.floor(Math.random() * 100000) //Create semi-unique ID incase user doesn't selet one
    ,
        getX = function (d) {
      return d.x;
    } // accessor to get the x value from a data point
    ,
        getY = function (d) {
      return d.y;
    } // accessor to get the y value from a data point
    ,
        getLabel = undefined,
        style = "stack",
        offset = "zero",
        order = "default",
        interpolate = "linear" // controls the line interpolation
    ,
        clipEdge = false // if true, masks lines within x and y scale
    ,
        x //can be accessed via chart.xScale()
    ,
        y //can be accessed via chart.yScale()
    ,
        scatter = nv.models.scatter(),
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "areaClick", "areaMouseover", "areaMouseout");

    scatter.size(2.2) // default size
    .sizeDomain([2.2, 2.2]);

    /************************************
     * offset:
     *   'wiggle' (stream)
     *   'zero' (stacked)
     *   'expand' (normalize to 100%)
     *   'silhouette' (simple centered)
     *
     * order:
     *   'inside-out' (stream)
     *   'default' (input order)
     ************************************/

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            container = d3.select(this);

        //------------------------------------------------------------
        // Setup Scales

        x = scatter.xScale();
        y = scatter.yScale();

        //------------------------------------------------------------

        var dataRaw = data;
        // Injecting point index into each point because d3.layout.stack().out does not give index
        data.forEach(function (aseries, i) {
          aseries.seriesIndex = i;
          aseries.values = aseries.values.map(function (d, j) {
            d.index = j;
            d.seriesIndex = i;
            return d;
          });
        });

        var dataFiltered = data.filter(function (series) {
          return !series.disabled;
        });

        data = d3.layout.stack().order(order).offset(offset).values(function (d) {
          return d.values;
        }) //TODO: make values customizeable in EVERY model in this fashion
        .x(getX).y(getY).out(function (d, y0, y) {
          var yHeight = getY(d) === 0 ? 0 : y;
          d.display = {
            y: yHeight,
            y0: y0
          };
        })(dataFiltered);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-stackedarea").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-stackedarea");
        var defsEnter = wrapEnter.append("defs");
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-areaWrap");
        gEnter.append("g").attr("class", "nv-scatterWrap");

        wrap.attr("transform", "translate(" + margin.left + "," + (margin.top + 10) + ")");

        //------------------------------------------------------------


        scatter.width(availableWidth).height(availableHeight).x(getX).y(function (d) {
          return d.display.y + d.display.y0;
        }).forceY([0]).color(data.map(function (d, i) {
          return d.color || color(d, d.seriesIndex);
        }));


        var scatterWrap = g.select(".nv-scatterWrap").datum(data);

        scatterWrap.call(scatter);

        defsEnter.append("clipPath").attr("id", "nv-edge-clip-" + id).append("rect");

        wrap.select("#nv-edge-clip-" + id + " rect").attr("width", availableWidth).attr("height", availableHeight);

        g.attr("clip-path", clipEdge ? "url(#nv-edge-clip-" + id + ")" : "");

        var area = d3.svg.area().x(function (d, i) {
          return x(getX(d, i));
        }).y0(function (d) {
          return y(d.display.y0);
        }).y1(function (d) {
          return y(d.display.y + d.display.y0);
        }).interpolate(interpolate);

        var zeroArea = d3.svg.area().x(function (d, i) {
          return x(getX(d, i));
        }).y0(function (d) {
          return y(d.display.y0);
        }).y1(function (d) {
          return y(d.display.y0);
        });


        var path = g.select(".nv-areaWrap").selectAll("path.nv-area").data(function (d) {
          return d;
        });

        path.enter().append("path").attr("class", function (d, i) {
          return "nv-area nv-area-" + i;
        }).attr("d", function (d, i) {
          return zeroArea(d.values, d.seriesIndex);
        }).on("mouseover", function (d, i) {
          d3.select(this).classed("hover", true);
          dispatch.areaMouseover({
            point: d,
            series: d.key,
            pos: [d3.event.pageX, d3.event.pageY],
            seriesIndex: d.seriesIndex
          });
        }).on("mouseout", function (d, i) {
          d3.select(this).classed("hover", false);
          dispatch.areaMouseout({
            point: d,
            series: d.key,
            pos: [d3.event.pageX, d3.event.pageY],
            seriesIndex: d.seriesIndex
          });
        }).on("click", function (d, i) {
          d3.select(this).classed("hover", false);
          dispatch.areaClick({
            point: d,
            series: d.key,
            pos: [d3.event.pageX, d3.event.pageY],
            seriesIndex: d.seriesIndex
          });
        });

        path.exit().remove();

        path.style("fill", function (d, i) {
          return d.color || color(d, d.seriesIndex);
        }).style("stroke", function (d, i) {
          return d.color || color(d, d.seriesIndex);
        });
        path.transition().attr("d", function (d, i) {
          return area(d.values, i);
        });


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        scatter.dispatch.on("elementMouseover.area", function (e) {
          g.select(".nv-chart-" + id + " .nv-area-" + e.seriesIndex).classed("hover", true);
        });
        scatter.dispatch.on("elementMouseout.area", function (e) {
          g.select(".nv-chart-" + id + " .nv-area-" + e.seriesIndex).classed("hover", false);
        });

        //============================================================
        //Special offset functions
        chart.d3_stackedOffset_stackPercent = function (stackData) {
          var n = stackData.length,




          //How many series
          m = stackData[0].length,




          //how many points per series
          k = 1 / n,
              i,
              j,
              o,
              y0 = [];

          for (j = 0; j < m; ++j) {
            //Looping through all points
            for (i = 0, o = 0; i < dataRaw.length; i++) //looping through series'
            o += getY(dataRaw[i].values[j]); //total value of all points at a certian point in time.

            if (o) for (i = 0; i < n; i++) stackData[i][j][1] /= o;else for (i = 0; i < n; i++) stackData[i][j][1] = k;
          }
          for (j = 0; j < m; ++j) y0[j] = 0;
          return y0;
        };
      });


      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    scatter.dispatch.on("elementClick.area", function (e) {
      dispatch.areaClick(e);
    });
    scatter.dispatch.on("elementMouseover.tooltip", function (e) {
      e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top], dispatch.tooltipShow(e);
    });
    scatter.dispatch.on("elementMouseout.tooltip", function (e) {
      dispatch.tooltipHide(e);
    });

    //============================================================

    //============================================================
    // Global getters and setters
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.scatter = scatter;

    d3.rebind(chart, scatter, "interactive", "size", "xScale", "yScale", "zScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "forceX", "forceY", "forceSize", "clipVoronoi", "useVoronoi", "clipRadius", "highlightPoint", "clearHighlights");

    chart.options = nv.utils.optionsFunc.bind(chart);

    chart.x = function (_) {
      if (!arguments.length) return getX;
      getX = d3.functor(_);
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = d3.functor(_);
      return chart;
    };

    chart.label = function (_) {
      //console.log("stacked Area label",_)
      if (!arguments.length) return getLabel;
      getLabel = _;
      scatter.label(_);
      return chart;
    };

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

    chart.clipEdge = function (_) {
      if (!arguments.length) return clipEdge;
      clipEdge = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      return chart;
    };

    chart.offset = function (_) {
      if (!arguments.length) return offset;
      offset = _;
      return chart;
    };

    chart.order = function (_) {
      if (!arguments.length) return order;
      order = _;
      return chart;
    };

    //shortcut for offset + order
    chart.style = function (_) {
      if (!arguments.length) return style;
      style = _;

      switch (style) {
        case "stack":
          chart.offset("zero");
          chart.order("default");
          break;
        case "stream":
          chart.offset("wiggle");
          chart.order("inside-out");
          break;
        case "stream-center":
          chart.offset("silhouette");
          chart.order("inside-out");
          break;
        case "expand":
          chart.offset("expand");
          chart.order("default");
          break;
        case "stack_percent":
          chart.offset(chart.d3_stackedOffset_stackPercent);
          chart.order("default");
          break;
      }

      return chart;
    };

    chart.interpolate = function (_) {
      if (!arguments.length) return interpolate;
      interpolate = _;
      return chart;
    };
    //============================================================


    return chart;
  };


  // nv.models.stackedAreaChart = function () {
  //   "use strict";
  //   //============================================================
  //   // Public Variables with Default Settings
  //   //------------------------------------------------------------

  //   var stacked = nv.models.stackedArea(),
  //       xAxis = nv.models.axis(),
  //       yAxis = nv.models.axis(),
  //       legend = nv.models.legend(),
  //       controls = nv.models.legend(),
  //       interactiveLayer = nv.interactiveGuideline();

  //   var margin = { top: 30, right: 25, bottom: 50, left: 60 },
  //       width = null,
  //       height = null,
  //       color = nv.utils.defaultColor() // a function that takes in d, i and returns color
  //   ,
  //       showControls = true,
  //       showLegend = true,
  //       showXAxis = true,
  //       showYAxis = true,
  //       rightAlignYAxis = false,
  //       useInteractiveGuideline = false,
  //       tooltips = true,
  //       tooltip = function (key, x, y, e, graph) {
  //     return "<h3>" + key + "</h3>" + "<p>" + y + " on " + x + "</p>";
  //   },
  //       x //can be accessed via chart.xScale()
  //   ,
  //       y //can be accessed via chart.yScale()
  //   ,
  //       yAxisTickFormat = d3.format(".2f"),
  //       state = { style: stacked.style() },
  //       defaultState = null,
  //       noData = "No Data Available.",
  //       dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState"),
  //       controlWidth = 250,
  //       cData = ["Stacked", "Stream", "Expanded"],
  //       controlLabels = {},
  //       transitionDuration = 250;

  //   xAxis.orient("bottom").tickPadding(7);
  //   yAxis.orient(rightAlignYAxis ? "right" : "left");

  //   controls.updateState(false);
  //   //============================================================


  //   //============================================================
  //   // Private Variables
  //   //------------------------------------------------------------

  //   var showTooltip = function (e, offsetElement) {
  //     var left = e.pos[0] + (offsetElement.offsetLeft || 0),
  //         top = e.pos[1] + (offsetElement.offsetTop || 0),
  //         x = xAxis.tickFormat()(stacked.x()(e.point, e.pointIndex)),
  //         y = yAxis.tickFormat()(stacked.y()(e.point, e.pointIndex)),
  //         content = tooltip(e.series.key, x, y, e, chart);

  //     nv.tooltip.show([left, top], content, e.value < 0 ? "n" : "s", null, offsetElement);
  //   };

  //   //============================================================


  //   function chart(selection) {
  //     selection.each(function (data) {
  //       var container = d3.select(this),
  //           that = this;

  //       var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
  //           availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

  //       chart.update = function () {
  //         container.transition().duration(transitionDuration).call(chart);
  //       };
  //       chart.container = this;

  //       //set state.disabled
  //       state.disabled = data.map(function (d) {
  //         return !!d.disabled;
  //       });

  //       if (!defaultState) {
  //         var key;
  //         defaultState = {};
  //         for (key in state) {
  //           if (state[key] instanceof Array) 
  //               defaultState[key] = state[key].slice(0);
  //           else 
  //               defaultState[key] = state[key];
  //         }
  //       }

  //       //------------------------------------------------------------
  //       // Display No Data message if there's nothing to show.

  //       if (!data || !data.length || !data.filter(function (d) {
  //         return d.values.length;
  //       }).length) {
  //         var noDataText = container.selectAll(".nv-noData").data([noData]);

  //         noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

  //         noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
  //           return d;
  //         });

  //         return chart;
  //       } else {
  //         container.selectAll(".nv-noData").remove();
  //       }

  //       //------------------------------------------------------------


  //       //------------------------------------------------------------
  //       // Setup Scales

  //       x = stacked.xScale();
  //       y = stacked.yScale();

  //       //------------------------------------------------------------


  //       //------------------------------------------------------------
  //       // Setup containers and skeleton of chart

  //       var wrap = container.selectAll("g.nv-wrap.nv-stackedAreaChart").data([data]);
  //       var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-stackedAreaChart").append("g");
  //       var g = wrap.select("g");

  //       gEnter.append("rect").style("opacity", 0);
  //       gEnter.append("g").attr("class", "nv-x nv-axis");
  //       gEnter.append("g").attr("class", "nv-y nv-axis");
  //       gEnter.append("g").attr("class", "nv-stackedWrap");
  //       gEnter.append("g").attr("class", "nv-legendWrap");
  //       gEnter.append("g").attr("class", "nv-controlsWrap");
  //       gEnter.append("g").attr("class", "nv-interactive");

  //       g.select("rect").attr("width", availableWidth).attr("height", availableHeight);
  //       //------------------------------------------------------------
  //       // Legend
        
  //        showLegend = showLegend && data.length > 1;


  //       if (showLegend) {
  //         var legendWidth = showControls ? availableWidth - controlWidth : availableWidth;
  //         legend.width(legendWidth);

  //         g.select(".nv-legendWrap").datum(data).call(legend);

  //         if (margin.top != legend.height()) {
  //           margin.top = legend.height();
  //           availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
  //         }

  //         g.select(".nv-legendWrap").attr("transform", "translate(" + (availableWidth - legendWidth) + "," + -margin.top + ")");
  //       }

  //       //------------------------------------------------------------


  //       //------------------------------------------------------------
  //       // Controls

  //       if (showControls) {
  //         var controlsData = [{
  //           key: controlLabels.stacked || "Stacked",
  //           metaKey: "Stacked",
  //           disabled: stacked.style() != "stack",
  //           style: "stack"
  //         }, {
  //           key: controlLabels.stream || "Stream",
  //           metaKey: "Stream",
  //           disabled: stacked.style() != "stream",
  //           style: "stream"
  //         }, {
  //           key: controlLabels.expanded || "Expanded",
  //           metaKey: "Expanded",
  //           disabled: stacked.style() != "expand",
  //           style: "expand"
  //         }, {
  //           key: controlLabels.stack_percent || "Stack %",
  //           metaKey: "Stack_Percent",
  //           disabled: stacked.style() != "stack_percent",
  //           style: "stack_percent"
  //         }];

  //         controlWidth = cData.length / 3 * 260;

  //         controlsData = controlsData.filter(function (d) {
  //           return cData.indexOf(d.metaKey) !== -1;
  //         });

  //         controls.width(controlWidth).color(["#444", "#444", "#444"]);

  //         g.select(".nv-controlsWrap").datum(controlsData).call(controls);


  //         if (margin.top != Math.max(controls.height(), legend.height())) {
  //           margin.top = Math.max(controls.height(), legend.height());
  //           availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
  //         }


  //         g.select(".nv-controlsWrap").attr("transform", "translate(0," + -margin.top + ")");
  //       }

  //       //------------------------------------------------------------


  //       wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //       if (rightAlignYAxis) {
  //         g.select(".nv-y.nv-axis").attr("transform", "translate(" + availableWidth + ",0)");
  //       }

  //       //------------------------------------------------------------
  //       // Main Chart Component(s)

  //       //------------------------------------------------------------
  //       //Set up interactive layer
  //       if (useInteractiveGuideline) {
  //         interactiveLayer.width(availableWidth).height(availableHeight).margin({ left: margin.left, top: margin.top }).svgContainer(container).xScale(x);
  //         wrap.select(".nv-interactive").call(interactiveLayer);
  //       }

  //       stacked.width(availableWidth).height(availableHeight);

  //       var stackedWrap = g.select(".nv-stackedWrap").datum(data);

  //       stackedWrap.transition().call(stacked);

  //       //------------------------------------------------------------


  //       //------------------------------------------------------------
  //       // Setup Axes

  //       if (showXAxis) {
  //         xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);

  //         g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (availableHeight + 10) + ")");

  //         g.select(".nv-x.nv-axis").transition().duration(0).call(xAxis);
  //       }

  //       if (showYAxis) {
  //         yAxis.scale(y)
  //           .ticks(stacked.offset() == "wiggle" ? 0 : 
  //             availableHeight / 36).tickSize(-availableWidth, 0)
  //           // .setTickFormat(yAxisTickFormat);
  //           .setTickFormat(stacked.style() == "expand" || stacked.style() == "stack_percent" ? 
  //             d3.format("%") : yAxisTickFormat);

  //         g.select(".nv-y.nv-axis").attr("transform", "translate(0," + 10 + ")").transition().duration(0).call(yAxis);
  //       }

  //       //------------------------------------------------------------


  //       //============================================================
  //       // Event Handling/Dispatching (in chart's scope)
  //       //------------------------------------------------------------

  //       stacked.dispatch.on("areaClick.toggle", function (e) {
  //         if (data.filter(function (d) {
  //           return !d.disabled;
  //         }).length === 1) data.forEach(function (d) {
  //           d.disabled = false;
  //         });else data.forEach(function (d, i) {
  //           d.disabled = i != e.seriesIndex;
  //         });

  //         state.disabled = data.map(function (d) {
  //           return !!d.disabled;
  //         });
  //         dispatch.stateChange(state);

  //         chart.update();
  //       });

  //       legend.dispatch.on("stateChange", function (newState) {
  //         state.disabled = newState.disabled;
  //         dispatch.stateChange(state);
  //         chart.update();
  //       });

  //       controls.dispatch.on("legendClick", function (d, i) {
  //         if (!d.disabled) return;

  //         controlsData = controlsData.map(function (s) {
  //           s.disabled = true;
  //           return s;
  //         });
  //         d.disabled = false;

  //         stacked.style(d.style);


  //         state.style = stacked.style();
  //         dispatch.stateChange(state);

  //         chart.update();
  //       });


  //       interactiveLayer.dispatch.on("elementMousemove", function (e) {
  //         stacked.clearHighlights();
  //         var singlePoint,
  //             pointIndex,
  //             pointXLocation,
  //             allData = [];
  //         data.filter(function (series, i) {
  //           series.seriesIndex = i;
  //           return !series.disabled;
  //         }).forEach(function (series, i) {
  //           pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
  //           stacked.highlightPoint(i, pointIndex, true);
  //           var point = series.values[pointIndex];
  //           if (typeof point === "undefined") return;
  //           if (typeof singlePoint === "undefined") singlePoint = point;
  //           if (typeof pointXLocation === "undefined") pointXLocation = chart.xScale()(chart.x()(point, pointIndex));

  //           //If we are in 'expand' mode, use the stacked percent value instead of raw value.
  //           var tooltipValue = stacked.style() == "expand" ? point.display.y : chart.y()(point, pointIndex);
  //           allData.push({
  //             key: series.key,
  //             value: tooltipValue,
  //             color: color(series, series.seriesIndex),
  //             stackedValue: point.display
  //           });
  //         });

  //         allData.reverse();

  //         //Highlight the tooltip entry based on which stack the mouse is closest to.
  //         if (allData.length > 2) {
  //           var yValue = chart.yScale().invert(e.mouseY);
  //           var yDistMax = Infinity,
  //               indexToHighlight = null;
  //           allData.forEach(function (series, i) {
  //             //To handle situation where the stacked area chart is negative, we need to use absolute values
  //             //when checking if the mouse Y value is within the stack area.
  //             yValue = Math.abs(yValue);
  //             var stackedY0 = Math.abs(series.stackedValue.y0);
  //             var stackedY = Math.abs(series.stackedValue.y);
  //             if (yValue >= stackedY0 && yValue <= stackedY + stackedY0) {
  //               indexToHighlight = i;
  //               return;
  //             }
  //           });
  //           if (indexToHighlight != null) allData[indexToHighlight].highlight = true;
  //         }

  //         var xValue = xAxis.tickFormat()(chart.x()(singlePoint, pointIndex));

  //         //If we are in 'expand' mode, force the format to be a percentage.
  //         var valueFormatter = stacked.style() == "expand" ? function (d, i) {
  //           return d3.format(".1%")(d);
  //         } : function (d, i) {
  //           return new Number(yAxis.tickFormat()(d)).toFixed(2);
  //         };
  //         interactiveLayer.tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top }).chartContainer(that.parentNode).enabled(tooltips).valueFormatter(valueFormatter).data({
  //           value: xValue,
  //           series: allData
  //         })();

  //         interactiveLayer.renderGuideLine(pointXLocation);
  //       });

  //       interactiveLayer.dispatch.on("elementMouseout", function (e) {
  //         dispatch.tooltipHide();
  //         stacked.clearHighlights();
  //       });


  //       dispatch.on("tooltipShow", function (e) {
  //         if (tooltips) showTooltip(e, that.parentNode);
  //       });

  //       // Update chart from a state object passed to event handler
  //       dispatch.on("changeState", function (e) {
  //         if (typeof e.disabled !== "undefined" && data.length === e.disabled.length) {
  //           data.forEach(function (series, i) {
  //             series.disabled = e.disabled[i];
  //           });

  //           state.disabled = e.disabled;
  //         }

  //         if (typeof e.style !== "undefined") {
  //           stacked.style(e.style);
  //         }

  //         chart.update();
  //       });
  //     });


  //     return chart;
  //   }


  //   //============================================================
  //   // Event Handling/Dispatching (out of chart's scope)
  //   //------------------------------------------------------------

  //   stacked.dispatch.on("tooltipShow", function (e) {
  //     //disable tooltips when value ~= 0
  //     //// TODO: consider removing points from voronoi that have 0 value instead of this hack
  //     /*
  //      if (!Math.round(stacked.y()(e.point) * 100)) {  // 100 will not be good for very small numbers... will have to think about making this valu dynamic, based on data range
  //      setTimeout(function() { d3.selectAll('.point.hover').classed('hover', false) }, 0);
  //      return false;
  //      }
  //      */

  //     e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top], dispatch.tooltipShow(e);
  //   });

  //   stacked.dispatch.on("tooltipHide", function (e) {
  //     dispatch.tooltipHide(e);
  //   });

  //   dispatch.on("tooltipHide", function () {
  //     if (tooltips) nv.tooltip.cleanup();
  //   });

  //   //============================================================


  //   //============================================================
  //   // Expose Public Variables
  //   //------------------------------------------------------------

  //   // expose chart's sub-components
  //   chart.dispatch = dispatch;
  //   chart.stacked = stacked;
  //   chart.legend = legend;
  //   chart.controls = controls;
  //   chart.xAxis = xAxis;
  //   chart.yAxis = yAxis;
  //   chart.interactiveLayer = interactiveLayer;

  //   d3.rebind(chart, stacked, "x", "y", "size", "xScale", "yScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "interactive", "useVoronoi", "offset", "order", "style", "clipEdge", "forceX", "forceY", "forceSize", "interpolate");

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

  //   chart.color = function (_) {
  //     if (!arguments.length) return color;
  //     color = nv.utils.getColor(_);
  //     legend.color(color);
  //     stacked.color(color);
  //     return chart;
  //   };

  //   chart.label = function (_) {
  //     //console.log("SA CHART", _)
  //     if (!arguments.length) return stacked.label;
  //     stacked.label(_);
  //     return chart;
  //   };

  //   chart.showControls = function (_) {
  //     if (!arguments.length) return showControls;
  //     showControls = _;
  //     return chart;
  //   };

  //   chart.showLegend = function (_) {
  //     if (!arguments.length) return showLegend;
  //     showLegend = _;
  //     return chart;
  //   };

  //   chart.showXAxis = function (_) {
  //     if (!arguments.length) return showXAxis;
  //     showXAxis = _;
  //     return chart;
  //   };

  //   chart.showYAxis = function (_) {
  //     if (!arguments.length) return showYAxis;
  //     showYAxis = _;
  //     return chart;
  //   };

  //   chart.rightAlignYAxis = function (_) {
  //     if (!arguments.length) return rightAlignYAxis;
  //     rightAlignYAxis = _;
  //     yAxis.orient(_ ? "right" : "left");
  //     return chart;
  //   };

  //   chart.useInteractiveGuideline = function (_) {
  //     if (!arguments.length) return useInteractiveGuideline;
  //     useInteractiveGuideline = _;
  //     if (_ === true) {
  //       chart.interactive(false);
  //       chart.useVoronoi(false);
  //     }
  //     return chart;
  //   };

  //   chart.tooltip = function (_) {
  //     if (!arguments.length) return tooltip;
  //     tooltip = _;
  //     return chart;
  //   };

  //   chart.tooltips = function (_) {
  //     if (!arguments.length) return tooltips;
  //     tooltips = _;
  //     return chart;
  //   };

  //   chart.tooltipContent = function (_) {
  //     if (!arguments.length) return tooltip;
  //     tooltip = _;
  //     return chart;
  //   };

  //   chart.state = function (_) {
  //     if (!arguments.length) return state;
  //     state = _;
  //     return chart;
  //   };

  //   chart.defaultState = function (_) {
  //     if (!arguments.length) return defaultState;
  //     defaultState = _;
  //     return chart;
  //   };

  //   chart.noData = function (_) {
  //     if (!arguments.length) return noData;
  //     noData = _;
  //     return chart;
  //   };

  //   chart.transitionDuration = function (_) {
  //     if (!arguments.length) return transitionDuration;
  //     transitionDuration = _;
  //     return chart;
  //   };

  //   chart.controlsData = function (_) {
  //     if (!arguments.length) return cData;
  //     cData = _;
  //     return chart;
  //   };

  //   chart.controlLabels = function (_) {
  //     if (!arguments.length) return controlLabels;
  //     if (typeof _ !== "object") return controlLabels;
  //     controlLabels = _;
  //     return chart;
  //   };

  //   yAxis.setTickFormat = yAxis.tickFormat;

  //   yAxis.tickFormat = function (_) {
  //     if (!arguments.length) return yAxisTickFormat;
  //     yAxisTickFormat = _;
  //     return yAxis;
  //   };


  //   //============================================================

  //   return chart;
  // };
  nv.models.stackedAreaChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var stacked = nv.models.stackedArea(),
        xAxis = nv.models.axis(),
        yAxis = nv.models.axis(),
        legend = nv.models.legend(),
        controls = nv.models.legend(),
        interactiveLayer = nv.interactiveGuideline();

    var margin = { top: 30, right: 25, bottom: 50, left: 60 },
        width = null,
        height = null,
        color = nv.utils.defaultColor() // a function that takes in d, i and returns color
    ,
        showControls = true,
        showLegend = true,
        showXAxis = true,
        showYAxis = true,
        rightAlignYAxis = false,
        useInteractiveGuideline = false,
        tooltips = true,
        tooltip = function (key, x, y, e, graph) {
      return "<h3>" + key + "</h3>" + "<p>" + y + " on " + x + "</p>";
    },
        x //can be accessed via chart.xScale()
    ,
        y //can be accessed via chart.yScale()
    ,
        yAxisTickFormat = yAxis.tickFormat(), //d3.format(",.2f"),
        state = { style: stacked.style() },
        defaultState = null,
        noData = "No Data Available.",
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState"),
        controlWidth = 250,
        cData = ["Stacked", "Stream", "Expanded"],
        controlLabels = {},
        transitionDuration = 250;

    xAxis.orient("bottom").tickPadding(7);
    yAxis.orient(rightAlignYAxis ? "right" : "left");

    controls.updateState(false);
    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var showTooltip = function (e, offsetElement) {
      var left = e.pos[0] + (offsetElement.offsetLeft || 0),
          top = e.pos[1] + (offsetElement.offsetTop || 0),
          x = xAxis.tickFormat()(stacked.x()(e.point, e.pointIndex)),
          y = yAxis.tickFormat()(stacked.y()(e.point, e.pointIndex)),
          content = tooltip(e.series.key, x, y, e, chart);

      nv.tooltip.show([left, top], content, e.value < 0 ? "n" : "s", null, offsetElement);
    };

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var container = d3.select(this),
            that = this;

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

        chart.update = function () {
          container.transition().duration(transitionDuration).call(chart);
        };
        chart.container = this;

        //set state.disabled
        state.disabled = data.map(function (d) {
          return !!d.disabled;
        });

        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display No Data message if there's nothing to show.

        if (!data || !data.length || !data.filter(function (d) {
          return d.values.length;
        }).length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------
        if(data[0].axisX.role == "time"){
            data.forEach(function(serie){
              serie.values.forEach(function(value){
                value.x = new Date(value.x)
              })
            })
            // console.log("Time format", data)
          }  


        //------------------------------------------------------------
        // Setup Scales
        if(data[0].axisX.role == "time"){
          x = d3.time.scale();
          x.domain([data[0].values[0].x,data[0].values[data[0].values.length-1].x])
          x.range([0, availableWidth])  
          stacked.xScale(x);
        }else{
          x = stacked.xScale();
        }

        // x = stacked.xScale();
        y = stacked.yScale();

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-stackedAreaChart").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-stackedAreaChart").append("g");
        var g = wrap.select("g");

        gEnter.append("rect").style("opacity", 0);
        gEnter.append("g").attr("class", "nv-x nv-axis");
        gEnter.append("g").attr("class", "nv-y nv-axis");
        gEnter.append("g").attr("class", "nv-stackedWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");
        gEnter.append("g").attr("class", "nv-controlsWrap");
        gEnter.append("g").attr("class", "nv-interactive");

        g.select("rect").attr("width", availableWidth).attr("height", availableHeight);
        //------------------------------------------------------------
        // Legend
        // 
        
        showLegend = showLegend && data.length > 1;

        if (showLegend) {
          var legendWidth = showControls ? availableWidth - controlWidth : availableWidth;
          legend.width(legendWidth);

          g.select(".nv-legendWrap").datum(data).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          g.select(".nv-legendWrap").attr("transform", "translate(" + (availableWidth - legendWidth) + "," + -margin.top + ")");
        }

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Controls

        if (showControls) {
          var controlsData = [{
            key: controlLabels.stacked || "Stacked",
            metaKey: "Stacked",
            disabled: stacked.style() != "stack",
            style: "stack"
          }, {
            key: controlLabels.stream || "Stream",
            metaKey: "Stream",
            disabled: stacked.style() != "stream",
            style: "stream"
          }, {
            key: controlLabels.expanded || "Expanded",
            metaKey: "Expanded",
            disabled: stacked.style() != "expand",
            style: "expand"
          }, {
            key: controlLabels.stack_percent || "Stack %",
            metaKey: "Stack_Percent",
            disabled: stacked.style() != "stack_percent",
            style: "stack_percent"
          }];

          controlWidth = cData.length / 3 * 260;

          controlsData = controlsData.filter(function (d) {
            return cData.indexOf(d.metaKey) !== -1;
          });

          controls.width(controlWidth).color(["#444", "#444", "#444"]);

          g.select(".nv-controlsWrap").datum(controlsData).call(controls);


          if (margin.top != Math.max(controls.height(), legend.height())) {
            margin.top = Math.max(controls.height(), legend.height());
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }


          g.select(".nv-controlsWrap").attr("transform", "translate(0," + -margin.top + ")");
        }

        //------------------------------------------------------------


        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (rightAlignYAxis) {
          g.select(".nv-y.nv-axis").attr("transform", "translate(" + availableWidth + ",0)");
        }

        //------------------------------------------------------------
        // Main Chart Component(s)

        //------------------------------------------------------------
        //Set up interactive layer
        if (useInteractiveGuideline) {
          interactiveLayer.width(availableWidth).height(availableHeight).margin({ left: margin.left, top: margin.top }).svgContainer(container).xScale(x);
          wrap.select(".nv-interactive").call(interactiveLayer);
        }

        stacked.width(availableWidth).height(availableHeight);

        var stackedWrap = g.select(".nv-stackedWrap").datum(data);

        stackedWrap.transition().call(stacked);

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup Axes
        // 
        if (showXAxis) {
            if(data[0].axisX.role == "time"){
                xAxis.tickFormat(customTimeFormat);
            }
            xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);
          
          g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (y.range()[0] + 10) + ")");
          g.select(".nv-x.nv-axis").transition().call(xAxis);
        }

        // if (showXAxis) {
        //   xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);
        //   console.log("AXIS Stacked ", xAxis.ticks(), xAxis.tickFormat())

        //   g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (availableHeight + 10) + ")");

        //   g.select(".nv-x.nv-axis").transition().duration(0).call(xAxis);
        // }

        if (showYAxis) {
          yAxis.scale(y)
            .ticks(stacked.offset() == "wiggle" ? 0 : availableHeight / 36)
            .tickSize(-availableWidth, 0)
            .setTickFormat(stacked.style() == "expand" || stacked.style() == "stack_percent" 
              ? d3.format("%") 
              : yAxisTickFormat);

          g.select(".nv-y.nv-axis").attr("transform", "translate(0," + 10 + ")").transition().duration(0).call(yAxis);
        }

        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        stacked.dispatch.on("areaClick.toggle", function (e) {
          if (data.filter(function (d) {
            return !d.disabled;
          }).length === 1) data.forEach(function (d) {
            d.disabled = false;
          });else data.forEach(function (d, i) {
            d.disabled = i != e.seriesIndex;
          });

          state.disabled = data.map(function (d) {
            return !!d.disabled;
          });
          dispatch.stateChange(state);

          chart.update();
        });

        legend.dispatch.on("stateChange", function (newState) {
          state.disabled = newState.disabled;
          dispatch.stateChange(state);
          chart.update();
        });

        controls.dispatch.on("legendClick", function (d, i) {
          if (!d.disabled) return;

          controlsData = controlsData.map(function (s) {
            s.disabled = true;
            return s;
          });
          d.disabled = false;

          stacked.style(d.style);


          state.style = stacked.style();
          dispatch.stateChange(state);

          chart.update();
        });


        interactiveLayer.dispatch.on("elementMousemove", function (e) {
          stacked.clearHighlights();
          var singlePoint,
              pointIndex,
              pointXLocation,
              allData = [];
          data.filter(function (series, i) {
            series.seriesIndex = i;
            return !series.disabled;
          }).forEach(function (series, i) {
            pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
            stacked.highlightPoint(i, pointIndex, true);
            var point = series.values[pointIndex];
            if (typeof point === "undefined") return;
            if (typeof singlePoint === "undefined") singlePoint = point;
            if (typeof pointXLocation === "undefined") pointXLocation = chart.xScale()(chart.x()(point, pointIndex));

            //If we are in 'expand' mode, use the stacked percent value instead of raw value.
            var tooltipValue = stacked.style() == "expand" ? point.display.y : chart.y()(point, pointIndex);
            allData.push({
              key: series.key,
              value: tooltipValue,
              color: color(series, series.seriesIndex),
              stackedValue: point.display
            });
          });

          allData.reverse();

          //Highlight the tooltip entry based on which stack the mouse is closest to.
          if (allData.length > 2) {
            var yValue = chart.yScale().invert(e.mouseY);
            var yDistMax = Infinity,
                indexToHighlight = null;
            allData.forEach(function (series, i) {
              //To handle situation where the stacked area chart is negative, we need to use absolute values
              //when checking if the mouse Y value is within the stack area.
              yValue = Math.abs(yValue);
              var stackedY0 = Math.abs(series.stackedValue.y0);
              var stackedY = Math.abs(series.stackedValue.y);
              if (yValue >= stackedY0 && yValue <= stackedY + stackedY0) {
                indexToHighlight = i;
                return;
              }
            });
            if (indexToHighlight != null) allData[indexToHighlight].highlight = true;
          }

          var xValue = xAxis.tickFormat()(chart.x()(singlePoint, pointIndex));

          //If we are in 'expand' mode, force the format to be a percentage.
          var valueFormatter = stacked.style() == "expand" ? function (d, i) {
            return d3.format(".1%")(d);
          } : function (d, i) {
            return yAxis.tickFormat()(d);
          };
          interactiveLayer.tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top }).chartContainer(that.parentNode).enabled(tooltips).valueFormatter(valueFormatter).data({
            value: xValue,
            series: allData
          })();

          interactiveLayer.renderGuideLine(pointXLocation);
        });

        interactiveLayer.dispatch.on("elementMouseout", function (e) {
          dispatch.tooltipHide();
          stacked.clearHighlights();
        });


        dispatch.on("tooltipShow", function (e) {
          if (tooltips) showTooltip(e, that.parentNode);
        });

        // Update chart from a state object passed to event handler
        dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined" && data.length === e.disabled.length) {
            data.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          if (typeof e.style !== "undefined") {
            stacked.style(e.style);
          }

          chart.update();
        });
      });


      return chart;
    }


    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    stacked.dispatch.on("tooltipShow", function (e) {
      //disable tooltips when value ~= 0
      //// TODO: consider removing points from voronoi that have 0 value instead of this hack
      /*
       if (!Math.round(stacked.y()(e.point) * 100)) {  // 100 will not be good for very small numbers... will have to think about making this valu dynamic, based on data range
       setTimeout(function() { d3.selectAll('.point.hover').classed('hover', false) }, 0);
       return false;
       }
       */

      e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top], dispatch.tooltipShow(e);
    });

    stacked.dispatch.on("tooltipHide", function (e) {
      dispatch.tooltipHide(e);
    });

    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.dispatch = dispatch;
    chart.stacked = stacked;
    chart.legend = legend;
    chart.controls = controls;
    chart.xAxis = xAxis;
    chart.yAxis = yAxis;
    chart.interactiveLayer = interactiveLayer;

    d3.rebind(chart, stacked, "x", "y", "size", "xScale", "yScale", "xDomain", "yDomain", "xRange", "yRange", "sizeDomain", "interactive", "useVoronoi", "offset", "order", "style", "clipEdge", "forceX", "forceY", "forceSize", "interpolate");

    chart.options = nv.utils.optionsFunc.bind(chart);

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
      legend.color(color);
      stacked.color(color);
      return chart;
    };

    chart.label = function (_) {
      //console.log("SA CHART", _)
      if (!arguments.length) return stacked.label;
      stacked.label(_);
      return chart;
    };

    chart.ShowPoints = function (_) {
      //console.log("SA CHART", _)
      if (!arguments.length) return stacked.scatter.showPoints();
      stacked.scatter.showPoints(_);
      return chart;
    };

    chart.showControls = function (_) {
      if (!arguments.length) return showControls;
      showControls = _;
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.showXAxis = function (_) {
      if (!arguments.length) return showXAxis;
      showXAxis = _;
      return chart;
    };

    chart.showYAxis = function (_) {
      if (!arguments.length) return showYAxis;
      showYAxis = _;
      return chart;
    };

    chart.rightAlignYAxis = function (_) {
      if (!arguments.length) return rightAlignYAxis;
      rightAlignYAxis = _;
      yAxis.orient(_ ? "right" : "left");
      return chart;
    };

    chart.useInteractiveGuideline = function (_) {
      if (!arguments.length) return useInteractiveGuideline;
      useInteractiveGuideline = _;
      if (_ === true) {
        chart.interactive(false);
        chart.useVoronoi(false);
      }
      return chart;
    };

    chart.tooltip = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    chart.transitionDuration = function (_) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = _;
      return chart;
    };

    chart.controlsData = function (_) {
      if (!arguments.length) return cData;
      cData = _;
      return chart;
    };

    chart.controlLabels = function (_) {
      if (!arguments.length) return controlLabels;
      if (typeof _ !== "object") return controlLabels;
      controlLabels = _;
      return chart;
    };

    yAxis.setTickFormat = yAxis.tickFormat;

    yAxis.tickFormat = function (_) {
      if (!arguments.length) return yAxisTickFormat;
      yAxisTickFormat = _;
      return yAxis;
    };


    //============================================================

    return chart;
  };



  nv.models.chord = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 500,
        height = 500,
        getX = function (d) {
      return d.x;
    },
        getY = function (d) {
      return d.y;
    },
        getDescription = function (d) {
      return d.description;
    },
        id = Math.floor(Math.random() * 10000) //Create semi-unique ID in case user doesn't select one
    ,
        color = nv.utils.defaultColor()
    //, valueFormat = d3.format(',.2f')
    //, labelFormat = d3.format('%')
    //, showLabels = true
    //, chordLabelsOutside = true
    //, donutLabelsOutside = false
    //, labelType = "key"
    //, labelThreshold = .02 //if slice percentage is under this, don't show label
    //, donut = false
    //, labelSunbeamLayout = false
    //, startAngle = false
    //, endAngle = false
    //, donutRatio = 0.5
    ,
        dispatch = d3.dispatch("chartClick", "elementClick", "elementDblClick", "elementMouseover", "elementMouseout");

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        // console.log("Chord data", data);
        var matrix = data[0];
        // Prepare correlation matrix for chord layout
        matrix = matrix.filter(function (series, i) {
          series.seriesIndex = i;
          return !series.disabled;
        });

        //console.log("MATRIX", matrix)
        var indexes = matrix.map(function (serie) {
          return serie.seriesIndex;
        });
        var labels = matrix.map(function (serie) {
          return serie.key;
        });
        //console.log("Indexes", indexes)

        matrix = matrix.map(function (serie, i) {
          var values = [];
          indexes.forEach(function (index) {
            values.push(serie.values[index].value);
          });

          return values;
        });

        var layoutMatrix = matrix.map(function (item, index) {
          //item[index] = 0;
          item = item.map(function (value) {
            return value * value;
          });
          return item;
        });

        //console.log(matrix)
        //console.log(layoutMatrix)

        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            radius = Math.min(availableWidth, availableHeight) / 2,
            arcRadius = radius - radius / 5,
            container = d3.select(this);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        //var wrap = container.selectAll('.nv-wrap.nv-pie').data([data]);
        var wrap = container.selectAll(".nv-wrap.nv-chord").data(data);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-chord nv-chart-" + id);
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-chord");
        //gEnter.append('g').attr('class', 'nv-pieLabels');

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        g.select(".nv-chord").attr("transform", "translate(" + availableWidth / 2 + "," + availableHeight / 2 + ")");
        //g.select('.nv-pieLabels').attr('transform', 'translate(' + availableWidth / 2 + ',' + availableHeight / 2 + ')');

        //------------------------------------------------------------
        var outerRadius = radius - margin.top - 10;
        var innerRadius = outerRadius - 0.07 * radius;

        var chordLayout = d3.layout.chord().padding(0.05).sortSubgroups(d3.descending).matrix(layoutMatrix);

        var layoutGroups = chordLayout.groups();
        layoutGroups = layoutGroups.map(function (group, i) {
          group.key = labels[i];
          group.seriesIndex = indexes[i];
          return group;
        });

        var locked = false;
        //console.log("GROUPS", layoutGroups );
        function lock() {
          return function (g, i) {
            if (locked) {
              locked = false;
              fade(false)(g, i);
            } else {
              fade(true)(g, i);
              locked = true;
            }
          };
        }

        function fade(select) {
          return function (g, i) {
            if (locked) return;
            if (select) {
              //console.log(g);
              wrap.select(".nv-chord").selectAll("path.nv-chord-group").filter(function (d) {
                return d.index == i;
              }).transition().style("opacity", 1).style("stroke-width", "3px");

              wrap.select(".nv-chord").selectAll("text.nv-chord-group").filter(function (d) {
                return d.index == i;
              }).transition().style("opacity", 1).style("font", "bold smaller Arial");

              var groups = wrap.select(".nv-chord").selectAll("path.nv-chord-group").filter(function (d) {
                return d.index != i;
              });

              groups.transition().style("opacity", 0.1);

              var labels = wrap.select(".nv-chord").selectAll("text.nv-chord-group").filter(function (d) {
                return d.index != i;
              });

              labels.transition().style("opacity", 0.1);

              wrap.select(".nv-chord").selectAll("path.nv-chord-dependency").transition().style("opacity", 0.01);

              wrap.select(".nv-chord").selectAll("text.nv-chord-group-value").transition().style("opacity", 0);

              var hords = wrap.select(".nv-chord").selectAll("path.nv-chord-dependency").filter(function (d) {
                return d.source.index == i || d.target.index == i;
              });

              hords.transition().style("opacity", function (d) {
                return d.determination;
              });

              var connectedGroups = [];

              //console.log(hords.data());


              hords.data().forEach(function (item) {
                //console.log("HORDS ITEM", item)
                var index;
                var determination;
                var correlation;
                if (item.source.index != i) {
                  index = item.source.index;
                  determination = item.determination;
                  correlation = item.correlation;
                }
                if (item.target.index != i) {
                  index = item.target.index;
                  determination = item.determination;
                  correlation = item.correlation;
                }
                connectedGroups.push({ index: index, determination: determination, correlation: correlation });
              });

              groups.filter(function (item) {
                return connectedGroups.find(function (d) {
                  return d.index == item.index;
                });
              }).data(connectedGroups).transition().style("opacity", function (d) {
                return d.determination;
              });

              labels.filter(function (item) {
                return connectedGroups.find(function (d) {
                  return d.index == item.index;
                });
              }).data(connectedGroups).transition().style("opacity", function (d) {
                return d.determination;
              });

              var values = wrap.select(".nv-chord").selectAll("text.nv-chord-group-value").filter(function (item) {
                return connectedGroups.find(function (d) {
                  return d.index == item.index;
                });
              }).data(connectedGroups).transition().style("opacity", function (d) {
                if (d.determination > 0.3 && d.determination < 0.8) {
                  return d.determination + 0.2;
                }
                return d.determination;
              }).text(function (d) {
                return d.correlation > 0 ? d.determination.toPrecision(2) : -d.determination.toPrecision(2);
              }).style("fill", function (d) {
                //console.log(d)
                return d.correlation > 0 ? "#7f0000" : "#081d58";
              });
            } else {
              wrap.select(".nv-chord").selectAll("path.nv-chord-group").transition().duration(250).style("opacity", 0.5).style("stroke-width", "1px");

              wrap.select(".nv-chord").selectAll("text.nv-chord-group").transition().duration(250).style("opacity", 0.9).style("font", "bold x-small Arial");

              wrap.select(".nv-chord").selectAll("path.nv-chord-dependency").transition().duration(250).style("opacity", function (d) {
                return 0.5 * d.determination;
              }).style("stroke-width", "1px");
              wrap.select(".nv-chord").selectAll("text.nv-chord-group-value").transition().duration(250).style("fill", "#000000").style("opacity", 0);
            }
          };
        }


        var groups = wrap.select(".nv-chord").selectAll("path.nv-chord-group").data(layoutGroups);
        groups.exit().remove();

        groups.enter().append("path").attr("class", "nv-chord-group").style("fill", function (d, i) {
          return "#238443";
        }).style("stroke", function (d, i) {
          return "#238443";
        }).style("opacity", 0.05).attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)).on("mouseover", fade(true)).on("mouseout", fade(false)).on("click", lock());
        ;

        groups.transition()
        //.style("fill", function (d, i) {
        //    return color(d, d.seriesIndex);
        //})
        //.style("stroke", function (d, i) {
        //    return color(d, d.seriesIndex);
        //})
        .style("opacity", 0.5).attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));


        var labels = wrap.select(".nv-chord").selectAll("text.nv-chord-group").data(layoutGroups);
        labels.exit().remove();
        labels.enter().append("text").attr("class", "nv-chord-group").style("fill", function (d, i) {
          return "#000000";
        }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
          return getTextAnchor(d, i);
        }).attr("x", function (d, i) {
          return (outerRadius + 3) * Math.sin(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("y", function (d, i) {
          return (outerRadius + 3) * Math.cos(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("dy", function (d, i) {
          return getDy(d, i);
        }).classed("nv-label", true).text(function (d, i) {
          return d.key;
        });

        labels.style("stroke", "none").style("opacity", 0.9);

        labels.transition().style("fill", function (d, i) {
          return "#000000";
        }).style("font", "bold x-small Arial").style("text-anchor", function (d, i) {
          return getTextAnchor(d, i);
        }).attr("x", function (d, i) {
          return (outerRadius + 3) * Math.sin(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("y", function (d, i) {
          return (outerRadius + 3) * Math.cos(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("dy", function (d, i) {
          return getDy(d, i);
        }).text(function (d, i) {
          return d.key;
        });


        var hordsData = chordLayout.chords();
        hordsData = hordsData.map(function (item) {
          item.correlation = matrix[item.source.index][item.target.index];
          item.determination = item.correlation * item.correlation;
          return item;
        });
        hordsData = hordsData.filter(function (item) {
          return item.source.index != item.target.index;
        });


        var chords = wrap.select(".nv-chord").selectAll("path.nv-chord-dependency").data(hordsData);

        chords.exit().remove();

        //console.log("CHORDS",chordLayout.chords());

        chords.enter().append("path").attr("class", "nv-chord-dependency").attr("d", d3.svg.chord().radius(innerRadius)).style("fill", function (d) {
          return d.correlation > 0 ? "#fb6a4a" : "#6baed6";
        }).style("stroke", function (d) {
          return d.correlation > 0 ? "#fb6a4a" : "#6baed6";
        }).style("opacity", 0.3);

        chords.transition().duration(250).attr("d", d3.svg.chord().radius(innerRadius)).style("fill", function (d) {
          return d.correlation > 0 ? "#fb6a4a" : "#6baed6";
        }).style("stroke", function (d) {
          return d.correlation > 0 ? "#fb6a4a" : "#6baed6";
        }).style("opacity", function (d) {
          return 0.5 * d.determination;
        });

        var values = wrap.select(".nv-chord").selectAll("text.nv-chord-group-value").data(layoutGroups);
        values.exit().remove();
        values.enter().append("text").attr("class", "nv-chord-group-value").style("fill", function (d, i) {
          return "#000000";
        }).style("font", "bold smaller Arial").style("text-anchor", function (d, i) {
          return getValueAnchor(d, i);
        }).attr("x", function (d, i) {
          return (innerRadius - 3) * Math.sin(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("y", function (d, i) {
          return (innerRadius - 3) * Math.cos(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("dy", function (d, i) {
          return getValueDy(d, i);
        }).classed("nv-label", true).text(function (d, i) {
          return "0.00";
        });

        values.style("stroke", "none").style("opacity", 0);

        values.transition().style("fill", function (d, i) {
          return "#000000";
        }).style("font", "bold smaller Arial").style("text-anchor", function (d, i) {
          return getValueAnchor(d, i);
        }).attr("x", function (d, i) {
          return (innerRadius - 3) * Math.sin(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("y", function (d, i) {
          return (innerRadius - 3) * Math.cos(Math.PI + (d.startAngle + d.endAngle) / -2);
        }).attr("dy", function (d, i) {
          return getValueDy(d, i);
        }).text(function (d, i) {
          return "0.00";
        });
      });

      return chart;
    }


    function getTextAnchor(d, i) {
      var angle = Math.PI + (d.startAngle + d.endAngle) / -2;
      var x = Math.sin(angle);
      if (Math.abs(x) < 0.1) return "middle";
      if (x > 0.1) return "start";
      return "end";
    }

    function getDy(d, i) {
      var angle = Math.PI + (d.startAngle + d.endAngle) / -2;
      var y = Math.cos(angle);
      if (Math.abs(y) < 0.1) return ".72em";
      if (y > 0.1) return "1em";
      return "-.3em";
    }

    function getValueAnchor(d, i) {
      var angle = Math.PI + (d.startAngle + d.endAngle) / -2;
      var x = Math.sin(angle);
      if (Math.abs(x) < 0.1) return "middle";
      if (x > 0.1) return "end";
      return "start";
    }

    function getValueDy(d, i) {
      var angle = Math.PI + (d.startAngle + d.endAngle) / -2;
      var y = Math.cos(angle);
      if (Math.abs(y) < 0.1) return ".72em";
      if (y > 0.1) return "-.3em";
      return "1em";
    }

    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

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

    //chart.values = function(_) {
    //    nv.log("chord.values() is no longer supported.");
    //    return chart;
    //};

    chart.x = function (_) {
      if (!arguments.length) return getX;
      getX = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = d3.functor(_);
      return chart;
    };

    //chart.description = function(_) {
    //    if (!arguments.length) return getDescription;
    //    getDescription = _;
    //    return chart;
    //};
    //
    //chart.showLabels = function(_) {
    //    if (!arguments.length) return showLabels;
    //    showLabels = _;
    //    return chart;
    //};
    //
    //chart.labelSunbeamLayout = function(_) {
    //    if (!arguments.length) return labelSunbeamLayout;
    //    labelSunbeamLayout = _;
    //    return chart;
    //};
    //
    //chart.donutLabelsOutside = function(_) {
    //    if (!arguments.length) return donutLabelsOutside;
    //    donutLabelsOutside = _;
    //    return chart;
    //};
    //
    //chart.chordLabelsOutside = function(_) {
    //    if (!arguments.length) return chordLabelsOutside;
    //    chordLabelsOutside = _;
    //    return chart;
    //};
    //
    //chart.labelType = function(_) {
    //    if (!arguments.length) return labelType;
    //    labelType = _;
    //    labelType = labelType || "key";
    //    return chart;
    //};
    //
    //chart.donut = function(_) {
    //    if (!arguments.length) return donut;
    //    donut = _;
    //    return chart;
    //};
    //
    //chart.donutRatio = function(_) {
    //    if (!arguments.length) return donutRatio;
    //    donutRatio = _;
    //    return chart;
    //};
    //
    //chart.startAngle = function(_) {
    //    if (!arguments.length) return startAngle;
    //    startAngle = _;
    //    return chart;
    //};
    //
    //chart.endAngle = function(_) {
    //    if (!arguments.length) return endAngle;
    //    endAngle = _;
    //    return chart;
    //};

    chart.id = function (_) {
      if (!arguments.length) return id;
      id = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      return chart;
    };

    //chart.valueFormat = function(_) {
    //    if (!arguments.length) return valueFormat;
    //    valueFormat = _;
    //    return chart;
    //};
    //
    //chart.labelFormat = function(_) {
    //    if (!arguments.length) return labelFormat;
    //    labelFormat = _;
    //    return chart;
    //};
    //
    //chart.labelThreshold = function(_) {
    //    if (!arguments.length) return labelThreshold;
    //    labelThreshold = _;
    //    return chart;
    //};
    //============================================================


    return chart;
  };


  nv.models.chordChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var chord = nv.models.chord(),
        legend = nv.models.legend();

    var margin = { top: 30, right: 20, bottom: 20, left: 20 },
        width = null,
        height = null,
        showLegend = false,
        color = nv.utils.defaultColor(),
        tooltips = true,
        tooltip = function (key, y, e, graph) {
      return "<h3>" + key + "</h3>" + "<p>" + y + "</p>";
    },
        state = {},
        defaultState = null,
        noData = "No Data Available.",
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState");

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var showTooltip = function (e, offsetElement) {
      var tooltipLabel = chord.description()(e.point) || chord.x()(e.point);
      var left = e.pos[0] + (offsetElement && offsetElement.offsetLeft || 0),
          top = e.pos[1] + (offsetElement && offsetElement.offsetTop || 0),
          y = chord.valueFormat()(chord.y()(e.point)),
          content = tooltip(tooltipLabel, y, e, chart);

      nv.tooltip.show([left, top], content, e.value < 0 ? "n" : "s", null, offsetElement);
    };

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        //console.log("CHORD CHART", data)


        var container = d3.select(this),
            that = this;

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

        chart.update = function () {
          container.transition().call(chart);
        };
        chart.container = this;

        //set state.disabled
        state.disabled = data.map(function (d) {
          return !!d.disabled;
        });

        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display No Data message if there's nothing to show.

        if (!data || !data.length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-chordChart").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-chordChart").append("g");
        var g = wrap.select("g");

        gEnter.append("g").attr("class", "nv-chordWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Legend

        // if (showLegend) {
        //   legend.width(availableWidth).key(function (d) {
        //     return d.key;
        //   }).min(2).color(function (d) {
        //     return "#238443";
        //   });

        //   wrap.select(".nv-legendWrap").datum(data).call(legend);

        //   if (margin.top != legend.height()) {
        //     margin.top = legend.height();
        //     availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
        //   }

        //   wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        // }

        //------------------------------------------------------------


        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //------------------------------------------------------------
        // Main Chart Component(s)

        chord.width(availableWidth).height(availableHeight);


        var chordWrap = g.select(".nv-chordWrap").datum([data]);

        d3.transition(chordWrap).call(chord);

        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        // legend.dispatch.on("stateChange", function (newState) {
        //   state = newState;
        //   dispatch.stateChange(state);
        //   chart.update();
        // });

        //chord.dispatch.on('elementMouseout.tooltip', function(e) {
        //    dispatch.tooltipHide(e);
        //});


        // Update chart from a state object passed to event handler
        dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined") {
            data.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          chart.update();
        });

        //============================================================
      });

      return chart;
    }

    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------

    //chord.dispatch.on('elementMouseover.tooltip', function(e) {
    //    e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
    //    dispatch.tooltipShow(e);
    //});

    dispatch.on("tooltipShow", function (e) {
      if (tooltips) showTooltip(e);
    });

    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.legend = legend;
    chart.dispatch = dispatch;
    chart.chord = chord;

    d3.rebind(chart, chord, "valueFormat", "labelFormat", "values", "x", "y", "description", "id", "showLabels", "donutLabelsOutside", "chordLabelsOutside", "labelType", "donut", "donutRatio", "labelThreshold");
    chart.options = nv.utils.optionsFunc.bind(chart);

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
      legend.color(color);
      chord.color(color);
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    //============================================================


    return chart;
  };


  nv.models.legend = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 5, right: 0, bottom: 5, left: 0 },
        width = 400,
        height = 20,
        
        getKey = function (d) {
          return d.key;
        },

        color = nv.utils.defaultColor(),
        colorIndex = function(d){return d.colorIndex},

        align = true,
        rightAlign = true,
        updateState = true //If true, legend will update data.disabled and trigger a 'stateChange' dispatch.
    ,
        radioButtonMode = false //If true, clicking legend items will cause it to behave like a radio button. (only one can be selected at a time)
    ,
        dispatch = d3.dispatch("legendClick", "legendDblclick", "legendMouseover", "legendMouseout", "stateChange"),
        minEnabledSeries,
        bgOpacity = 0,
        isSlaveChart = false;

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        // console.log("update legend", data)
        var availableWidth = width - margin.left - margin.right,
            container = d3.select(this);

        // console.log("legend", data)    

        if(isSlaveChart){
          if(radioButtonMode){
            var b = true;
            data.forEach(function(d){
              if(b){
                if(d.disabled == undefined || d.disabled == false) b = false;
              }else{
                d.disabled = true;
              }
            })
          }
          
          data = data.filter(function(d){return !d.disabled})
        }

        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-legend").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-legend").append("g");
        var g = wrap.select("g");

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //------------------------------------------------------------

        var bg = gEnter.selectAll("rect.nv-series-bg").data([0]);
        
        // if(isSlaveChart){
        //   data = data.filter((item) => !item.disabled)
        // }

        if(radioButtonMode){   
          var c = 0;
          data.forEach(function(d){
            if(d.disabled == undefined){
              d.disabled = true;
              c++;
            }
          })
          if(c==data.length){
            data[0].disabled = false;
          }
        }  

        var series = g.selectAll(".nv-series").data(function (d) {
          // console.log("Form series",d);
          return d;
        });

        gEnter
          .append("rect")
          .style("stroke-width", 1)
          .style("stroke-opacity", 0)
          .style("fill-opacity", bgOpacity)
          .style("fill", "#ffffff")
          .attr("class", "nv-series-bg")
          .attr("transform", "translate(-10,-25)");

        var seriesEnter = series
          .enter()
          .append("g")
          .attr("class", "nv-series")
        if(!isSlaveChart){
          seriesEnter  
            .on("mouseover", function (d, i) {
              dispatch.legendMouseover(d, i); //TODO: Make consistent with other event objects
            })
            .on("mouseout", function (d, i) {
              dispatch.legendMouseout(d, i);
            })
            .on("click", function (d, i) {
            //console.log("LEGEND",updateState,radioButtonMode )
              dispatch.legendClick(d, i);
              if (updateState) {
              if (radioButtonMode) {
                // console.log("RADIO MODE select", d);
                //Radio button mode: set every series to disabled,
                //  and enable the clicked series.
                data.forEach(function (series) {
                  series.disabled = true;
                });
                d.disabled = false;
              } else {
                d.disabled = !d.disabled;
                var count = minEnabledSeries ? minEnabledSeries : 1;
                if (data.filter(function (series) {
                  return !series.disabled;
                }).length < count) {
                  //the default behavior of NVD3 legends is, if every single series
                  // is disabled, turn all series' back on.
                  data.forEach(function (series) {
                    series.disabled = false;
                  });
                }
              }
              dispatch.stateChange({
                disabled: data.map(function (d) {
                  return !!d.disabled;
                })
              });
            }
          })
          .on("dblclick", function (d, i) {
            dispatch.legendDblclick(d, i);
            // console.log("dbl",updateState,minEnabledSeries)
            if (updateState && !minEnabledSeries) {
              //the default behavior of NVD3 legends, when double clicking one,
              // is to set all other series' to false, and make the double clicked series enabled.
              // console.log("!!!")
              data.forEach(function (series) {
                series.disabled = true;
              });
              d.disabled = false;
              dispatch.stateChange({
                disabled: data.map(function (d) {
                  return !!d.disabled;
                })
              });
            }
          });
        }  

        if(!isSlaveChart){
          seriesEnter.append("circle")
            .style("stroke-width", 2)
            .attr("class", "nv-legend-symbol")
            .attr("r", 5);
        } else {
          seriesEnter.append("rect")
            .style("stroke-width", 2)
            .attr("class", "nv-legend-symbol")
            .attr("height", 10)
            .attr("width", 10)
            .attr("x", -5)
            .attr("y", -5)
        }    

        seriesEnter.append("text")
          .attr("text-anchor", "start")
          .attr("class", "nv-legend-text")
          .attr("dy", ".32em")
          .attr("dx", "8");

        // series.classed("disabled", function (d) {
        //   return d.disabled;
        // });
        
        bg.exit().remove();
        series.exit().remove();

        series
          .select(".nv-legend-symbol")
          .style("fill", function (d) {
            return d.color || color(d,colorIndex(d));
          })
          .style("stroke", function (d) {
            return d.color || color(d,colorIndex(d));
          })
        
        if(isSlaveChart){  
          series
            .select(".nv-legend-symbol")
            .style("fill-opacity",0.3)
        }else{
          series
            .select(".nv-legend-symbol")
            .style("fill-opacity",function(d){return (d.disabled)? 0 : 0.3})
            .classed("disabled", function (d) {
              return d.disabled;
            });
        }  
        
        // if(isSlaveChart){
        //   series
        //     .select("circle")
        //     .style("fill", function (d, i) {
        //       return d.color || color(d, i);
        //     })
        //     .style("stroke", function (d, i) {
        //       return d.color || color(d, i);
        //     });
        // } else {
        //     series
        //     .select("rect")
        //     .style("fill", function (d, i) {
        //       return d.color || color(d, i);
        //     })
        //     .style("stroke", function (d, i) {
        //       return d.color || color(d, i);
        //     });
        // }  

        series.select("text")
          .text(getKey);


        //TODO: implement fixed-width and max-width options (max-width is especially useful with the align option)

        // NEW ALIGNING CODE, TODO: clean up
        if (align) {
          var seriesWidths = [];
          series.each(function (d, i) {
            var legendText = d3.select(this).select("text");
            var nodeTextLength;
            try {
              nodeTextLength = legendText.node().getComputedTextLength();
              // If the legendText is display:none'd (nodeTextLength == 0), simulate an error so we approximate, instead
              if (nodeTextLength <= 0) throw Error();
            } catch (e) {
              nodeTextLength = nv.utils.calcApproxTextWidth(legendText);
            }

            seriesWidths.push(nodeTextLength + 28); // 28 is ~ the width of the circle plus some padding
          });

          var seriesPerRow = 0;
          var legendWidth = 0;
          var columnWidths = [];

          while (legendWidth < availableWidth && seriesPerRow < seriesWidths.length) {
            columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
            legendWidth += seriesWidths[seriesPerRow++];
          }
          if (seriesPerRow === 0) seriesPerRow = 1; //minimum of one series per row


          while (legendWidth > availableWidth && seriesPerRow > 1) {
            columnWidths = [];
            seriesPerRow--;

            for (var k = 0; k < seriesWidths.length; k++) {
              if (seriesWidths[k] > (columnWidths[k % seriesPerRow] || 0)) columnWidths[k % seriesPerRow] = seriesWidths[k];
            }

            legendWidth = columnWidths.reduce(function (prev, cur, index, array) {
              return prev + cur;
            });
          }

          var xPositions = [];
          for (var i = 0, curX = 0; i < seriesPerRow; i++) {
            xPositions[i] = curX;
            curX += columnWidths[i];
          }

          series.attr("transform", function (d, i) {
            return "translate(" + xPositions[i % seriesPerRow] + "," + (5 + Math.floor(i / seriesPerRow) * 20) + ")";
          });

          //position legend as far right as possible within the total width
          if (rightAlign) {
            g.attr("transform", "translate(" + (width - margin.right - legendWidth) + "," + margin.top + ")");
          } else {
            g.attr("transform", "translate(0" + "," + margin.top + ")");
          }

          height = margin.top + margin.bottom + Math.ceil(seriesWidths.length / seriesPerRow) * 20;
          gEnter.select("rect.nv-series-bg").transition().attr("width", width).attr("height", height + 25);
        } else {
          var ypos = 5,
              newxpos = 5,
              maxwidth = 0,
              xpos;
          series.attr("transform", function (d, i) {
            var length = d3.select(this).select("text").node().getComputedTextLength() + 28;
            xpos = newxpos;

            if (width < margin.left + margin.right + xpos + length) {
              newxpos = xpos = 5;
              ypos += 20;
            }

            newxpos += length;
            if (newxpos > maxwidth) maxwidth = newxpos;

            return "translate(" + xpos + "," + ypos + ")";
          });

          //position legend as far right as possible within the total width
          g.attr("transform", "translate(" + (width - margin.right - maxwidth) + "," + margin.top + ")");

          height = margin.top + margin.bottom + ypos + 15;
          gEnter.select("rect.nv-series-bg").transition().attr("width", width).attr("height", height + 25);
        }
      });

      return chart;
    }


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

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
    
    chart.slaveChart = function (_) {
      if (!arguments.length) return isSlaveChart;
      isSlaveChart = _;
      // console.log("Set slaveChart",isSlaveChart)
      return chart;
    };

    chart.backgroundOpacity  = function (_) {
      if (!arguments.length) return bgOpacity;
      bgOpacity = _;
      return chart;
    };
    
    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.key = function (_) {
      if (!arguments.length) return getKey;
      getKey = _;
      return chart;
    };

    chart.colorIndex = function (_) {
      if (!arguments.length) return colorIndex;
      colorIndex = _;
      return chart;
    };

    chart.min = function (_) {
      if (!arguments.length) return minEnabledSeries;
      minEnabledSeries = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      return chart;
    };

    chart.align = function (_) {
      if (!arguments.length) return align;
      align = _;
      return chart;
    };

    chart.rightAlign = function (_) {
      if (!arguments.length) return rightAlign;
      rightAlign = _;
      return chart;
    };

    chart.updateState = function (_) {
      if (!arguments.length) return updateState;
      updateState = _;
      return chart;
    };

    chart.radioButtonMode = function (_) {
      if (!arguments.length) return radioButtonMode;
      //console.log("set radio mode", _);
      radioButtonMode = _;
      return chart;
    };

    //============================================================


    return chart;
  };

  nv.models.colorScheme = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = { top: 5, right: 20, bottom: 5, left: 0 },
        width = 400,
        height = 20
    //, getKey = function (d) {
    //  return d.key
    //}
    ,
        color = nv.utils.defaultColor(),
        align = true,
        rightAlign = true
    //, updateState = true   //If true, legend will update data.disabled and trigger a 'stateChange' dispatch.
    //, radioButtonMode = false   //If true, clicking legend items will cause it to behave like a radio button. (only one can be selected at a time)
    //, dispatch = d3.dispatch('legendClick', 'legendDblclick', 'legendMouseover', 'legendMouseout', 'stateChange')
    //, minEnabledSeries
    


    ;

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        // console.log("Colors", data)
        // prepare data
        var data1 = data.filter(function (item) {
          return item.disabled !== true;
        })[0];
        
        // console.log("Colors select serie", data1)

        data1 = (data1) ? data1 : data[0]; 
        
        var availableWidth = width - margin.left - margin.right,
        
        container = d3.select(this);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container
          .selectAll("g.nv-colorScheme")
          .data([data1]);

        wrap  
          .enter()
          .append("g")
          .attr("class", "nvd3 nv-colorScheme")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                   
        var gColorScheme = container.select("g.nv-colorScheme");

        

        //------------------------------------------------------------


        var bg = gColorScheme
          .selectAll("rect.nv-color-bg")
          .data([0]);

        
        var values = gColorScheme
          .selectAll(".nv-color-title")
          .data([data1.min.toFixed(2), data1.max.toFixed(2)]);

        values.exit().remove();
                  

        var cldata = [];
        for(var i=0; i<data1.cats; i++){ cldata.push(i)}
        
        var colors = gColorScheme
          .selectAll("rect.nv-color")
          .data(cldata);
          
        var scaleWidth = 0.15 * availableWidth;
        scaleWidth = (scaleWidth < 90) ? 90 : scaleWidth;
        scaleWidth = (scaleWidth > 200) ? 200 : scaleWidth;

        var scaleHeight = scaleWidth/10;
        scaleHeight = (scaleHeight < 5) ? 5 : scaleHeight;
        scaleHeight = (scaleHeight > 8) ? 8 : scaleHeight;
          
        var rectWidth = scaleWidth / data1.cats;
       
        bg.exit().remove();
        colors.exit().remove();
        


        bg
          .enter()
          .append("rect")
          .attr("class", "nv-color-bg")
          .attr("fill", "#ffffff")
          .attr("height", function(d){return (scaleWidth/10)+20})
          .attr("width", function(d){return scaleWidth+20})
          .attr("transform", "translate(10,-15)")
          .style("stroke", "#777")
          .style("stroke-opacity", 0.7)
          .style("stroke-width", 0.3) 
          .style("fill-opacity", 0.85);  


          

        colors
          .enter()
          .append("rect")
          .attr("class", "nv-color")
          .attr("width", rectWidth)
          .attr("height", scaleHeight)
          .attr("width", rectWidth)
          .attr("fill", color)
          .attr("opacity", 1)
          .style("stroke", "#777")
          .style("stroke-opacity", 0.7)
          .style("stroke-width", 0.3) 
          .attr("transform", function (d, i) {
            var x = rectWidth * i + 20;
            return "translate(" + x + "," + 0 + ")";
          });
        
        values
         .enter()
         .append("text")
         .attr("class", "nv-color-title")
         .attr("dy", "-0.3em")
         .style("font-size","x-small")
         .style("font-stretch","extra-condensed");
         
         values
          .transition()
          .text(function(d){return d})
          .style("text-anchor", function(d,i){return (i==0)?"start":"end"})
           .attr("transform", function (d, i) {
              var x = (rectWidth*data1.cats) * i + 20;
              return "translate(" + x + "," + 0 + ")";
            });
        
        height = margin.top + margin.bottom + 15;

      });

      return chart;
    }


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    //chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

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
      return chart;
    };

    chart.align = function (_) {
      if (!arguments.length) return align;
      align = _;
      return chart;
    };

    chart.rightAlign = function (_) {
      if (!arguments.length) return rightAlign;
      rightAlign = _;
      return chart;
    };

    //============================================================


    return chart;
  };

  // nv.models.axis = function () {
  //   "use strict";
  //   //============================================================
  //   // Public Variables with Default Settings
  //   //------------------------------------------------------------

  //   var axis = d3.svg.axis();

  //   var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  //       width = 75 //only used for tickLabel currently
  //   ,
  //       height = 60 //only used for tickLabel currently
  //   ,
  //       scale = d3.scale.linear(),
  //       axisLabelText = null,
  //       showMaxMin = true //TODO: showMaxMin should be disabled on all ordinal scaled axes
  //   ,
  //       highlightZero = true,
  //       rotateLabels = 0,
  //       rotateYLabel = true,
  //       staggerLabels = false,
  //       isOrdinal = false,
  //       ticks = null,
  //       axisLabelDistance = 12 //The larger this number is, the closer the axis label is to the axis.
  //   ;

  //   axis.scale(scale).orient("bottom").tickFormat(function (d) {
  //     return d;
  //   });

  //   //============================================================


  //   //============================================================
  //   // Private Variables
  //   //------------------------------------------------------------

  //   var scale0;

  //   //============================================================


  //   function chart(selection) {
  //     selection.each(function (data) {
  //       var container = d3.select(this);


  //       //------------------------------------------------------------
  //       // Setup containers and skeleton of chart

  //       var wrap = container.selectAll("g.nv-wrap.nv-axis").data([data]);
  //       var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-axis");
  //       var gEnter = wrapEnter.append("g");
  //       var g = wrap.select("g");

  //       //------------------------------------------------------------


  //       if (ticks !== null) axis.ticks(ticks);else if (axis.orient() == "top" || axis.orient() == "bottom") axis.ticks(Math.abs(scale.range()[1] - scale.range()[0]) / 100);


  //       //TODO: consider calculating width/height based on whether or not label is added, for reference in charts using this component


  //       g.transition().call(axis);

  //       scale0 = scale0 || axis.scale();

  //       var fmt = axis.tickFormat();
  //       if (fmt == null) {
  //         fmt = scale0.tickFormat();
  //       }

  //       var axisLabel = g.selectAll("text.nv-axislabel").data([axisLabelText || null]);
  //       axisLabel.exit().remove();
  //       switch (axis.orient()) {
  //         case "top":
  //           axisLabel.enter().append("text").attr("class", "nv-axislabel");
  //           var w = scale.range().length == 2 ? scale.range()[1] : scale.range()[scale.range().length - 1] + (scale.range()[1] - scale.range()[0]);
  //           axisLabel.attr("text-anchor", "middle").attr("y", 0).attr("x", w / 2);
  //           if (showMaxMin) {
  //             var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
  //             axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text");
  //             axisMaxMin.exit().remove();
  //             axisMaxMin.attr("transform", function (d, i) {
  //               return "translate(" + scale(d) + ",0)";
  //             }).select("text")
  //               .attr("dy", "-0.5em")
  //               .attr("y", -axis.tickPadding())
  //               .attr("text-anchor", "middle")
  //               .style("font-stretch", "extra-condensed")
  //               .text(function (d, i) {
  //               var v = fmt(d);
  //               return ("" + v).match("NaN") ? "" : new Number(v).toFixed(2);
  //             });
  //             axisMaxMin.transition().attr("transform", function (d, i) {
  //               return "translate(" + scale.range()[i] + ",0)";
  //             });
  //           }
  //           break;
  //         case "bottom":
  //           var xLabelMargin = 30;
  //           var maxTextWidth = 30;
  //           var xTicks = g.selectAll("g").select("text");
  //           if (rotateLabels % 360) {
  //             //Calculate the longest xTick width
  //             xTicks.each(function (d, i) {
  //               var width = this.getBBox().width;
  //               if (width > maxTextWidth) maxTextWidth = width;
  //             });
  //             //Convert to radians before calculating sin. Add 30 to margin for healthy padding.
  //             var sin = Math.abs(Math.sin(rotateLabels * Math.PI / 180));
  //             var xLabelMargin = (sin ? sin * maxTextWidth : maxTextWidth) + 30;
  //             //Rotate all xTicks
  //             xTicks.attr("transform", function (d, i, j) {
  //               return "rotate(" + rotateLabels + " 0,0)";
  //             }).style("text-anchor", rotateLabels % 360 > 0 ? "start" : "end");
  //           }
  //           axisLabel.enter().append("text").attr("class", "nv-axislabel");
  //           var w = scale.range().length == 2 ? scale.range()[1] : scale.range()[scale.range().length - 1] + (scale.range()[1] - scale.range()[0]);
  //           axisLabel.attr("text-anchor", "middle").attr("y", xLabelMargin).attr("x", w / 2);
  //           if (showMaxMin) {
  //             //if (showMaxMin && !isOrdinal) {
  //             var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin")
  //             //.data(scale.domain())
  //             .data([scale.domain()[0], scale.domain()[scale.domain().length - 1]]);
  //             axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text");
  //             axisMaxMin.exit().remove();
  //             axisMaxMin.attr("transform", function (d, i) {
  //               return "translate(" + (scale(d) + (isOrdinal ? scale.rangeBand() / 2 : 0)) + ",0)";
  //             }).select("text").attr("dy", ".71em").attr("y", axis.tickPadding()).attr("transform", function (d, i, j) {
  //               return "rotate(" + rotateLabels + " 0,0)";
  //             }).style("text-anchor", rotateLabels ? rotateLabels % 360 > 0 ? "start" : "end" : "middle")
  //               .style("font-stretch", "extra-condensed")
  //               .text(function (d, i) {
  //               var v = fmt(d);
  //               return ("" + v).match("NaN") ? "" :new Number(v).toFixed(2);

  //             });
  //             axisMaxMin.transition().attr("transform", function (d, i) {
  //               //return 'translate(' + scale.range()[i] + ',0)'
  //               //return 'translate(' + scale(d) + ',0)'
  //               return "translate(" + (scale(d) + (isOrdinal ? scale.rangeBand() / 2 : 0)) + ",0)";
  //             });
  //           }
  //           if (staggerLabels) xTicks.attr("transform", function (d, i) {
  //             return "translate(0," + (i % 2 == 0 ? "0" : "12") + ")";
  //           });

  //           break;
  //         case "right":
  //           axisLabel.enter().append("text").attr("class", "nv-axislabel");
  //           axisLabel.style("text-anchor", rotateYLabel ? "middle" : "begin").attr("transform", rotateYLabel ? "rotate(90)" : "").attr("y", rotateYLabel ? -Math.max(margin.right, width) + 12 : -10) //TODO: consider calculating this based on largest tick width... OR at least expose this on chart
  //           .attr("x", rotateYLabel ? scale.range()[0] / 2 : axis.tickPadding());
  //           if (showMaxMin) {
  //             var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
  //             axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text").style("opacity", 0);
  //             axisMaxMin.exit().remove();
  //             axisMaxMin.attr("transform", function (d, i) {
  //               return "translate(0," + scale(d) + ")";
  //             }).select("text").attr("dy", ".32em").attr("y", 0).attr("x", axis.tickPadding())
  //               .style("text-anchor", "start")
  //               .style("font-stretch", "extra-condensed")
  //               .text(function (d, i) {
  //               var v = fmt(d);
  //               return ("" + v).match("NaN") ? "" : new Number(v).toFixed(2);

  //             });
  //             axisMaxMin.transition().attr("transform", function (d, i) {
  //               return "translate(0," + scale.range()[i] + ")";
  //             }).select("text").style("opacity", 1);
  //           }
  //           break;
  //         case "left":
  //           /*
  //            //For dynamically placing the label. Can be used with dynamically-sized chart axis margins
  //            var yTicks = g.selectAll('g').select("text");
  //            yTicks.each(function(d,i){
  //            var labelPadding = this.getBBox().width + axis.tickPadding() + 16;
  //            if(labelPadding > width) width = labelPadding;
  //            });
  //            */
  //           axisLabel.enter().append("text").attr("class", "nv-axislabel");
  //           axisLabel.style("text-anchor", rotateYLabel ? "middle" : "end").attr("transform", rotateYLabel ? "rotate(-90)" : "").attr("y", rotateYLabel ? -Math.max(margin.left, width) + axisLabelDistance : -10) //TODO: consider calculating this based on largest tick width... OR at least expose this on chart
  //           .attr("x", rotateYLabel ? -scale.range()[0] / 2 : -axis.tickPadding());
  //           if (showMaxMin) {
  //             var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
  //             axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text").style("opacity", 0);
  //             axisMaxMin.exit().remove();
  //             axisMaxMin.attr("transform", function (d, i) {
  //               return "translate(0," + scale0(d) + ")";
  //             }).select("text")
  //               .attr("dy", ".32em")
  //               .attr("y", 0)
  //               .attr("x", -axis.tickPadding())
  //               .attr("text-anchor", "end")
  //               .style("font-stretch", "extra-condensed")
  //               .text(function (d, i) {
  //                 // /////////////////////////////////
  //                 var v = fmt(d);
  //                 if(("" + v).match("NaN")){
  //                   return ""
  //                 }else{
  //                   return new Number(v).toFixed(2);

  //                 }
  //                 // return ("" + v).match("NaN") ? "" : v;
  //               });
              
  //             axisMaxMin.transition().attr("transform", function (d, i) {
  //               return "translate(0," + scale.range()[i] + ")";
  //             }).select("text").style("opacity", 1);
  //           }
  //           break;
  //       }
  //       axisLabel.text(function (d) {
  //         return d;
  //       });


  //       if (showMaxMin && (axis.orient() === "left" || axis.orient() === "right")) {
  //         //check if max and min overlap other values, if so, hide the values that overlap
  //         g.selectAll("g") // the g's wrapping each tick
  //         .each(function (d, i) {
  //           d3.select(this).select("text").attr("opacity", 1);
  //           if (scale(d) < scale.range()[1] + 10 || scale(d) > scale.range()[0] - 10) {
  //             // 10 is assuming text height is 16... if d is 0, leave it!
  //             if (d > 1e-10 || d < -1e-10) // accounts for minor floating point errors... though could be problematic if the scale is EXTREMELY SMALL
  //               d3.select(this).attr("opacity", 0);

  //             d3.select(this).select("text").attr("opacity", 0); // Don't remove the ZERO line!!
  //           }
  //         });

  //         //if Max and Min = 0 only show min, Issue #281
  //         if (scale.domain()[0] == scale.domain()[1] && scale.domain()[0] == 0) wrap.selectAll("g.nv-axisMaxMin").style("opacity", function (d, i) {
  //           return !i ? 1 : 0;
  //         });
  //       }

  //       if (showMaxMin && (axis.orient() === "top" || axis.orient() === "bottom")) {
  //         var maxMinRange = [];
  //         wrap.selectAll("g.nv-axisMaxMin").each(function (d, i) {
  //           try {
  //             if (i) // i== 1, max position
  //               maxMinRange.push(scale(d) - this.getBBox().width - 4);else // i==0, min position
  //               maxMinRange.push(scale(d) + this.getBBox().width + 4);
  //           } catch (err) {
  //             if (i) // i== 1, max position
  //               maxMinRange.push(scale(d) - 4);else // i==0, min position
  //               maxMinRange.push(scale(d) + 4);
  //           }
  //         });
  //         g.selectAll("g") // the g's wrapping each tick
  //         .each(function (d, i) {
  //           if (scale(d) < maxMinRange[0] || scale(d) > maxMinRange[1]) {
  //             if (d > 1e-10 || d < -1e-10) // accounts for minor floating point errors... though could be problematic if the scale is EXTREMELY SMALL
  //               d3.select(this).remove();else d3.select(this).select("text").remove(); // Don't remove the ZERO line!!
  //           }
  //         });
  //       }


  //       //highlight zero line ... Maybe should not be an option and should just be in CSS?
  //       if (highlightZero) g.selectAll(".tick").filter(function (d) {
  //         return !parseFloat(Math.round(d.__data__ * 100000) / 1000000) && d.__data__ !== undefined;
  //       }) //this is because sometimes the 0 tick is a very small fraction, TODO: think of cleaner technique
  //       .classed("zero", true);

  //       //store old scales for use in transitions on update
  //       scale0 = scale.copy();
  //     });

  //     return chart;
  //   }


  //   //============================================================
  //   // Expose Public Variables
  //   //------------------------------------------------------------

  //   // expose chart's sub-components
  //   chart.axis = axis;

  //   d3.rebind(chart, axis, "orient", "tickValues", "tickSubdivide", "tickSize", "tickPadding", "tickFormat");
  //   d3.rebind(chart, scale, "domain", "range", "rangeBand", "rangeBands"); //these are also accessible by chart.scale(), but added common ones directly for ease of use

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

  //   chart.ticks = function (_) {
  //     if (!arguments.length) return ticks;
  //     ticks = _;
  //     return chart;
  //   };

  //   chart.height = function (_) {
  //     if (!arguments.length) return height;
  //     height = _;
  //     return chart;
  //   };

  //   chart.axisLabel = function (_) {
  //     if (!arguments.length) return axisLabelText;
  //     axisLabelText = _;
  //     return chart;
  //   };

  //   chart.showMaxMin = function (_) {
  //     if (!arguments.length) return showMaxMin;
  //     showMaxMin = _;
  //     return chart;
  //   };

  //   chart.highlightZero = function (_) {
  //     if (!arguments.length) return highlightZero;
  //     highlightZero = _;
  //     return chart;
  //   };

  //   chart.scale = function (_) {
  //     if (!arguments.length) return scale;
  //     scale = _;
  //     axis.scale(scale);
  //     isOrdinal = typeof scale.rangeBands === "function";
  //     d3.rebind(chart, scale, "domain", "range", "rangeBand", "rangeBands");
  //     return chart;
  //   };

  //   chart.rotateYLabel = function (_) {
  //     if (!arguments.length) return rotateYLabel;
  //     rotateYLabel = _;
  //     return chart;
  //   };

  //   chart.rotateLabels = function (_) {
  //     if (!arguments.length) return rotateLabels;
  //     rotateLabels = _;
  //     return chart;
  //   };

  //   chart.staggerLabels = function (_) {
  //     if (!arguments.length) return staggerLabels;
  //     staggerLabels = _;
  //     return chart;
  //   };

  //   chart.axisLabelDistance = function (_) {
  //     if (!arguments.length) return axisLabelDistance;
  //     axisLabelDistance = _;
  //     return chart;
  //   };

  //   //============================================================


  //   return chart;
  // };

nv.models.axis = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var axis = d3.svg.axis();

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 75 //only used for tickLabel currently
    ,
        height = 60 //only used for tickLabel currently
    ,
        scale = d3.scale.linear(),
        axisLabelText = null,
        showMaxMin = true //TODO: showMaxMin should be disabled on all ordinal scaled axes
    ,
        highlightZero = true,
        rotateLabels = 0,
        rotateYLabel = true,
        staggerLabels = false,
        isOrdinal = false,
        ticks = null,
        axisLabelDistance = 12 //The larger this number is, the closer the axis label is to the axis.
    ;

    axis.scale(scale).orient("bottom").tickFormat(
      // d3.format("e")
      function (d) {
        if(isNaN(new Number(d))) return d;
        // var power = 0;
        var m = new Number(d);
        // while(m>10){power++; m =m/10}
        if(m<9999){

          if(isNaN(new Number(d))) return d;
          m = new Number(d)
          // console.log(d,m,new Number(m.toFixed(0)))
          
          return (Math.abs(new Number(m.toFixed(0))-m) < 0.001 )? m.toFixed(0) : m.toFixed(2)
        }
        if(m<9999999){return (d/1000).toFixed(2)+"K"}
        if(m<9999999999){return (d/1000000).toFixed(2)+"M"}
        return  (d/1000000000).toFixed(2)+"G" 
        // return d;
      }
    );

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var scale0;

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var container = d3.select(this);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-axis").data([data]);
        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-axis");
        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        //------------------------------------------------------------


        if (ticks !== null) axis.ticks(ticks);else if (axis.orient() == "top" || axis.orient() == "bottom") axis.ticks(Math.abs(scale.range()[1] - scale.range()[0]) / 100);


        //TODO: consider calculating width/height based on whether or not label is added, for reference in charts using this component


        g.transition().call(axis);

        scale0 = scale0 || axis.scale();

        var fmt = axis.tickFormat();
        if (fmt == null) {
          fmt = scale0.tickFormat();
        }

        var axisLabel = g.selectAll("text.nv-axislabel").data([axisLabelText || null]);
        axisLabel.exit().remove();
        switch (axis.orient()) {
          case "top":
            axisLabel.enter().append("text").attr("class", "nv-axislabel");
            var w = scale.range().length == 2 ? scale.range()[1] : scale.range()[scale.range().length - 1] + (scale.range()[1] - scale.range()[0]);
            axisLabel.attr("text-anchor", "middle").attr("y", 0).attr("x", w / 2);
            if (showMaxMin) {
              var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
              axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text");
              axisMaxMin.exit().remove();
              axisMaxMin.attr("transform", function (d, i) {
                return "translate(" + scale(d) + ",0)";
              }).select("text")
                .attr("dy", "-0.5em")
                .attr("y", -axis.tickPadding())
                .attr("text-anchor", "middle")
                .text(function (d, i) {
                var v = fmt(d);
                return ("" + v).match("NaN") ? "" : v;
              });
              axisMaxMin.transition().attr("transform", function (d, i) {
                return "translate(" + scale.range()[i] + ",0)";
              });
            }
            break;
          case "bottom":
            var xLabelMargin = 30;
            var maxTextWidth = 30;
            var xTicks = g.selectAll("g").select("text");
            if (rotateLabels % 360) {
              //Calculate the longest xTick width
              xTicks.each(function (d, i) {
                var width = this.getBBox().width;
                if (width > maxTextWidth) maxTextWidth = width;
              });
              //Convert to radians before calculating sin. Add 30 to margin for healthy padding.
              var sin = Math.abs(Math.sin(rotateLabels * Math.PI / 180));
              var xLabelMargin = (sin ? sin * maxTextWidth : maxTextWidth) + 30;
              //Rotate all xTicks
              xTicks.attr("transform", function (d, i, j) {
                return "rotate(" + rotateLabels + " 0,0)";
              }).style("text-anchor", rotateLabels % 360 > 0 ? "start" : "end");
            }
            axisLabel.enter().append("text").attr("class", "nv-axislabel");
            var w = scale.range().length == 2 ? scale.range()[1] : scale.range()[scale.range().length - 1] + (scale.range()[1] - scale.range()[0]);
            axisLabel.attr("text-anchor", "middle").attr("y", xLabelMargin).attr("x", w / 2);
            if (showMaxMin) {
              //if (showMaxMin && !isOrdinal) {
              var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin")
              //.data(scale.domain())
              .data([scale.domain()[0], scale.domain()[scale.domain().length - 1]]);
              axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text");
              axisMaxMin.exit().remove();
              axisMaxMin.attr("transform", function (d, i) {
                return "translate(" + (scale(d) + (isOrdinal ? scale.rangeBand() / 2 : 0)) + ",0)";
              }).select("text").attr("dy", ".71em").attr("y", axis.tickPadding()).attr("transform", function (d, i, j) {
                return "rotate(" + rotateLabels + " 0,0)";
              }).style("text-anchor", rotateLabels ? rotateLabels % 360 > 0 ? "start" : "end" : "middle").text(function (d, i) {
                var v = fmt(d);
                return ("" + v).match("NaN") ? "" : v;
              });
              axisMaxMin.transition().attr("transform", function (d, i) {
                //return 'translate(' + scale.range()[i] + ',0)'
                //return 'translate(' + scale(d) + ',0)'
                return "translate(" + (scale(d) + (isOrdinal ? scale.rangeBand() / 2 : 0)) + ",0)";
              });
            }
            if (staggerLabels) xTicks.attr("transform", function (d, i) {
              return "translate(0," + (i % 2 == 0 ? "0" : "12") + ")";
            });

            break;
          case "right":
            axisLabel.enter().append("text").attr("class", "nv-axislabel");
            axisLabel.style("text-anchor", rotateYLabel ? "middle" : "begin").attr("transform", rotateYLabel ? "rotate(90)" : "").attr("y", rotateYLabel ? -Math.max(margin.right, width) + 12 : -10) //TODO: consider calculating this based on largest tick width... OR at least expose this on chart
            .attr("x", rotateYLabel ? scale.range()[0] / 2 : axis.tickPadding());
            if (showMaxMin) {
              var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
              axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text").style("opacity", 0);
              axisMaxMin.exit().remove();
              axisMaxMin.attr("transform", function (d, i) {
                return "translate(0," + scale(d) + ")";
              }).select("text").attr("dy", ".32em").attr("y", 0).attr("x", axis.tickPadding()).style("text-anchor", "start").text(function (d, i) {
                var v = fmt(d);
                return ("" + v).match("NaN") ? "" : v;
              });
              axisMaxMin.transition().attr("transform", function (d, i) {
                return "translate(0," + scale.range()[i] + ")";
              }).select("text").style("opacity", 1);
            }
            break;
          case "left":
            /*
             //For dynamically placing the label. Can be used with dynamically-sized chart axis margins
             var yTicks = g.selectAll('g').select("text");
             yTicks.each(function(d,i){
             var labelPadding = this.getBBox().width + axis.tickPadding() + 16;
             if(labelPadding > width) width = labelPadding;
             });
             */
            axisLabel.enter().append("text").attr("class", "nv-axislabel");
            axisLabel.style("text-anchor", rotateYLabel ? "middle" : "end").attr("transform", rotateYLabel ? "rotate(-90)" : "").attr("y", rotateYLabel ? -Math.max(margin.left, width) + axisLabelDistance : -10) //TODO: consider calculating this based on largest tick width... OR at least expose this on chart
            .attr("x", rotateYLabel ? -scale.range()[0] / 2 : -axis.tickPadding());
            if (showMaxMin) {
              var axisMaxMin = wrap.selectAll("g.nv-axisMaxMin").data(scale.domain());
              axisMaxMin.enter().append("g").attr("class", "nv-axisMaxMin").append("text").style("opacity", 0);
              axisMaxMin.exit().remove();
              axisMaxMin.attr("transform", function (d, i) {
                return "translate(0," + scale0(d) + ")";
              }).select("text").attr("dy", ".32em").attr("y", 0).attr("x", -axis.tickPadding()).attr("text-anchor", "end").text(function (d, i) {
                var v = fmt(d);
                return ("" + v).match("NaN") ? "" : v;
              });
              axisMaxMin.transition().attr("transform", function (d, i) {
                return "translate(0," + scale.range()[i] + ")";
              }).select("text").style("opacity", 1);
            }
            break;
        }
        axisLabel.text(function (d) {
          return d;
        });


        if (showMaxMin && (axis.orient() === "left" || axis.orient() === "right")) {
          //check if max and min overlap other values, if so, hide the values that overlap
          g.selectAll("g") // the g's wrapping each tick
          .each(function (d, i) {
            d3.select(this).select("text").attr("opacity", 1);
            if (scale(d) < scale.range()[1] + 10 || scale(d) > scale.range()[0] - 10) {
              // 10 is assuming text height is 16... if d is 0, leave it!
              if (d > 1e-10 || d < -1e-10) // accounts for minor floating point errors... though could be problematic if the scale is EXTREMELY SMALL
                d3.select(this).attr("opacity", 0);

              d3.select(this).select("text").attr("opacity", 0); // Don't remove the ZERO line!!
            }
          });

          //if Max and Min = 0 only show min, Issue #281
          if (scale.domain()[0] == scale.domain()[1] && scale.domain()[0] == 0) wrap.selectAll("g.nv-axisMaxMin").style("opacity", function (d, i) {
            return !i ? 1 : 0;
          });
        }

        if (showMaxMin && (axis.orient() === "top" || axis.orient() === "bottom")) {
          var maxMinRange = [];
          wrap.selectAll("g.nv-axisMaxMin").each(function (d, i) {
            try {
              if (i) // i== 1, max position
                maxMinRange.push(scale(d) - this.getBBox().width - 4);else // i==0, min position
                maxMinRange.push(scale(d) + this.getBBox().width + 4);
            } catch (err) {
              if (i) // i== 1, max position
                maxMinRange.push(scale(d) - 4);else // i==0, min position
                maxMinRange.push(scale(d) + 4);
            }
          });
          g.selectAll("g") // the g's wrapping each tick
          .each(function (d, i) {
            if (scale(d) < maxMinRange[0] || scale(d) > maxMinRange[1]) {
              if (d > 1e-10 || d < -1e-10) // accounts for minor floating point errors... though could be problematic if the scale is EXTREMELY SMALL
                d3.select(this).remove();else d3.select(this).select("text").remove(); // Don't remove the ZERO line!!
            }
          });
        }


        //highlight zero line ... Maybe should not be an option and should just be in CSS?
        if (highlightZero) g.selectAll(".tick").filter(function (d) {
          return !parseFloat(Math.round(d.__data__ * 100000) / 1000000) && d.__data__ !== undefined;
        }) //this is because sometimes the 0 tick is a very small fraction, TODO: think of cleaner technique
        .classed("zero", true);

        //store old scales for use in transitions on update
        scale0 = scale.copy();
      });

      return chart;
    }


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.axis = axis;

    d3.rebind(chart, axis, "orient", "tickValues", "tickSubdivide", "tickSize", "tickPadding", "tickFormat");
    d3.rebind(chart, scale, "domain", "range", "rangeBand", "rangeBands"); //these are also accessible by chart.scale(), but added common ones directly for ease of use

    chart.options = nv.utils.optionsFunc.bind(chart);

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

    chart.ticks = function (_) {
      if (!arguments.length) return ticks;
      ticks = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.axisLabel = function (_) {
      if (!arguments.length) return axisLabelText;
      axisLabelText = _;
      return chart;
    };

    chart.showMaxMin = function (_) {
      if (!arguments.length) return showMaxMin;
      showMaxMin = _;
      return chart;
    };

    chart.highlightZero = function (_) {
      if (!arguments.length) return highlightZero;
      highlightZero = _;
      return chart;
    };

    chart.scale = function (_) {
      if (!arguments.length) return scale;
      scale = _;
      axis.scale(scale);
      isOrdinal = typeof scale.rangeBands === "function";
      d3.rebind(chart, scale, "domain", "range", "rangeBand", "rangeBands");
      return chart;
    };

    chart.rotateYLabel = function (_) {
      if (!arguments.length) return rotateYLabel;
      rotateYLabel = _;
      return chart;
    };

    chart.rotateLabels = function (_) {
      if (!arguments.length) return rotateLabels;
      rotateLabels = _;
      return chart;
    };

    chart.staggerLabels = function (_) {
      if (!arguments.length) return staggerLabels;
      staggerLabels = _;
      return chart;
    };

    chart.axisLabelDistance = function (_) {
      if (!arguments.length) return axisLabelDistance;
      axisLabelDistance = _;
      return chart;
    };

    //============================================================


    return chart;
  };




  nv.models.map = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var 
        margin = { top: 0, right: 0, bottom: 0, left: 0 },
        
        width = 500,
        
        height = 500,
        
        getX = function (d) {
          return d.x;
        },
        
        getY = function (d) {
          return d.y;
        },
        
        getDescription = function (d) {
          return d.description;
        },
        
        id = Math.floor(Math.random() * 10000), //Create semi-unique ID in case user doesn't select one
    
        color = nv.utils.defaultColor(),
    
        projection = d3.geo.mercator(),
    
        path = d3.geo.path().projection(projection),
    
        zoom = d3.behavior.zoom(),
    
        tile = d3.geo.tile(),

        boundary,
    
        tileServerConnection = false,
    
        mapId = {
        "mapbox.streets" : "mapbox.streets",
        "mapbox.light"   : "mapbox.light",
        "mapbox.dark"    : "mapbox.dark",
        "mapbox.satellite" : "mapbox.satellite",
        "mapbox.streets-satellite" : "mapbox.streets-satellite",
        "mapbox.outdoors" : "mapbox.outdoors"
      },

      tileAccessToken = "pk.eyJ1IjoiYm9sZGFrIiwiYSI6InZrSEF6RXMifQ.c8WIV6zoinhXwXXY2cFurg",

      lockHighLight = false,

      showLabels = false,

      showValues = false,

      showTiles = true,

      locale = "en",

      selectedTiles = mapId["mapbox.outdoors"],

      interactive = true,

      defaultFill = "#f0f0f0",

      defaultFillOpacity = 0,

      defaultStroke = '#909095',

      defaultStrokeWidth = 1,

      defaultStrokeOpacity = 0.75,

      selectedFillOpacity = 0.5,

      selectedStrokeWidth = 3,

      valueIndex = 0,

      getValueIndex = function(){ return valueIndex },

      



      dispatch = d3.dispatch( 
          "mapMouseover", 
          "mapMouseout"
      );

    //============================================================
  

    //============================================================
   
    // projection.scale(sc / 2 / Math.PI).translate([width / 2, height / 1.3]);

    zoom.translate([0, 0]);
               

    var complementedColor = function (hex) {
      if (hex == undefined || hex== null) return defaultStroke;
      var color = hex.slice(1);
      try{
        color = parseInt(color, 16);
      } catch(e) {
        return defaultStroke;
      }  
      var r, g, b;
      if (hex.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (hex.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
       return "rgba(" + (255 - r) + "," + (255 - g) + "," + (255 - b) + ",1)";
    };

    var approximateLength = function (text, fontSize) {
      return text.length * fontSize * 0.6;
    };

    var getFontSize = function (element, data) {
      var bounds = path.bounds(data);
      var textWidth = element.clientWidth;
      var textHeight = element.clientHeight;
      var h1 = (bounds[1][1] - bounds[0][1]) * 0.1;
      var h2 = (bounds[1][0] - bounds[0][0]) * 0.1;
      h1 = (h1 > h2) ? h2 : h1;
      h1 = (h1 < 8) ? 8 : h1;
      h1 = (h1 > 24) ? 24 : h1;
      return h1;
    };


    var tryingToConnectTileServer = function(){
      d3.html("http://api.tiles.mapbox.com/v4/"
              + selectedTiles + "/"
              +  "0/0/0.png"
              + "?access_token=" + tileAccessToken, function(error){
                if(error){
                  tileServerConnection = false;
                  return;
                }
                tileServerConnection = true;
              })
    }

    var mergeBounds = function (bounds1,bounds2){
      if (bounds1 == undefined || bounds1 == null){
        return bounds2
      }
      if (bounds2 == undefined || bounds2 == null){
        return bounds1
      }
      return [[
              Math.min(bounds1[0][0],bounds2[0][0]),
              Math.min(bounds1[0][1],bounds2[0][1])
            ],
            [
              Math.max(bounds1[1][0],bounds2[1][0]),
              Math.max(bounds1[1][1],bounds2[1][1])
            ]]
    }

   

      var updateTiles = function (container,zoom,width,height){
        
        tile.size([width, height]);
        
        var tiles = tile
               .scale(zoom.scale())
               .translate(zoom.translate())
             ();  
        
        var image = container
               .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
               .selectAll("image")
               .data(tiles, function(d) {return d; });
  
         image.exit()
           .remove();
  
         image.enter().append("image")
           .attr("xlink:href", function(d) { 
              return "http://api.tiles.mapbox.com/v4/"
              + selectedTiles + "/"
              + d[2] + "/" + d[0] + "/" + d[1] + ".png"
              + "?access_token=" + tileAccessToken;
            })
           .attr("width", 1)
           .attr("height", 1)
           .attr("x", function(d) { return d[0]; })
           .attr("y", function(d) { return d[1]; });
      }

      var clearTiles =  function (container){ 
        container
          .selectAll("image")
          .data([])
          .exit()
          .remove();
      }   

    function chart(selection) {
      selection.each(function (data) {
        // console.log("Map model data", data)

        // find index of active serie
        valueIndex = -1;
        data[0].series.forEach(function(item,index){
          if(!item.disabled != undefined && item.disabled == false){
            valueIndex = index;
          }
        })

        
        valueIndex = (valueIndex == -1) ? 0 : valueIndex;

        

        // console.log("valueIndex", valueIndex)

        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            container = d3.select(this);

        
        
        // Setup containers and skeleton of chart

        var wrap = container
          .selectAll(".nv-wrap.nv-map")
          .data(data);

        var wrapEnter = wrap
          .enter()
          .append("g")
          .attr("class", "nvd3 nv-wrap nv-map nv-chart-" + id);

        var gEnter = wrapEnter
          .append("g");
       
        
        var g = wrap
          .select("g");

        var tileLayer = g.append("g")
          .attr ("class", "tileLayer");
        
        var pathContainer = gEnter
          .append("g");
        
        pathContainer
          .attr("class", "nv-map");

        wrapEnter
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        
        
        // get geojson from input data
        var geoData = data[0].features.filter(function(d){return !d.disabled})
        
        var tr = zoom.translate();
        
        if (tr[0] == 0 && tr[1] == 0) {
          projection.scale(1).translate([0,0]);

          // console.log("NV.MODEL", boundary)
          if(boundary && boundary.scale && boundary.translate ){
              zoom.scale(boundary.scale).translate(boundary.translate);
            
          }else{
            var selectionBounds;
            geoData.forEach(function (item, index) {
                selectionBounds = mergeBounds(selectionBounds,path.bounds(item)) 
            });          
          
            var   dx = selectionBounds[1][0] - selectionBounds[0][0],
                  
                  dy = selectionBounds[1][1] - selectionBounds[0][1],
                  
                  x = (selectionBounds[0][0] + selectionBounds[1][0]) / 2,
                  
                  y = (selectionBounds[0][1] + selectionBounds[1][1]) / 2,
                  
                  scale =2*Math.PI*Math.min(width/dx, height/dy),
             
                  translate = [(width/2-(scale*x/2/Math.PI)), (height/2-(scale*y/2/Math.PI))];
             
            zoom.scale(scale).translate(translate);
          }
        }

// remove scope outlines if tiles shows
// 
        if ( d3.geo.tileServerEnable && showTiles ) {
          geoData = geoData.filter(function(item){return (item.properties.values) ? true : false})
        }



// render regions
        var geo = g
          .select(".nv-map")
          .selectAll("path.map-subunit")
          .data(geoData);

        geo
          .exit()
          .remove();

        geo
          .enter()
          .append("path")
          .on("mouseover", function (d, i) {
              if (lockHighLight) return;
              if(!d.properties.values) return;
              d3.select(this)
                .transition()
                .style("stroke", function (d) {
                  return (d.properties.values) ? 
                    complementedColor(color(d, d.properties.values[valueIndex].c)) :
                    defaultStroke;
                })
                .style("stroke-opacity", defaultStrokeOpacity)
                .style("stroke-width", selectedStrokeWidth);
              dispatch.mapMouseover({
                point: d,
                index : getValueIndex,
                series: data[0].series,
                pos: [d3.event.pageX, d3.event.pageY]
              });
          })
          .on("mouseout", function (d, i) {
            if (lockHighLight) return;
            d3.select(this)
              .transition()
              .style("stroke", defaultStroke)
              .style("stroke-opacity", defaultStrokeOpacity)
              .style("stroke-width", defaultStrokeWidth);
            dispatch.mapMouseout({
              point: d,
              index : getValueIndex,
              series: data[0].series,
              pos: [d3.event.pageX, d3.event.pageY]
            });
          });

     
        geo
          .transition()
          .attr("class", function (d, i) {
            return "map-subunit subunit-id-" + i;
          })
          .style("fill", function (d) {
            return (d.properties.values) ? 
              color(d, d.properties.values[valueIndex].c) :
              defaultFill; 
              
          })
          .style("fill-opacity", function (d) {
            return (d.properties.values) ? 
              selectedFillOpacity : 
              defaultFillOpacity;
          })
          .style("stroke-width", defaultStrokeWidth)
          .style("stroke", defaultStroke);

// end of render regions

        var highlightSubunit = function (d, i) {
          g.select(".nv-map").selectAll("path.subunit-id-" + i)
          .transition()
          .style("stroke", function (d) {
            return (d.properties.values) ? 
              complementedColor(color(d, d.properties.values[valueIndex].c)) : 
              defaultStroke;
          })
          .style("stroke-opacity", defaultStrokeOpacity)
          .style("stroke-width", selectedStrokeWidth);
        }

        var clearSubunit = function (d, i) {
          g.select(".nv-map").selectAll("path.subunit-id-" + i)
          .transition()
          .style("stroke", defaultStroke)
          .style("stroke-opacity", defaultStrokeOpacity)
          .style("stroke-width", defaultStrokeWidth);
        };

// render labels
        if(showLabels){ 

          var labels = g
          .select(".nv-map")
          .selectAll("text.nv-map-label")
          .data(geoData);

          labels
          .exit()
          .remove();


 
          labels.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("class", "nv-map-label")
            .attr("dy", "-.5em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .style("fill", "#01445A")
            // .style("font-weight","bold")
            .style("font-stretch","ultra-condensed")
            .style("stroke", "#ffffff")
            .style("stroke-opacity", 0.25)
            .style("stroke-width", 5)
            .on("mouseover", function (d, i) {
              if (lockHighLight) return;
              if(!d.properties.values) return;
              highlightSubunit(d, i);
              dispatch.mapMouseover({
                point: d,
                index : getValueIndex,
                series: data[0].series,
                pos: [d3.event.pageX, d3.event.pageY] 
              });
            })
            .on("mouseout", function (d, i) {
              if (lockHighLight) return;
              clearSubunit(d, i);
              dispatch.mapMouseout({
                point: d,
                index : getValueIndex,
                series: data[0].series,
                pos: [d3.event.pageX, d3.event.pageY] //,
              });
            });


          
          labels 
            .transition() 
            .attr("transform", function (d) {
              var position = path.centroid(d);
              return "translate(" + position[0] + "," + position[1] + ")";
            })
            .text(function (d, i) {
              
              var fontSize = getFontSize(labels[0][i], d);
              var w = approximateLength(d.properties.name[locale], fontSize);
              var bounds = path.bounds(d);
              if (w * 1.2 > bounds[1][0] - bounds[0][0]) {
                return d.properties.geocode;
              } else {
                return d.properties.name[locale];
              }
            })
            .style("font-size", function (d, i) {
              var fontSize = getFontSize(labels[0][i], d);
              return fontSize + "px";
            })
            .style("opacity", function (d, i) {
              // var bounds = path.bounds(d);
              // var opct = labels[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
              // opct = getFontSize(labels[0][i], d) < 10 ? 0 : opct;
              // return opct;
              return 1;
            })  
            
        }

// end of render labels    
// 
// render values        
        
        if (showValues){    

          var values = g
            .select(".nv-map")
            .selectAll("text.nv-map-value")
            .data(geoData);

          values
            .exit()
            .remove();  

          values
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("class", "nv-map-value")
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .style("stroke-opacity", 0)
            .style("font", "bold Arial")
            .style("fill", "#01445A")
            // .style("font-weight","bold")
            .style("font-stretch","ultra-condensed")
            .style("stroke", "#ffffff")
            .style("stroke-opacity", 0.15)
            .style("stroke-width", 5)
            .style("opacity", 0)
            .on("mouseover", function (d, i) {
              if (lockHighLight) return;
              if(!d.properties.values) return;
              highlightSubunit(d, i);
              dispatch.mapMouseover({
                point: d,
                index : getValueIndex,
                series: data[0].series,
                pos: [d3.event.pageX, d3.event.pageY] //,
              });
            })
            .on("mouseout", function (d, i) {
              if (lockHighLight) return;
              clearSubunit(d, i);
              dispatch.mapMouseout({
                point: d,
                index : getValueIndex,
                series: data[0].series,
                pos: [d3.event.pageX, d3.event.pageY] //,
              });
            });

          values
            .transition()
            .text(function (d) {
              return (d.properties.values) ?
                new Number(d.properties.values[valueIndex].v).toFixed(2) : 
                ""
            })
            .style("font-size", function (d, i) {
              return getFontSize(values[0][i], d) + "px";
            })
            .attr("transform", function (d) {
              var position = path.centroid(d);
              return "translate(" + position[0] + "," + position[1] + ")";
            })
            .style("opacity", function (d, i) {
              // var bounds = path.bounds(d);
              // var opct = values[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
              // opct = getFontSize(values[0][i], d) < 12 ? 0 : opct;
              // return opct;
              return 1;
            })

            
        }    

   



        var beforeZoom = function () {
          lockHighLight = true;
          geo.transition().style("fill-opacity", 0);
          if ( showLabels ) labels.transition().text("");
          if ( showValues ) values.transition().text("");
          if ( d3.geo.tileServerEnable && showTiles ) clearTiles(g.select("g.tileLayer"));
        };

        var zoomed = function () {
          projection.scale(zoom.scale() / 2 / Math.PI).translate(zoom.translate());
          geo.transition().attr("d", path);
        };

        var afterZoom = function () {
         
         boundary = {
            scale : zoom.scale(),
            translate : zoom.translate()
         } 
         
         // console.log("NV.MODEL boundary after zoom", boundary)
         
         projection.scale(zoom.scale() / 2 / Math.PI).translate(zoom.translate());
 
          geo
            .transition()
            .attr("d", path)
            .style("fill-opacity", function (d) {
              return (d.properties.values) ? 
                     selectedFillOpacity : 
                     defaultFillOpacity; 
            })
            .style("stroke-width", defaultStrokeWidth)
            .style("fill", function (d) {
              return (d.properties.values) ? 
                     color(d, d.properties.values[valueIndex].c) : 
                     defaultFill; 
            });

          if ( showLabels ) { 
            labels 
            .transition() 
            .attr("transform", function (d) {
              var position = path.centroid(d);
              return "translate(" + position[0] + "," + position[1] + ")";
            })
            .text(function (d, i) {
              var fontSize = getFontSize(labels[0][i], d);
              var w = approximateLength(d.properties.name[locale], fontSize);
              var bounds = path.bounds(d);
              if (w * 1.2 > bounds[1][0] - bounds[0][0]) {
                return d.properties.geocode
              } else {
                return d.properties.name[locale];
              }
            })
            .style("font-size", function (d, i) {
              var fontSize = getFontSize(labels[0][i], d);
              return fontSize + "px";
            })
            .style("opacity", function (d, i) {
              return 1;
              // var bounds = path.bounds(d);
              // var opct = labels[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
              // opct = getFontSize(labels[0][i], d) < 10 ? 0 : opct;
              // return opct;
            })  
          }  

          if ( showValues ){
            values
            .transition()
            .text(function (d) {
              return (d.properties.values) ? 
               new Number(d.properties.values[valueIndex].v).toFixed(2) :
                ""
            })
            .style("font-size", function (d, i) {
              return getFontSize(values[0][i], d) + "px";
            })
            .attr("transform", function (d) {
              var position = path.centroid(d);
              return "translate(" + position[0] + "," + position[1] + ")";
            })
            .style("opacity", function (d, i) {
              // var bounds = path.bounds(d);
              // var opct = values[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
              // opct = getFontSize(values[0][i], d) < 12 ? 0 : opct;
              // return opct;
              return 1;
            })
          }
          if ( d3.geo.tileServerEnable && showTiles ) updateTiles(g.select("g.tileLayer"),zoom,width,height);
          lockHighLight = false;
        };

        zoom
          .on("zoomstart", beforeZoom)
          .on("zoom", zoomed)
          .on("zoomend", afterZoom);
        
        g.select(".nv-map").call(zoom);
        afterZoom();
      });

      return chart;
    }



    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.dispatch = dispatch;

    chart.options = nv.utils.optionsFunc.bind(chart);

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

    chart.locale = function (_) {
      if (!arguments.length) return locale;
      locale = _;
      return chart;
    };

    chart.showLabels = function (_) {
      if (!arguments.length) return showLabels;
      showLabels = _;
      return chart;
    };

    chart.showValues = function (_) {
      if (!arguments.length) return showValues;
      showValues = _;
      return chart;
    };

    chart.showTiles = function (_) {
      if (!arguments.length) return showTiles;
      showTiles = _;
      return chart;
    };

    chart.selectedTiles = function (_) {
      // console.log("selectedTiles map", _ , mapId[_])
      if (!arguments.length) return mapId[selectedTiles];
      selectedTiles = mapId[_];
      return chart;
    };

    chart.interactive = function (_) {
      if (!arguments.length) return interactive;
      interactive = _;
      return chart;
    };

    chart.defaultFill = function (_) {
      if (!arguments.length) return defaultFill;
      defaultFill = _;
      return chart;
    };
    
    chart.defaultFillOpacity = function (_) {
      // console.log("defaultFillOpacity map",_)
      if (!arguments.length) return defaultFillOpacity;
      defaultFillOpacity = _;
      return chart;
    };

    chart.defaultStrokeWidth = function (_) {
      if (!arguments.length) return defaultStrokeWidth;
      defaultStrokeWidth = _;
      return chart;
    };

    chart.defaultStrokeOpacity = function (_) {
      if (!arguments.length) return defaultStrokeOpacity;
      defaultStrokeOpacity = _;
      return chart;
    };

    chart.selectedFillOpacity = function (_) {
      if (!arguments.length) return selectedFillOpacity;
      selectedFillOpacity = _;
      return chart;
    };

    chart.selectedStrokeWidth = function (_) {
      if (!arguments.length) return selectedStrokeWidth;
      selectedStrokeWidth = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) return getX;
      getX = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return getY;
      getY = d3.functor(_);
      return chart;
    };

    chart.id = function (_) {
      if (!arguments.length) return id;
      id = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) return color;
      color = nv.utils.getColor(_);
      return chart;
    };

    chart.boundary = function (_) {
      if (!arguments.length) return boundary;
      boundary = _;
      return chart;
    };

  
    //============================================================

    //console.log(topojson);
    return chart;
  };

  
  nv.models.mapChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------
    //console.log('mapChart ', topojson);
    var map = nv.models.map(),
        legend = nv.models.legend(),
        locale = "en",
        colorScheme = nv.models.colorScheme();
    
    legend.radioButtonMode(true);

    var margin = { top: 30, right: 20, bottom: 20, left: 20 },
        width = null,
        height = null,
        showLegend = true,
        color = nv.utils.defaultColor(),
        tooltips = true,
        tooltip = function (key, y, e, graph) {
      return "<h3>" + key + "</h3>" + "<p>" + y + "</p>";
    },
        state = {},
        defaultState = null,
        noData = "No Data Available.",
        dispatch = d3.dispatch("tooltipShow", "tooltipHide", "stateChange", "changeState");

    //============================================================


    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var showTooltip = function (e, offsetElement) {
      //console.log("showTooltip",e,offsetElement.offsetLeft,offsetElement.offsetTop)
      var tooltipLabel = e.point; //map.description()(e.point) || map.x()(e.point);
      var left = e.pos[0],

      //+ (offsetElement && offsetElement.offsetLeft || 0),
      top = e.pos[1] - 30,

      //+ (offsetElement && offsetElement.offsetTop || 0),

      //var left = (offsetElement && offsetElement.offsetLeft || 0),
      //  top = (offsetElement && offsetElement.offsetTop || 0),

      //y = map.valueFormat()(map.y()(e.point)),
      content = tooltip(tooltipLabel, " !!!!", e, chart);

      nv.tooltip.show([left, top], content, e.value < 0 ? "n" : "s", null, offsetElement, "xy-tooltip with-3d-shadow with-transitions");
    };

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        if(!data.length || data.length == 0) return;
        // console.log("MAP CHART", data);


        var container = d3.select(this),
            that = this;

            container.style("border","1px solid #eeeeee")

        var availableWidth = (width || parseInt(container.style("width")) || 960) - margin.left - margin.right,
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;

        chart.update = function () {
          container.transition().call(chart);
        };
        
        chart.container = this;



        //set state.disabled
        state.disabled = data[0].series.map(function (d) {
          return !!d.disabled;
        });

        if (!defaultState) {
          var key;
          defaultState = {};
          for (key in state) {
            if (state[key] instanceof Array) defaultState[key] = state[key].slice(0);else defaultState[key] = state[key];
          }
        }

        //------------------------------------------------------------
        // Display No Data message if there's nothing to show.

        if (!data || !data.length) {
          var noDataText = container.selectAll(".nv-noData").data([noData]);

          noDataText.enter().append("text").attr("class", "nvd3 nv-noData").attr("dy", "-.7em").style("text-anchor", "middle");

          noDataText.attr("x", margin.left + availableWidth / 2).attr("y", margin.top + availableHeight / 2).text(function (d) {
            return d;
          });

          return chart;
        } else {
          container.selectAll(".nv-noData").remove();
        }

        //------------------------------------------------------------


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-wrap.nv-mapChart").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-mapChart");
        var g = wrap.select("g");

        var mapWrap = gEnter.append("g").attr("class", "nv-mapWrap");
        gEnter.append("g").attr("class", "nv-legendWrap");
        gEnter.append("g").attr("class", "nv-colorsWrap");
        gEnter.append("g").attr("class", "nv-infoWrap");
        //------------------------------------------------------------


        //------------------------------------------------------------
        // Legend
        showLegend = showLegend && data[0].series.length > 1;
        if (showLegend) {
          legend.width(availableWidth).key(function (d) {
            return d.key;
          })
          //.min(2)
          .color(function (d) {
            return "#238443";
          });

          wrap.select(".nv-legendWrap").datum(data[0].series).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }
          // wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        
          // wrap.select(".nvd3 .nv-legend").select("g").attr("transform", "translate(0,"+(-11)+")");
          wrap
            .select(".nvd3 .nv-legend")
            .select("g")
            .attr("transform", "translate(20,"+(10-margin.top)+")");
          
        }
        gEnter.attr("transform", "translate(0,"+margin.top+")");

        //------------------------------------------------------------
        //------------------------------------------------------------
        // Color Scheme
        var colorSchemeEnable = data[0].features.filter(function(item){ 
            return (item.properties.values) ? true : false
          }).length>1;  
        
        if(colorSchemeEnable){
          colorScheme
            .width(availableWidth)
            .color(color);
          
          wrap
            .select(".nv-colorsWrap")
            .datum(data[0].series)
            .call(colorScheme);
        }    
        
        var h = height || parseInt(container.style("height")) || 400;
        if(colorSchemeEnable){
          wrap.select(".nv-colorsWrap").attr("transform", "translate(" + 0 + "," + (h - 75) + ")");  
        }
          
        
        map.width(availableWidth - margin.left)
        .height(availableHeight);
        
        wrap.select(".nv-mapWrap")
        .datum(data).call(map);


        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        legend.dispatch.on("stateChange", function (newState) {
          state = newState;
          dispatch.stateChange(state);
          chart.update();
        });

        // Update chart from a state object passed to event handler
        dispatch.on("changeState", function (e) {
          if (typeof e.disabled !== "undefined") {
            data.series.forEach(function (series, i) {
              series.disabled = e.disabled[i];
            });

            state.disabled = e.disabled;
          }

          chart.update();
        });

        dispatch.on("tooltipShow", function (e) {
          // console.log("tooltipShow", e);

          if (tooltips) showTooltip(e);
        });
        //============================================================
      });

      return chart;
    }

    //============================================================
    // Event Handling/Dispatching (out of chart's scope)
    //------------------------------------------------------------
    //console.log("MAP DISPATCH",map.dispatch.on)
    map.dispatch.on("mapMouseover", function (e) {
      // console.log("mapMouseover", e);
      e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
      dispatch.tooltipShow(e);
    });

    map.dispatch.on("mapMouseout", function (e) {
      //e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
      dispatch.tooltipHide(e);
    });



    dispatch.on("tooltipHide", function () {
      if (tooltips) nv.tooltip.cleanup();
    });

    //============================================================


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    // expose chart's sub-components
    chart.legend = legend;
    chart.dispatch = dispatch;
    chart.map = map;

    d3.rebind(chart, map, "valueFormat", "labelFormat", "values", "x", "y", "description", "id", "showLabels", "donutLabelsOutside", "chordLabelsOutside", "labelType", "donut", "donutRatio", "labelThreshold");
    chart.options = nv.utils.optionsFunc.bind(chart);

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
      legend.color(color);
      map.color(color);
      return chart;
    };

    chart.boundary = function (_) {
      if (!arguments.length) return map.boundary();
      map.boundary(_);
      return chart;
    };

    chart.locale = function (_) {
      if (!arguments.length) return locale;
      locale = _;
      map.locale(locale);
      return chart;
    };

    chart.showLegend = function (_) {
      if (!arguments.length) return showLegend;
      showLegend = _;
      return chart;
    };

    chart.tooltips = function (_) {
      if (!arguments.length) return tooltips;
      tooltips = _;
      return chart;
    };

    chart.tooltipContent = function (_) {
      if (!arguments.length) return tooltip;
      tooltip = _;
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

    chart.noData = function (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };


     chart.showLabels = function (_) {
      if (!arguments.length) return map.showLabels();
      map.showLabels(_);
      return chart;
    };

    chart.showValues = function (_) {
      if (!arguments.length) return map.showValues();
      map.showValues(_);
      return chart;
    };

    chart.showTiles = function (_) {
      if (!arguments.length) return map.showTiles();
      map.showTiles(_);
      return chart;
    };

    chart.selectedTiles = function (_) {
      if (!arguments.length) return map.selectedTiles();
      map.selectedTiles(_);
      return chart;
    };

    chart.interactive = function (_) {
      if (!arguments.length) return map.interactive();
      map.interactive(_)
      return chart;
    };

    chart.defaultFill = function (_) {
      if (!arguments.length) return map.defaultFill();
      map.defaultFill(_)
      return chart;
    };
    
    chart.defaultFillOpacity = function (_) {
      // console.log("defaultFillOpacity chart", _)
      if (!arguments.length) return map.defaultFillOpacity();
      map.defaultFillOpacity(_)
      return chart;
    };

    chart.defaultStrokeWidth = function (_) {
      if (!arguments.length) return map.defaultStrokeWidth();
      map.defaultStrokeWidth(_)
      return chart;
    };

    chart.defaultStrokeOpacity = function (_) {
      if (!arguments.length) return map.defaultStrokeOpacity();
      map.defaultStrokeOpacity(_)
      return chart;
    };

    chart.selectedFillOpacity = function (_) {
      if (!arguments.length) return map.selectedFillOpacity();
      map.selectedFillOpacity(_)
      return chart;
    };

    chart.selectedStrokeWidth = function (_) {
      if (!arguments.length) return map.selectedStrokeWidth();
      map.selectedStrokeWidth(_)
      return chart;
    };


    //============================================================


    return chart;
  }


  //console.log("FINISH", nv)
  ;


// nv.models.multiBarChart = function() {
//   "use strict";
//   //============================================================
//   // Public Variables with Default Settings
//   //------------------------------------------------------------

//   var multibar = nv.models.multiBar()
//     , xAxis = nv.models.axis()
//     , yAxis = nv.models.axis()
//     , legend = nv.models.legend()
//     , controls = nv.models.legend()
//     ;

//   var margin = {top: 30, right: 20, bottom: 50, left: 60}
//     , width = null
//     , height = null
//     , color = nv.utils.defaultColor()
//     , showControls = true
//     , showLegend = true
//     , showXAxis = true
//     , showYAxis = true
//     , rightAlignYAxis = false
//     , reduceXTicks = true // if false a tick will show for every data point
//     , staggerLabels = false
//     , rotateLabels = 0
//     , tooltips = true
//     , tooltip = function(key, x, y, e, graph) {
//         return '<h3>' + key + '</h3>' +
//                '<p>' +  y + ' on ' + x + '</p>'
//       }
//     , x //can be accessed via chart.xScale()
//     , y //can be accessed via chart.yScale()
//     , state = { stacked: false }
//     , defaultState = null
//     , noData = "No Data Available."
//     , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
//     , controlWidth = function() { return showControls ? 180 : 0 }
//     , transitionDuration = 250
//     ;

//   multibar
//     .stacked(false)
//     ;
//   xAxis
//     .orient('bottom')
//     .tickPadding(7)
//     .highlightZero(true)
//     .showMaxMin(false)
//     .tickFormat(function(d) { return d })
//     ;
//   yAxis
//     .orient((rightAlignYAxis) ? 'right' : 'left')
//     .tickFormat(d3.format(',.1f'))
//     ;

//   controls.updateState(false);
//   //============================================================


//   //============================================================
//   // Private Variables
//   //------------------------------------------------------------

//   var showTooltip = function(e, offsetElement) {
//     var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
//         top = e.pos[1] + ( offsetElement.offsetTop || 0),
//         x = xAxis.tickFormat()(multibar.x()(e.point, e.pointIndex)),
//         y = yAxis.tickFormat()(multibar.y()(e.point, e.pointIndex)),
//         content = tooltip(e.series.key, x, y, e, chart);

//     nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
//   };

//   //============================================================


//   function chart(selection) {
//     selection.each(function(data) {
//       console.log("MultiBar", data)
//       var container = d3.select(this),
//           that = this;

//       var availableWidth = (width  || parseInt(container.style('width')) || 960)
//                              - margin.left - margin.right,
//           availableHeight = (height || parseInt(container.style('height')) || 400)
//                              - margin.top - margin.bottom;

//       chart.update = function() { container.transition().duration(transitionDuration).call(chart) };
//       chart.container = this;

//       //set state.disabled
//       state.disabled = data.map(function(d) { return !!d.disabled });

//       if (!defaultState) {
//         var key;
//         defaultState = {};
//         for (key in state) {
//           if (state[key] instanceof Array)
//             defaultState[key] = state[key].slice(0);
//           else
//             defaultState[key] = state[key];
//         }
//       }
//       //------------------------------------------------------------
//       // Display noData message if there's nothing to show.

//       if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
//         var noDataText = container.selectAll('.nv-noData').data([noData]);

//         noDataText.enter().append('text')
//           .attr('class', 'nvd3 nv-noData')
//           .attr('dy', '-.7em')
//           .style('text-anchor', 'middle');

//         noDataText
//           .attr('x', margin.left + availableWidth / 2)
//           .attr('y', margin.top + availableHeight / 2)
//           .text(function(d) { return d });

//         return chart;
//       } else {
//         container.selectAll('.nv-noData').remove();
//       }

//       //------------------------------------------------------------


//       //------------------------------------------------------------
//       // Setup Scales

//       x = multibar.xScale();
//       y = multibar.yScale();

//       //------------------------------------------------------------


//       //------------------------------------------------------------
//       // Setup containers and skeleton of chart

//       var wrap = container.selectAll('g.nv-wrap.nv-multiBarWithLegend').data([data]);
//       var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-multiBarWithLegend').append('g');
//       var g = wrap.select('g');

//       gEnter.append('g').attr('class', 'nv-x nv-axis');
//       gEnter.append('g').attr('class', 'nv-y nv-axis');
//       gEnter.append('g').attr('class', 'nv-barsWrap');
//       gEnter.append('g').attr('class', 'nv-legendWrap');
//       gEnter.append('g').attr('class', 'nv-controlsWrap');

//       //------------------------------------------------------------


//       //------------------------------------------------------------
//       // Legend

//       if (showLegend) {
//         legend.width(availableWidth - controlWidth());

//         if (multibar.barColor())
//           data.forEach(function(series,i) {
//             series.color = d3.rgb('#ccc').darker(i * 1.5).toString();
//           })

//         g.select('.nv-legendWrap')
//             .datum(data)
//             .call(legend);

//         if ( margin.top != legend.height()) {
//           margin.top = legend.height();
//           availableHeight = (height || parseInt(container.style('height')) || 400)
//                              - margin.top - margin.bottom;
//         }

//         g.select('.nv-legendWrap')
//             .attr('transform', 'translate(' + controlWidth() + ',' + (-margin.top) +')');
//       }

//       //------------------------------------------------------------


//       //------------------------------------------------------------
//       // Controls

//       if (showControls) {
//         var controlsData = [
//           { key: 'Grouped', disabled: multibar.stacked() },
//           { key: 'Stacked', disabled: !multibar.stacked() }
//         ];

//         controls.width(controlWidth()).color(['#444', '#444', '#444']);
//         g.select('.nv-controlsWrap')
//             .datum(controlsData)
//             .attr('transform', 'translate(0,' + (-margin.top) +')')
//             .call(controls);
//       }

//       //------------------------------------------------------------


//       wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//       if (rightAlignYAxis) {
//           g.select(".nv-y.nv-axis")
//               .attr("transform", "translate(" + availableWidth + ",0)");
//       }

//       //------------------------------------------------------------
//       // Main Chart Component(s)

//       multibar
//         .disabled(data.map(function(series) { return series.disabled }))
//         .width(availableWidth)
//         .height(availableHeight)
//         .color(data.map(function(d,i) {
//           return d.color || color(d, i);
//         }).filter(function(d,i) { return !data[i].disabled }))


//       var barsWrap = g.select('.nv-barsWrap')
//           .datum(data.filter(function(d) { return !d.disabled }))

//       barsWrap.transition().call(multibar);

//       //------------------------------------------------------------


//       //------------------------------------------------------------
//       // Setup Axes

//       if (showXAxis) {
//           xAxis
//             .scale(x)
//             .ticks( availableWidth / 100 )
//             .tickSize(-availableHeight, 0);

//           g.select('.nv-x.nv-axis')
//               .attr('transform', 'translate(0,' + y.range()[0] + ')');
//           g.select('.nv-x.nv-axis').transition()
//               .call(xAxis);

//           var xTicks = g.select('.nv-x.nv-axis > g').selectAll('g');

//           xTicks
//               .selectAll('line, text')
//               .style('opacity', 1)

//           if (staggerLabels) {
//               var getTranslate = function(x,y) {
//                   return "translate(" + x + "," + y + ")";
//               };

//               var staggerUp = 5, staggerDown = 17;  //pixels to stagger by
//               // Issue #140
//               xTicks
//                 .selectAll("text")
//                 .attr('transform', function(d,i,j) { 
//                     return  getTranslate(0, (j % 2 == 0 ? staggerUp : staggerDown));
//                   });

//               var totalInBetweenTicks = d3.selectAll(".nv-x.nv-axis .nv-wrap g g text")[0].length;
//               g.selectAll(".nv-x.nv-axis .nv-axisMaxMin text")
//                 .attr("transform", function(d,i) {
//                     return getTranslate(0, (i === 0 || totalInBetweenTicks % 2 !== 0) ? staggerDown : staggerUp);
//                 });
//           }

//           if (reduceXTicks)
//             xTicks
//               .filter(function(d,i) {
//                   return i % Math.ceil(data[0].values.length / (availableWidth / 100)) !== 0;
//                 })
//               .selectAll('text, line')
//               .style('opacity', 0);

//           if(rotateLabels)
//             xTicks
//               .selectAll('.tick text')
//               .attr('transform', 'rotate(' + rotateLabels + ' 0,0)')
//               .style('text-anchor', rotateLabels > 0 ? 'start' : 'end');
          
//           g.select('.nv-x.nv-axis').selectAll('g.nv-axisMaxMin text')
//               .style('opacity', 1);
//       }


//       if (showYAxis) {      
//           yAxis
//             .scale(y)
//             .ticks( availableHeight / 36 )
//             .tickSize( -availableWidth, 0);

//           g.select('.nv-y.nv-axis').transition()
//               .call(yAxis);
//       }


//       //------------------------------------------------------------



//       //============================================================
//       // Event Handling/Dispatching (in chart's scope)
//       //------------------------------------------------------------

//       legend.dispatch.on('stateChange', function(newState) { 
//         state = newState;
//         dispatch.stateChange(state);
//         chart.update();
//       });

//       controls.dispatch.on('legendClick', function(d,i) {
//         if (!d.disabled) return;
//         controlsData = controlsData.map(function(s) {
//           s.disabled = true;
//           return s;
//         });
//         d.disabled = false;

//         switch (d.key) {
//           case 'Grouped':
//             multibar.stacked(false);
//             break;
//           case 'Stacked':
//             multibar.stacked(true);
//             break;
//         }

//         state.stacked = multibar.stacked();
//         dispatch.stateChange(state);

//         chart.update();
//       });

//       dispatch.on('tooltipShow', function(e) {
//         if (tooltips) showTooltip(e, that.parentNode)
//       });

//       // Update chart from a state object passed to event handler
//       dispatch.on('changeState', function(e) {

//         if (typeof e.disabled !== 'undefined') {
//           data.forEach(function(series,i) {
//             series.disabled = e.disabled[i];
//           });

//           state.disabled = e.disabled;
//         }

//         if (typeof e.stacked !== 'undefined') {
//           multibar.stacked(e.stacked);
//           state.stacked = e.stacked;
//         }

//         chart.update();
//       });

//       //============================================================


//     });

//     return chart;
//   }


//   //============================================================
//   // Event Handling/Dispatching (out of chart's scope)
//   //------------------------------------------------------------

//   multibar.dispatch.on('elementMouseover.tooltip', function(e) {
//     e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
//     dispatch.tooltipShow(e);
//   });

//   multibar.dispatch.on('elementMouseout.tooltip', function(e) {
//     dispatch.tooltipHide(e);
//   });
//   dispatch.on('tooltipHide', function() {
//     if (tooltips) nv.tooltip.cleanup();
//   });

//   //============================================================


//   //============================================================
//   // Expose Public Variables
//   //------------------------------------------------------------

//   // expose chart's sub-components
//   chart.dispatch = dispatch;
//   chart.multibar = multibar;
//   chart.legend = legend;
//   chart.xAxis = xAxis;
//   chart.yAxis = yAxis;

//   d3.rebind(chart, multibar, 'x', 'y', 'xDomain', 'yDomain', 'xRange', 'yRange', 'forceX', 'forceY', 'clipEdge',
//    'id', 'stacked', 'stackOffset', 'delay', 'barColor','groupSpacing');

//   chart.options = nv.utils.optionsFunc.bind(chart);
  
//   chart.margin = function(_) {
//     if (!arguments.length) return margin;
//     margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
//     margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
//     margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
//     margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
//     return chart;
//   };

//   chart.width = function(_) {
//     if (!arguments.length) return width;
//     width = _;
//     return chart;
//   };

//   chart.height = function(_) {
//     if (!arguments.length) return height;
//     height = _;
//     return chart;
//   };

//   chart.color = function(_) {
//     if (!arguments.length) return color;
//     color = nv.utils.getColor(_);
//     legend.color(color);
//     return chart;
//   };

//   chart.showControls = function(_) {
//     if (!arguments.length) return showControls;
//     showControls = _;
//     return chart;
//   };

//   chart.showLegend = function(_) {
//     if (!arguments.length) return showLegend;
//     showLegend = _;
//     return chart;
//   };

//   chart.showXAxis = function(_) {
//     if (!arguments.length) return showXAxis;
//     showXAxis = _;
//     return chart;
//   };

//   chart.showYAxis = function(_) {
//     if (!arguments.length) return showYAxis;
//     showYAxis = _;
//     return chart;
//   };

//   chart.rightAlignYAxis = function(_) {
//     if(!arguments.length) return rightAlignYAxis;
//     rightAlignYAxis = _;
//     yAxis.orient( (_) ? 'right' : 'left');
//     return chart;
//   };

//   chart.reduceXTicks= function(_) {
//     if (!arguments.length) return reduceXTicks;
//     reduceXTicks = _;
//     return chart;
//   };

//   chart.rotateLabels = function(_) {
//     if (!arguments.length) return rotateLabels;
//     rotateLabels = _;
//     return chart;
//   }

//   chart.staggerLabels = function(_) {
//     if (!arguments.length) return staggerLabels;
//     staggerLabels = _;
//     return chart;
//   };

//   chart.tooltip = function(_) {
//     if (!arguments.length) return tooltip;
//     tooltip = _;
//     return chart;
//   };

//   chart.tooltips = function(_) {
//     if (!arguments.length) return tooltips;
//     tooltips = _;
//     return chart;
//   };

//   chart.tooltipContent = function(_) {
//     if (!arguments.length) return tooltip;
//     tooltip = _;
//     return chart;
//   };

//   chart.state = function(_) {
//     if (!arguments.length) return state;
//     state = _;
//     return chart;
//   };

//   chart.defaultState = function(_) {
//     if (!arguments.length) return defaultState;
//     defaultState = _;
//     return chart;
//   };
  
//   chart.noData = function(_) {
//     if (!arguments.length) return noData;
//     noData = _;
//     return chart;
//   };

//   chart.transitionDuration = function(_) {
//     if (!arguments.length) return transitionDuration;
//     transitionDuration = _;
//     return chart;
//   };

//   //============================================================


//   return chart;
// }

nv.models.multiBarChart = function() {
  "use strict";
  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var multibar = nv.models.multiBar()
    , xAxis = nv.models.axis()
    , yAxis = nv.models.axis()
    , legend = nv.models.legend()
    , controls = nv.models.legend()
    ;

  var margin = {top: 30, right: 20, bottom: 50, left: 60}
    , width = null
    , height = null
    , color = nv.utils.defaultColor()
    , showControls = true
    , showLegend = true
    , showXAxis = true
    , showYAxis = true
    , rightAlignYAxis = false
    , reduceXTicks = true // if false a tick will show for every data point
    , staggerLabels = false
    , rotateLabels = 0
    , tooltips = true
    , tooltip = function(key, x, y, e, graph) {
        return '<h3>' + key + '</h3>' +
               '<p>' +  y + ' on ' + x + '</p>'
      }
    , x //can be accessed via chart.xScale()
    , y //can be accessed via chart.yScale()
    , state = { stacked: false }
    , defaultState = null
    , noData = "No Data Available."
    , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
    , controlWidth = function() { return showControls ? 180 : 0 }
    , transitionDuration = 250
    ;

  multibar
    .stacked(false)
    ;
  xAxis
    .orient('bottom')
    .tickPadding(7)
    .highlightZero(true)
    .showMaxMin(false)
    .tickFormat(function(d) { return d })
    ;
  yAxis
    .orient((rightAlignYAxis) ? 'right' : 'left')
    .tickFormat(d3.format(',.1f'))
    ;

  controls.updateState(false);
  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var showTooltip = function(e, offsetElement) {
    var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
        top = e.pos[1] + ( offsetElement.offsetTop || 0),
        x = xAxis.tickFormat()(multibar.x()(e.point, e.pointIndex)),
        y = yAxis.tickFormat()(multibar.y()(e.point, e.pointIndex)),
        content = tooltip(e.series.key, x, y, e, chart);

    nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
  };

  //============================================================


  function chart(selection) {
    selection.each(function(data) {
      // console.log("BARSERIE",data);

      // convert date-time to formated string
      // 
      convertDateTime(data);
      
      //
      
      var container = d3.select(this),
          that = this;

      var availableWidth = (width  || parseInt(container.style('width')) || 960)
                             - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;

      chart.update = function() { container.transition().duration(transitionDuration).call(chart) };
      chart.container = this;

      //set state.disabled
      state.disabled = data.map(function(d) { return !!d.disabled });

      if (!defaultState) {
        var key;
        defaultState = {};
        for (key in state) {
          if (state[key] instanceof Array)
            defaultState[key] = state[key].slice(0);
          else
            defaultState[key] = state[key];
        }
      }
      //------------------------------------------------------------
      // Display noData message if there's nothing to show.

      if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
        var noDataText = container.selectAll('.nv-noData').data([noData]);

        noDataText.enter().append('text')
          .attr('class', 'nvd3 nv-noData')
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle');

        noDataText
          .attr('x', margin.left + availableWidth / 2)
          .attr('y', margin.top + availableHeight / 2)
          .text(function(d) { return d });

        return chart;
      } else {
        container.selectAll('.nv-noData').remove();
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Scales

      x = multibar.xScale();
      y = multibar.yScale();

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-multiBarWithLegend').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-multiBarWithLegend').append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-x nv-axis');
      gEnter.append('g').attr('class', 'nv-y nv-axis');
      gEnter.append('g').attr('class', 'nv-barsWrap');
      gEnter.append('g').attr('class', 'nv-legendWrap');
      gEnter.append('g').attr('class', 'nv-controlsWrap');

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Legend
      
      showLegend = showLegend && data.length > 1;

      if (showLegend) {
        legend.width(availableWidth - controlWidth());
        
        
        if (multibar.barColor())
          data.forEach(function(series,i) {
            series.color = d3.rgb('#ccc').darker(i * 1.5).toString();
          })

        g.select('.nv-legendWrap')
            .datum(data)
            .call(legend);

        if ( margin.top != legend.height()) {
          margin.top = legend.height();
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;
        }

        g.select('.nv-legendWrap')
            .attr('transform', 'translate(' + controlWidth() + ',' + (-margin.top) +')');
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Controls

      if (showControls) {
        var controlsData = [
          { key: 'Grouped', disabled: multibar.stacked() },
          { key: 'Stacked', disabled: !multibar.stacked() }
        ];

        controls.width(controlWidth()).color(['#444', '#444', '#444']);
        g.select('.nv-controlsWrap')
            .datum(controlsData)
            .attr('transform', 'translate(0,' + (-margin.top) +')')
            .call(controls);
      }

      //------------------------------------------------------------


      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      if (rightAlignYAxis) {
          g.select(".nv-y.nv-axis")
              .attr("transform", "translate(" + availableWidth + ",0)");
      }

      //------------------------------------------------------------
      // Main Chart Component(s)

      multibar
        .disabled(data.map(function(series) { return series.disabled }))
        .width(availableWidth)
        .height(availableHeight)
        .color(data.map(function(d,i) {
          return d.color || color(d, i);
        }).filter(function(d,i) { return !data[i].disabled }))


      var barsWrap = g.select('.nv-barsWrap')
          .datum(data.filter(function(d) { return !d.disabled }))

      barsWrap.transition().call(multibar);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Axes

      if (showXAxis) {
          xAxis
            .scale(x)
            .ticks( availableWidth / 100 )
            .tickSize(-availableHeight, 0);

          g.select('.nv-x.nv-axis')
              .attr('transform', 'translate(0,' + y.range()[0] + ')');
          g.select('.nv-x.nv-axis').transition()
              .call(xAxis);

          var xTicks = g.select('.nv-x.nv-axis > g').selectAll('g');

          xTicks
              .selectAll('line, text')
              .style('opacity', 1)

          if (staggerLabels) {
              var getTranslate = function(x,y) {
                  return "translate(" + x + "," + y + ")";
              };

              var staggerUp = 5, staggerDown = 17;  //pixels to stagger by
              // Issue #140
              xTicks
                .selectAll("text")
                .attr('transform', function(d,i,j) { 
                    return  getTranslate(0, (j % 2 == 0 ? staggerUp : staggerDown));
                  });

              var totalInBetweenTicks = d3.selectAll(".nv-x.nv-axis .nv-wrap g g text")[0].length;
              g.selectAll(".nv-x.nv-axis .nv-axisMaxMin text")
                .attr("transform", function(d,i) {
                    return getTranslate(0, (i === 0 || totalInBetweenTicks % 2 !== 0) ? staggerDown : staggerUp);
                });
          }

          if (reduceXTicks)
            xTicks
              .filter(function(d,i) {
                  return i % Math.ceil(data[0].values.length / (availableWidth / 100)) !== 0;
                })
              .selectAll('text, line')
              .style('opacity', 0);

          if(rotateLabels)
            xTicks
              .selectAll('.tick text')
              .attr('transform', 'rotate(' + rotateLabels + ' 0,0)')
              .style('text-anchor', rotateLabels > 0 ? 'start' : 'end');
          
          g.select('.nv-x.nv-axis').selectAll('g.nv-axisMaxMin text')
              .style('opacity', 1);
      }


      if (showYAxis) {      
          yAxis
            .scale(y)
            .ticks( availableHeight / 36 )
            .tickSize( -availableWidth, 0);

          g.select('.nv-y.nv-axis').transition()
              .call(yAxis);
      }


      //------------------------------------------------------------



      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      legend.dispatch.on('stateChange', function(newState) { 
        state = newState;
        dispatch.stateChange(state);
        chart.update();
      });

      controls.dispatch.on('legendClick', function(d,i) {
        if (!d.disabled) return;
        controlsData = controlsData.map(function(s) {
          s.disabled = true;
          return s;
        });
        d.disabled = false;

        switch (d.key) {
          case 'Grouped':
            multibar.stacked(false);
            break;
          case 'Stacked':
            multibar.stacked(true);
            break;
        }

        state.stacked = multibar.stacked();
        dispatch.stateChange(state);

        chart.update();
      });

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) showTooltip(e, that.parentNode)
      });

      // Update chart from a state object passed to event handler
      dispatch.on('changeState', function(e) {

        if (typeof e.disabled !== 'undefined') {
          data.forEach(function(series,i) {
            series.disabled = e.disabled[i];
          });

          state.disabled = e.disabled;
        }

        if (typeof e.stacked !== 'undefined') {
          multibar.stacked(e.stacked);
          state.stacked = e.stacked;
        }

        chart.update();
      });

      //============================================================


    });

    return chart;
  }


  //============================================================
  // Event Handling/Dispatching (out of chart's scope)
  //------------------------------------------------------------

  multibar.dispatch.on('elementMouseover.tooltip', function(e) {
    e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
    dispatch.tooltipShow(e);
  });

  multibar.dispatch.on('elementMouseout.tooltip', function(e) {
    dispatch.tooltipHide(e);
  });
  dispatch.on('tooltipHide', function() {
    if (tooltips) nv.tooltip.cleanup();
  });

  //============================================================


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.multibar = multibar;
  chart.legend = legend;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;

  d3.rebind(chart, multibar, 'x', 'y', 'xDomain', 'yDomain', 'xRange', 'yRange', 'forceX', 'forceY', 'clipEdge',
   'id', 'stacked', 'stackOffset', 'delay', 'barColor','groupSpacing');

  chart.options = nv.utils.optionsFunc.bind(chart);
  
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = nv.utils.getColor(_);
    legend.color(color);
    return chart;
  };

  chart.showControls = function(_) {
    if (!arguments.length) return showControls;
    showControls = _;
    return chart;
  };

  chart.showLegend = function(_) {
    if (!arguments.length) return showLegend;
    showLegend = _;
    return chart;
  };

  chart.showXAxis = function(_) {
    if (!arguments.length) return showXAxis;
    showXAxis = _;
    return chart;
  };

  chart.showYAxis = function(_) {
    if (!arguments.length) return showYAxis;
    showYAxis = _;
    return chart;
  };

  chart.rightAlignYAxis = function(_) {
    if(!arguments.length) return rightAlignYAxis;
    rightAlignYAxis = _;
    yAxis.orient( (_) ? 'right' : 'left');
    return chart;
  };

  chart.reduceXTicks= function(_) {
    if (!arguments.length) return reduceXTicks;
    reduceXTicks = _;
    return chart;
  };

  chart.rotateLabels = function(_) {
    if (!arguments.length) return rotateLabels;
    rotateLabels = _;
    return chart;
  }

  chart.staggerLabels = function(_) {
    if (!arguments.length) return staggerLabels;
    staggerLabels = _;
    return chart;
  };

  chart.tooltip = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) return tooltips;
    tooltips = _;
    return chart;
  };

  chart.tooltipContent = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.state = function(_) {
    if (!arguments.length) return state;
    state = _;
    return chart;
  };

  chart.defaultState = function(_) {
    if (!arguments.length) return defaultState;
    defaultState = _;
    return chart;
  };
  
  chart.noData = function(_) {
    if (!arguments.length) return noData;
    noData = _;
    return chart;
  };

  chart.transitionDuration = function(_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return chart;
  };

  //============================================================


  return chart;
}

nv.models.multiBarHorizontal = function() {
  "use strict";
  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 0, right: 0, bottom: 0, left: 0}
    , width = 960
    , height = 500
    , id = Math.floor(Math.random() * 10000) //Create semi-unique ID in case user doesn't select one
    , x = d3.scale.ordinal()
    , y = d3.scale.linear()
    , getX = function(d) { return d.x }
    , getY = function(d) { return d.y }
    , forceY = [0] // 0 is forced by default.. this makes sense for the majority of bar graphs... user can always do chart.forceY([]) to remove
    , color = nv.utils.defaultColor()
    , barColor = null // adding the ability to set the color for each rather than the whole group
    , disabled // used in conjunction with barColor to communicate from multiBarHorizontalChart what series are disabled
    , stacked = false
    , showValues = false
    , showBarLabels = false
    , valuePadding = 60
    , valueFormat = d3.format(',.2f')
    , delay = 1200
    , xDomain
    , yDomain
    , xRange
    , yRange
    , dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout')
    ;

  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var x0, y0 //used to store previous scales
      ;

  //============================================================


  function chart(selection) {
    selection.each(function(data) {



      var availableWidth = width - margin.left - margin.right,
          availableHeight = height - margin.top - margin.bottom,
          container = d3.select(this);


      if (stacked)
        data = d3.layout.stack()
                 .offset('zero')
                 .values(function(d){ return d.values })
                 .y(getY)
                 (data);


      //add series index to each data point for reference
      data.forEach(function(series, i) {
        series.values.forEach(function(point) {
          point.series = i;
        });
      });



      //------------------------------------------------------------
      // HACK for negative value stacking
      if (stacked)
        data[0].values.map(function(d,i) {
          var posBase = 0, negBase = 0;
          data.map(function(d) {
            var f = d.values[i]
            f.size = Math.abs(f.y);
            if (f.y<0)  {
              f.y1 = negBase - f.size;
              negBase = negBase - f.size;
            } else
            {
              f.y1 = posBase;
              posBase = posBase + f.size;
            }
          });
        });

      // calc real left margin
      // 

      // console.log("HBAR DATA",data)
      // var leftMargin;

      // data.forEach(function(serie){
      //   var current = serie.values.map(function(item){return nv.utils.calcApproxTextWidth})
      //   leftMargin
      // })
            
      
      //------------------------------------------------------------
      // Setup Scales

      // remap and flatten the data for use in calculating the scales' domains
      var seriesData = (xDomain && yDomain) ? [] : // if we know xDomain and yDomain, no need to calculate
            data.map(function(d) {
              return d.values.map(function(d,i) {
                return { x: getX(d,i), y: getY(d,i), y0: d.y0, y1: d.y1 }
              })
            });

      x   .domain(xDomain || d3.merge(seriesData).map(function(d) { return d.x }))
          .rangeBands(xRange || [0, availableHeight], .1);

      //y   .domain(yDomain || d3.extent(d3.merge(seriesData).map(function(d) { return d.y + (stacked ? d.y0 : 0) }).concat(forceY)))
      y   .domain(yDomain || d3.extent(d3.merge(seriesData).map(function(d) { return stacked ? (d.y > 0 ? d.y1 + d.y : d.y1 ) : d.y }).concat(forceY)))

      if (showValues && !stacked)
        y.range(yRange || [(y.domain()[0] < 0 ? valuePadding : 0), availableWidth - (y.domain()[1] > 0 ? valuePadding : 0) ]);
      else
        y.range(yRange || [0, availableWidth]);

      x0 = x0 || x;
      y0 = y0 || d3.scale.linear().domain(y.domain()).range([y(0),y(0)]);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = d3.select(this).selectAll('g.nv-wrap.nv-multibarHorizontal').data([data]);
      var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-multibarHorizontal');
      var defsEnter = wrapEnter.append('defs');
      var gEnter = wrapEnter.append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-groups');

      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      //------------------------------------------------------------



      var groups = wrap.select('.nv-groups').selectAll('.nv-group')
          .data(function(d) { return d }, function(d,i) { return i });
      groups.enter().append('g')
          .style('stroke-opacity', 1e-6)
          .style('fill-opacity', 1e-6);
      groups.exit().transition()
          .style('stroke-opacity', 1e-6)
          .style('fill-opacity', 1e-6)
          .remove();
      groups
          .attr('class', function(d,i) { return 'nv-group nv-series-' + i })
          .classed('hover', function(d) { return d.hover })
          .style('fill', function(d,i){ return color(d, i) })
          .style('stroke', function(d,i){ return color(d, i) });
      groups.transition()
          .style('stroke-opacity', 1)
          .style('fill-opacity', .75);


      var bars = groups.selectAll('g.nv-bar')
          .data(function(d) { return d.values });

      bars.exit().remove();


      var barsEnter = bars.enter().append('g')
          .attr('transform', function(d,i,j) {
              return 'translate(' + y0(stacked ? d.y0 : 0) + ',' + (stacked ? 0 : (j * x.rangeBand() / data.length ) + x(getX(d,i))) + ')'
          });

      barsEnter.append('rect')
          .attr('width', 0)
          .attr('height', x.rangeBand() / (stacked ? 1 : data.length) )

      bars
          .on('mouseover', function(d,i) { //TODO: figure out why j works above, but not here
            d3.select(this).classed('hover', true);
            dispatch.elementMouseover({
              value: getY(d,i),
              point: d,
              series: data[d.series],
              pos: [ y(getY(d,i) + (stacked ? d.y0 : 0)), x(getX(d,i)) + (x.rangeBand() * (stacked ? data.length / 2 : d.series + .5) / data.length) ],
              pointIndex: i,
              seriesIndex: d.series,
              e: d3.event
            });
          })
          .on('mouseout', function(d,i) {
            d3.select(this).classed('hover', false);
            dispatch.elementMouseout({
              value: getY(d,i),
              point: d,
              series: data[d.series],
              pointIndex: i,
              seriesIndex: d.series,
              e: d3.event
            });
          })
          .on('click', function(d,i) {
            dispatch.elementClick({
              value: getY(d,i),
              point: d,
              series: data[d.series],
              pos: [x(getX(d,i)) + (x.rangeBand() * (stacked ? data.length / 2 : d.series + .5) / data.length), y(getY(d,i) + (stacked ? d.y0 : 0))],  // TODO: Figure out why the value appears to be shifted
              pointIndex: i,
              seriesIndex: d.series,
              e: d3.event
            });
            d3.event.stopPropagation();
          })
          .on('dblclick', function(d,i) {
            dispatch.elementDblClick({
              value: getY(d,i),
              point: d,
              series: data[d.series],
              pos: [x(getX(d,i)) + (x.rangeBand() * (stacked ? data.length / 2 : d.series + .5) / data.length), y(getY(d,i) + (stacked ? d.y0 : 0))],  // TODO: Figure out why the value appears to be shifted
              pointIndex: i,
              seriesIndex: d.series,
              e: d3.event
            });
            d3.event.stopPropagation();
          });


      barsEnter.append('text');

      if (showValues && !stacked) {
        bars.select('text')
            .attr('text-anchor', function(d,i) { return getY(d,i) < 0 ? 'end' : 'start' })
            .attr('y', x.rangeBand() / (data.length * 2))
            .attr('dy', '.32em')
            .text(function(d,i) { return valueFormat(getY(d,i)) })
        bars.transition()
          .select('text')
            .attr('x', function(d,i) { return getY(d,i) < 0 ? -4 : y(getY(d,i)) - y(0) + 4 })
      } else {
        bars.selectAll('text').text('');
      }

      if (showBarLabels && !stacked) {
        barsEnter.append('text').classed('nv-bar-label',true);
        bars.select('text.nv-bar-label')
            .attr('text-anchor', function(d,i) { return getY(d,i) < 0 ? 'start' : 'end' })
            .attr('y', x.rangeBand() / (data.length * 2))
            .attr('dy', '.32em')
            .text(function(d,i) { return getX(d,i) });
        bars.transition()
          .select('text.nv-bar-label')
            .attr('x', function(d,i) { return getY(d,i) < 0 ? y(0) - y(getY(d,i)) + 4 : -4 });
      }
      else {
        bars.selectAll('text.nv-bar-label').text('');
      }

      bars
          .attr('class', function(d,i) { return getY(d,i) < 0 ? 'nv-bar negative' : 'nv-bar positive'})

      if (barColor) {
        if (!disabled) disabled = data.map(function() { return true });
        bars
          .style('fill', function(d,i,j) { return d3.rgb(barColor(d,i)).darker(  disabled.map(function(d,i) { return i }).filter(function(d,i){ return !disabled[i]  })[j]   ).toString(); })
          .style('stroke', function(d,i,j) { return d3.rgb(barColor(d,i)).darker(  disabled.map(function(d,i) { return i }).filter(function(d,i){ return !disabled[i]  })[j]   ).toString(); });
      }

      if (stacked)
        bars.transition()
            .attr('transform', function(d,i) {
              return 'translate(' + y(d.y1) + ',' + x(getX(d,i)) + ')'
            })
          .select('rect')
            .attr('width', function(d,i) {
              return Math.abs(y(getY(d,i) + d.y0) - y(d.y0))
            })
            .attr('height', x.rangeBand() );
      else
        bars.transition()
            .attr('transform', function(d,i) {
              //TODO: stacked must be all positive or all negative, not both?
              return 'translate(' +
              (getY(d,i) < 0 ? y(getY(d,i)) : y(0))
              + ',' +
              (d.series * x.rangeBand() / data.length
              +
              x(getX(d,i)) )
              + ')'
            })
          .select('rect')
            .attr('height', x.rangeBand() / data.length )
            .attr('width', function(d,i) {
              return Math.max(Math.abs(y(getY(d,i)) - y(0)),1)
            });


      //store old scales for use in transitions on update
      x0 = x.copy();
      y0 = y.copy();

    });

    return chart;
  }


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = dispatch;

  chart.options = nv.utils.optionsFunc.bind(chart);

  chart.x = function(_) {
    if (!arguments.length) return getX;
    getX = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return getY;
    getY = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.xScale = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };

  chart.yScale = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.xDomain = function(_) {
    if (!arguments.length) return xDomain;
    xDomain = _;
    return chart;
  };

  chart.yDomain = function(_) {
    if (!arguments.length) return yDomain;
    yDomain = _;
    return chart;
  };

  chart.xRange = function(_) {
    if (!arguments.length) return xRange;
    xRange = _;
    return chart;
  };

  chart.yRange = function(_) {
    if (!arguments.length) return yRange;
    yRange = _;
    return chart;
  };

  chart.forceY = function(_) {
    if (!arguments.length) return forceY;
    forceY = _;
    return chart;
  };

  chart.stacked = function(_) {
    if (!arguments.length) return stacked;
    stacked = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = nv.utils.getColor(_);
    return chart;
  };

  chart.barColor = function(_) {
    if (!arguments.length) return barColor;
    barColor = nv.utils.getColor(_);
    return chart;
  };

  chart.disabled = function(_) {
    if (!arguments.length) return disabled;
    disabled = _;
    return chart;
  };

  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };

  chart.delay = function(_) {
    if (!arguments.length) return delay;
    delay = _;
    return chart;
  };

  chart.showValues = function(_) {
    if (!arguments.length) return showValues;
    showValues = _;
    return chart;
  };

  chart.showBarLabels = function(_) {
    if (!arguments.length) return showBarLabels;
    showBarLabels = _;
    return chart;
  };


  chart.valueFormat= function(_) {
    if (!arguments.length) return valueFormat;
    valueFormat = _;
    return chart;
  };

  chart.valuePadding = function(_) {
    if (!arguments.length) return valuePadding;
    valuePadding = _;
    return chart;
  };

  //============================================================


  return chart;
}

nv.models.multiBarHorizontalChart = function() {
  "use strict";
  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var multibar = nv.models.multiBarHorizontal()
    , xAxis = nv.models.axis()
    , yAxis = nv.models.axis()
    , legend = nv.models.legend().height(30)
    , controls = nv.models.legend().height(30)
    ;

  var margin = {top: 30, right: 20, bottom: 50, left: 60}
    , width = null
    , height = null
    , color = nv.utils.defaultColor()
    , showControls = true
    , showLegend = true
    , showXAxis = true
    , showYAxis = true
    , stacked = false
    , tooltips = true
    , tooltip = function(key, x, y, e, graph) {
        return '<h3>' + key + ' - ' + x + '</h3>' +
               '<p>' +  y + '</p>'
      }
    , x //can be accessed via chart.xScale()
    , y //can be accessed via chart.yScale()
    , state = { stacked: stacked }
    , defaultState = null
    , noData = 'No Data Available.'
    , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
    , controlWidth = function() { return showControls ? 180 : 0 }
    , transitionDuration = 250
    ;

  multibar
    .stacked(stacked)
    ;
  xAxis
    .orient('left')
    .tickPadding(5)
    .highlightZero(false)
    .showMaxMin(false)
    .tickFormat(function(d) { return d })
    ;
  yAxis
    .orient('bottom')
    .tickFormat(d3.format(',.1f'))
    ;

  controls.updateState(false);
  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var showTooltip = function(e, offsetElement) {
    var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
        top = e.pos[1] + ( offsetElement.offsetTop || 0),
        x = xAxis.tickFormat()(multibar.x()(e.point, e.pointIndex)),
        y = yAxis.tickFormat()(multibar.y()(e.point, e.pointIndex)),
        content = tooltip(e.series.key, x, y, e, chart);

    nv.tooltip.show([left, top], content, e.value < 0 ? 'e' : 'w', null, offsetElement);
  };

  //============================================================


  function chart(selection) {
    selection.each(function(data) {

      // convert date-time to formated string
      convertDateTime(data);

      var container = d3.select(this),
          that = this;

      var availableWidth = (width  || parseInt(container.style('width')) || 960)
                             - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;

      chart.update = function() { container.transition().duration(transitionDuration).call(chart) };
      chart.container = this;

      //set state.disabled
      state.disabled = data.map(function(d) { return !!d.disabled });

      if (!defaultState) {
        var key;
        defaultState = {};
        for (key in state) {
          if (state[key] instanceof Array)
            defaultState[key] = state[key].slice(0);
          else
            defaultState[key] = state[key];
        }
      }

      //------------------------------------------------------------
      // Display No Data message if there's nothing to show.

      if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
        var noDataText = container.selectAll('.nv-noData').data([noData]);

        noDataText.enter().append('text')
          .attr('class', 'nvd3 nv-noData')
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle');

        noDataText
          .attr('x', margin.left + availableWidth / 2)
          .attr('y', margin.top + availableHeight / 2)
          .text(function(d) { return d });

        return chart;
      } else {
        container.selectAll('.nv-noData').remove();
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Scales

      x = multibar.xScale();
      y = multibar.yScale();

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-multiBarHorizontalChart').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-multiBarHorizontalChart').append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-x nv-axis');
      gEnter.append('g').attr('class', 'nv-y nv-axis')
            .append('g').attr('class', 'nv-zeroLine')
            .append('line');
      gEnter.append('g').attr('class', 'nv-barsWrap');
      gEnter.append('g').attr('class', 'nv-legendWrap');
      gEnter.append('g').attr('class', 'nv-controlsWrap');
      
      // calculate real left margin
      gEnter.append('g')
        .attr('class', 'nv-temp nv-axis')
        .style('opacity',0);



      var seriesData = data.map(function(d) {
              return d.values.map(function(d,i) {
                return d.label
              })
            });

      var temp = g
                  .select('.nv-temp.nv-axis')
                  .selectAll('g')
                  .data(d3.merge(seriesData))

      temp.exit().remove();            
                  
      var tempTicks = temp
        .enter()
        .append('g')
        .attr('class','tick')
        .append('text')
        .text(function(d){return d})   


setTimeout(
  function(){

        margin.left = 0;
        g
          .select('.nv-temp.nv-axis')
          .selectAll('text')
          .each(function(d){
            margin.left = d3.max([margin.left,this.getComputedTextLength()])
          })   

        margin.left*=1.1;

        availableWidth = (width  || parseInt(container.style('width')) || 960)
                             - margin.left - margin.right,
        availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;        

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Legend
      

      showLegend = showLegend && data.length > 1;

      if (showLegend) {
        legend.width(availableWidth - controlWidth());

        if (multibar.barColor())
          data.forEach(function(series,i) {
            series.color = d3.rgb('#ccc').darker(i * 1.5).toString();
          })

        g.select('.nv-legendWrap')
            .datum(data)
            .call(legend);

        if ( margin.top != legend.height()) {
          margin.top = legend.height();
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;
        }

        g.select('.nv-legendWrap')
            .attr('transform', 'translate(' + controlWidth() + ',' + (-margin.top) +')');
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Controls

      if (showControls) {
        var controlsData = [
          { key: 'Grouped', disabled: multibar.stacked() },
          { key: 'Stacked', disabled: !multibar.stacked() }
        ];

        controls.width(controlWidth()).color(['#444', '#444', '#444']);
        g.select('.nv-controlsWrap')
            .datum(controlsData)
            .attr('transform', 'translate(0,' + (-margin.top) +')')
            .call(controls);
      }

      //------------------------------------------------------------


      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


      //------------------------------------------------------------
      // Main Chart Component(s)

      multibar
        .disabled(data.map(function(series) { return series.disabled }))
        .width(availableWidth)
        .height(availableHeight)
        .color(data.map(function(d,i) {
          return d.color || color(d, i);
        }).filter(function(d,i) { return !data[i].disabled }))


      var barsWrap = g.select('.nv-barsWrap')
          .datum(data.filter(function(d) { return !d.disabled }))

      barsWrap.transition().call(multibar);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Axes

      if (showXAxis) {
          xAxis
            .scale(x)
            .ticks( availableHeight / 24 )
            .tickSize(-availableWidth, 0);

          g.select('.nv-x.nv-axis').transition()
              .call(xAxis);

          var xTicks = g.select('.nv-x.nv-axis').selectAll('g');

          xTicks
              .selectAll('line, text');

         // console.log("xTicks",xTicks)
         var realLeftMargin = 0;     
        //  setTimeout(function(){
        //  xTicks
        //   .selectAll("text")
        //   .each(function(d){
        //       var current = this.getComputedTextLength();
        //       // console.log(this,current,realLeftMargin);
        //       realLeftMargin = (realLeftMargin< current)?current : realLeftMargin;
        //   })

        //   realLeftMargin *= 1.1;
        //    wrap.transition().attr('transform', 'translate(' + realLeftMargin + ',' + margin.top + ')');
        // },0);   
      }

      if (showYAxis) {
          yAxis
            .scale(y)
            .ticks( availableWidth / 100 )
            .tickSize( -availableHeight, 0);

          g.select('.nv-y.nv-axis')
              .attr('transform', 'translate(0,' + availableHeight + ')');
          g.select('.nv-y.nv-axis').transition()
              .call(yAxis);
      }

      // Zero line
      g.select(".nv-zeroLine line")
        .attr("x1", y(0))
        .attr("x2", y(0))
        .attr("y1", 0)
        .attr("y2", -availableHeight)
        ;

      //------------------------------------------------------------



      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      legend.dispatch.on('stateChange', function(newState) {
        state = newState;
        dispatch.stateChange(state);
        chart.update();
      });

      controls.dispatch.on('legendClick', function(d,i) {
        if (!d.disabled) return;
        controlsData = controlsData.map(function(s) {
          s.disabled = true;
          return s;
        });
        d.disabled = false;

        switch (d.key) {
          case 'Grouped':
            multibar.stacked(false);
            break;
          case 'Stacked':
            multibar.stacked(true);
            break;
        }

        state.stacked = multibar.stacked();
        dispatch.stateChange(state);

        chart.update();
      });

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) showTooltip(e, that.parentNode);
      });

      // Update chart from a state object passed to event handler
      dispatch.on('changeState', function(e) {

        if (typeof e.disabled !== 'undefined') {
          data.forEach(function(series,i) {
            series.disabled = e.disabled[i];
          });

          state.disabled = e.disabled;
        }

        if (typeof e.stacked !== 'undefined') {
          multibar.stacked(e.stacked);
          state.stacked = e.stacked;
        }

        chart.update();
      });
      //============================================================
},0);

    });



    return chart;
  }


  //============================================================
  // Event Handling/Dispatching (out of chart's scope)
  //------------------------------------------------------------

  multibar.dispatch.on('elementMouseover.tooltip', function(e) {
    e.pos = [e.pos[0] +  margin.left, e.pos[1] + margin.top];
    dispatch.tooltipShow(e);
  });

  multibar.dispatch.on('elementMouseout.tooltip', function(e) {
    dispatch.tooltipHide(e);
  });
  dispatch.on('tooltipHide', function() {
    if (tooltips) nv.tooltip.cleanup();
  });

  //============================================================


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.multibar = multibar;
  chart.legend = legend;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;

  d3.rebind(chart, multibar, 'x', 'y', 'xDomain', 'yDomain', 'xRange', 'yRange', 'forceX', 'forceY',
    'clipEdge', 'id', 'delay', 'showValues','showBarLabels', 'valueFormat', 'stacked', 'barColor');

  chart.options = nv.utils.optionsFunc.bind(chart);

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
    margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
    margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
    margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = nv.utils.getColor(_);
    legend.color(color);
    return chart;
  };

  chart.showControls = function(_) {
    if (!arguments.length) return showControls;
    showControls = _;
    return chart;
  };

  chart.showLegend = function(_) {
    if (!arguments.length) return showLegend;
    showLegend = _;
    return chart;
  };

  chart.showXAxis = function(_) {
    if (!arguments.length) return showXAxis;
    showXAxis = _;
    return chart;
  };

  chart.showYAxis = function(_) {
    if (!arguments.length) return showYAxis;
    showYAxis = _;
    return chart;
  };

  chart.tooltip = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) return tooltips;
    tooltips = _;
    return chart;
  };

  chart.tooltipContent = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.state = function(_) {
    if (!arguments.length) return state;
    state = _;
    return chart;
  };

  chart.defaultState = function(_) {
    if (!arguments.length) return defaultState;
    defaultState = _;
    return chart;
  };

  chart.noData = function(_) {
    if (!arguments.length) return noData;
    noData = _;
    return chart;
  };

  chart.transitionDuration = function(_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return chart;
  };
  //============================================================


  return chart;
}



  nv.models.gantt = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------


    var margin = { top: 5, right: 40, bottom: 5, left: 20 },
        width = null,
        height = null,
        xAxis = nv.models.axis(),
        transitionDuration = 250,
        interpolate ="cardinal",//"step-after",
        getX = function (d, i) {
          return d.x;
        } // accessor to get the x value from a data point
        ,
        getY = function (d, i) {
          return d.y;
        } // accessor to get the y value from a data point
        ,
        // getLabel = undefined //function(d) { return d.y }
        // ,
        defined = function (d, i) {
          return !isNaN(getY(d, i)) && getY(d, i) !== null;
        } // allows a line to be not continuous when it is not defined
        ,
        decoration = {
          process:{
            color:"#368A55",
            id:{
              enable:true
            },
            title:{
              enable:false,
              font:{
                family:"Tahoma",
                size:"medium",
                color:"#000000",
                weight:"bold"
              }
            }
          },
          task: {
            color:"#007095",
            id:{
              enable:true
            },
             title:{
              enable:false,
              font:{
                family:"Arial",
                size:"small",
                color:"#000000",
                weight:"bold"
              }
            }
          },
          cause:{
            enable:false

          },
          dependency:{
            enable:false
          },
          income:{
            enable:false,
            color:"#43AC6A",
            width:"1.5px",
            font:{
                family:"Arial",
                size:"10px",
                color:"#43AC6A",
                weight:"bold"
            }
          },
          expenditure:{
            enable:false,
            color:"#F04124",
            width:"1.5px",
            font:{
                family:"Arial",
                size:"10px",
                color:"#F04124",
                weight:"bold"
            }
          } 
        }, 
        xScale = d3.scale.linear(),
        yScale = d3.scale.ordinal()//.domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
    
    ;

   
    //============================================================
    function distinct(array){

      array.sort(function(a,b){return ((a.x-b.x)==0)? (a.task-b.task):(a.x-b.x)})
      var i = 0;
      while(i < array.length){
        if( (i>0) 
              && (array[i].x == array[i-1].x) 
              && (array[i].task == array[i-1].task)
              && (array[i].type == array[i-1].type)
          ){
          array.splice(i,1)
        }else{
          i++
        }
      }
      return array;
    }

    function causeColor(d){
      if(!d.type) return "#555555";
      if(d.type == "") return "#555555";
      if(d.type == "+") return "#43AC6A";
      if(d.type == "-") return "#F04124";
      if(d.type == "") return "#555555";
    }

    function causeWidth(d){
      if(!d.type) return 1;
      if(d.type == "") return 1;
      if(d.type == "+") return 8;
      if(d.type == "-") return 8;
      if(d.type == "") return 1;
    }

    function causeOpacity(d){
      if(!d.type) return 0.7;
      if(d.type == "") return 0.7;
      if(d.type == "+") return 0.4;
      if(d.type == "-") return 0.4;
      if(d.type == "") return 0.7;
    }



    function nodeToNodePath(d) {
      var deltaX = Math.abs(0.7*(-d.source.x + d.target.x));
       
      var amx = []
        amx.push({x:d.source.x+deltaX,y:d.source.y})
        amx.push({x:d.target.x-deltaX,y:d.target.y})
      
      return "M" + d.source.x + "," + d.source.y
           + "C" + amx[0].x + "," + amx[0].y
           + " " + amx[1].x + "," + amx[1].y
           + " " + d.target.x + "," + d.target.y;
    }

    function arrowPath(d){

      d.width = (d.width) ? d.width : 1;
      var x = d.x;
      var dx = d.width;
      var y = d.y;
      var dy = d.width;



      var values = [
        { "x":x-dx*2.5, "y":y-dy },
        { "x":x, "y":y   }, 
        { "x":x-dx*2.5, "y":y+dy }
      ]

      return d3.svg.area()
            .interpolate("linear-closed")
            .defined(defined)
            .x(function (p, i) {
                  return p.x;
            })
            .y0(function (p, i) {
                  return p.y;
            })
            .y1(function (p, i) {
                  return d.y;
            })
            .apply(this, [values]);
    } 

    function arrowLength(d){
      var width = causeWidth(d);
      width = (width < 4) ? 4 : width;
      return width*2.5;
    }


    function textWrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            x = text.attr("x"),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
        // TODO correct dy calculation for positive shift
        text
          .selectAll("tspan")
          .attr("dy", function(d){ return lineNumber-- * lineHeight*Math.sign(dy) + dy + "em"})

      });
    }   

    function chart(selection) {
      selection.each(function (data) {
        // console.log("gantt", data)
        if(data.length == 0) return;
        // prepare data
        var data = data.filter(function (item) {
          return item.disabled !== true;
        });

        var markersData = [];
        
        data
          .filter(function(d){return d.expenditure !== undefined})
          .map(function(d){
            return d.expenditure.filter(function(p){return p.marker!==undefined})
          })
          .concat(
            data
              .filter(function(d){return d.income !== undefined})
              .map(function(d){
                return d.income.filter(function(p){return p.marker!==undefined})
              })
          )
          .forEach(function(d){
            markersData = markersData.concat(d) 
          });


         var linksData = [];
         data
            .filter(function(d){return d.causes !== undefined})
            .map(function(d){return d.causes})
            .forEach(function(d){
              linksData = linksData.concat(d); 
            })

         var sourcesData = distinct(
                          linksData
                            .map(function(item){return item.src})
                       );       

         var targetsData = distinct(
                          linksData
                            .map(function(item){return item.target})
                       );

        var xDomain = data[0].timeDomain;
        var yDomain = [0, data[0].childs.length+1];

        var availableWidth = width - margin.left - margin.right;
        var availableHeight = height - margin.top - margin.bottom;



        xScale.domain(xDomain).range([0, availableWidth]);
        yScale
          .domain(data.map(function(item){return item.index}))
          .rangeRoundBands([ 0, availableHeight], .1);

         var barWidth = yScale.rangeBand()-11;
         barWidth = (barWidth > 15) ? 15 : barWidth;
         barWidth = (barWidth < 8) ? 8 : barWidth;
         barWidth = 7;
         var barMargin = 4;

        data.forEach(function(d){
          if(d.expenditure !== undefined){
            var values = d.expenditure;
            var yValues = values.map(function(item){return item.y})

            d.expenditureScale = d3.scale
                             .linear()
                             .domain([d3.max(yValues),d3.min(yValues)])
                             .range([4, yScale.rangeBand()-7]);
          }

          if(d.income !== undefined){
            var values = d.income;
            var yValues = values.map(function(item){return item.y})

            d.incomeScale = d3.scale
                             .linear()
                             .domain([d3.max(yValues),d3.min(yValues)])
                             .range([4, yScale.rangeBand()-7]);
          }
        })  

        
        var container = d3.select(this);

        xAxis
          .orient("bottom")
          .scale(xScale)
          .showMaxMin(false)
          .ticks( availableWidth / 100 )
          .tickSize(-availableHeight, 0)
          .tickPadding(2)

        //------------------------------------------------------------
        // Setup containers and skeleton of chart
        
         chart.update = function () {
          container.transition().duration(transitionDuration).call(chart);
        };

        
        container.selectAll("g").remove();

        var wrap = container
          .append("g")
          .attr("class", "nvd3 nv-gantt")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        wrap
          .append("g")
          .attr("class", "nv-x nv-axis")
          .attr("transform","translate(" + margin.left + "," + availableHeight + ")")
       
        wrap  
          .select(".nv-x.nv-axis")
          .call(xAxis);  
          
        var series =  wrap.selectAll("g.nv-gantt")
                  .data(data);

       

        var sources = wrap.selectAll("g.nv-gantt")
                  .data(sourcesData);

        var targets = wrap.selectAll("g.nv-gantt")
                  .data(targetsData);

        var links = wrap.selectAll("g.nv-gantt")
                  .data(linksData);          
        
        var markers = wrap.selectAll("g.nv-gantt")
                  .data(markersData);

        series.exit().remove(); 
       
        links.exit().remove();
        sources.exit().remove();
        targets.exit().remove();
        markers.exit().remove();

      
       


        
      if(decoration.cause.enable){ 
        links
            .enter()
            .append("g")
            .attr("class", "nvd3 nv-gantt-link")
            .attr("transform", function(d){ return "translate(" +margin.left+"," + 0 + ")"});
         
        links
          .append("path")
          .attr("class", "nv-area")
          .attr("d", function (d) {  

                  var source = {
                    x: xScale(d.src.x),
                    y: yScale(d.src.task)+barWidth/2+barMargin//7
                  };

                  var target = {
                    x: xScale(d.target.x)-arrowLength(d),
                    y: yScale(d.target.task)+barWidth/2+barMargin//7
                  }

                  return nodeToNodePath({"source":source, "target":target})

           })
           .style("stroke", causeColor) 
           .style("fill-opacity",0)
           .style("stroke-width",causeWidth)
           .style("stroke-opacity",causeOpacity)
      }     



        series  
          .enter()
          .append("g")
          .attr("class", "nvd3 nv-gantt-task")
          .attr("transform", function(d){ return "translate(" +margin.left+"," + yScale(d.index) + ")"});
        
        // bar implementation 
         // series
         //  .append("rect")
         //  .attr("x", function(d){return xScale(d.start)})
         //  .attr("y", function(d){return 5})
         //  .attr("width",function (d) {
         //        // return 30
         //        var end = (d.isOpen) ? xScale.domain()[1] : d.end;
         //         return xScale(end)- xScale(d.start)
         //  })
         //  .attr("height", 20)
         //  .style("fill-opacity",0.7)
         //  .style("fill",function(d){return (d.childs.length==0) ? "#F08A24" : "#368a55"})
        // bar implementation  
      
      // rect implementation
        // series
        //   .append("path")
        //   .attr("class", "nv-area")
        //   .attr("d", function (d) {

                
        //         var end = (d.end) ? d.end : xScale.domain()[1];

                
        //         var values = [
        //           {x:xScale(end),y:5},
        //           {x:xScale(d.start), y:5}, 
        //           {x:xScale(d.start), y:25},
        //           {x:xScale(end), y:25},
        //         ]
        //        if (!d.isOpen){
        //           return d3.svg.area()
        //                 .interpolate("linear-closed")
        //                 .defined(defined)
        //                 .x(function (p, i) {
        //                       return p.x;
        //                 })
        //                 .y(function (p, i) {
        //                       return p.y;
        //                 })
        //                 .apply(this, [values]);
        //        }else{
        //           return d3.svg.area()
        //                 .interpolate("linear")
        //                 .defined(defined)
        //                 .x(function (p, i) {
        //                       return p.x;
        //                 })
        //                 .y(function (p, i) {
        //                       return p.y;
        //                 })
        //                 .apply(this, [values]);
        //        } 
               
        //   })
        //   .style("fill","#e7e7e7")
        //   .style("fill-opacity","0.7")
        //   .style("stroke",function(d){return (d.childs.length==0) ? "#F08A24" : "#368a55"})
        //   .style("stroke-width",function(d){return (d.childs.length==0) ? "3px" : "1px"})
        //   .style("stroke-opacity", function(d){return(d.childs.length>0 && (d.expenditure || d.income))? 0 : 1 })
      // rect implementation    
      
      
      //line implementation
        series
          .append("svg:line")
          .attr("x1", function (d, i) {
            return xScale(d.start);
          })
          .attr("y1", function (d, i) {
            return barWidth/2+barMargin;
          })
          .attr("x2", function (d, i) {
            var end = (d.isOpen) ? xScale.domain()[1] : d.end;
            return xScale(end)
          })
          .attr("y2", function (d, i) {
            return barWidth/2+barMargin;
          })
          .style("stroke",function(d) {
            return (!d.isOpen)
              ? (d.childs.length==0)
                  ? decoration.task.color
                  : decoration.process.color
              :"url("+document.location.href+"#gradient-" + d.id + "-" + d.index + ")"; 
          })
          
          .style("stroke-width", barWidth+"px")
          .style("stroke-opacity", function(d){return (d.expenditure || d.income) ? 0 : 1 })

        var gradient = series.append("linearGradient")
          .attr("id", function(d) { return "gradient-" + d.id + "-" + d.index; })
          .attr("x1", function (d, i) {
            return xScale(d.start);
          })
          .attr("y1", function (d, i) {
            barWidth/2+barMargin;
          })
          .attr("x2", function (d, i) {
            var end = (d.isOpen) ? xScale.domain()[1] : d.end;
            return xScale(end)
          })
          .attr("y2", function (d, i) {
            barWidth/2+barMargin;
          })
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("spreadMethod", "pad");

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", function(d) { 
              return (d.childs.length==0) 
                ? decoration.task.color
                : decoration.process.color
            })
            .attr("stop-opacity", 1);

        // gradient.append("svg:stop")
        //     .attr("offset", function(d){
        //       var end = (d.isOpen) ? xScale.domain()[1] : d.end;
        //       return 400/(xScale(end)-xScale(d.start))+"%"
        //     })
        //     .attr("stop-color", function(d) {return (d.childs.length==0) ? "#F08A24" : "#368a55"})
        //     .attr("stop-opacity", function(d) { return (d.isOpen) ? 0.5 : 0.2});    
        
        // gradient.append("svg:stop")
        //     .attr("offset", function(d){
        //       var end = (d.isOpen) ? xScale.domain()[1] : d.end;
        //       return ( 100 - 400/(xScale(end)-xScale(d.start)))+"%"
        //     })
        //     .attr("stop-color", function(d) {
        //       return (d.childs.length==0) 
        //         ? "#F08A24" 
        //         : "#368a55"
        //     })
        //     .attr("stop-opacity",function(d) { return (d.isOpen) ? 0 : 0.2});      
        
        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", function(d) { 
              return (d.childs.length==0) 
                ? decoration.task.color
                : decoration.process.color
            })
            .attr("stop-opacity",0);  
          


      // line implementation 

        series
          .append("text")
          .style("text-anchor", "start")
          .attr("x", function(d){
            return (d.childs.length>0)?xScale(xScale.domain()[0]):xScale(d.start)
          })
          .attr("dx",function(d){
            return "0em" 
            // return (d.childs.length>0)?"2em":"1em"
          })
          .classed("nv-label", true)
          .text(function (d, i) {
            var _decor = (d.childs.length>0) ? decoration.process : decoration.task;
            return  ""
                    +((_decor.id.enable) ? d.id : "")
                    +((_decor.id.enable && _decor.title.enable) ? "." : "")
                    +((_decor.title.enable) ? d.title : "")
          })
          .style("font-weight", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.weight//(d.childs.length>0)?"bold":"normal"
          })
          .style("font-size", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.size
            // return (d.childs.length>0)?"medium":"small"
          })
          .style("font-family", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.family
            // return (d.childs.length>0)?"medium":"small"
          })
          .style("fill","#ffffff")
          .style("stroke","#ffffff")
          .style("stroke-width",5)
          .style("stroke-opacity",0.8)
          


        series
          .append("text")
          .style("text-anchor", "start")
          .attr("x", function(d){
            return (d.childs.length>0)?xScale(xScale.domain()[0]):xScale(d.start)
          })
          .attr("dx",function(d){
            return "0em"
            // return (d.childs.length>0)?"2em":"1em"
          })
          .classed("nv-label", true)
          .text(function (d, i) {
            var _decor = (d.childs.length>0) ? decoration.process : decoration.task;
            return  ""
                    +((_decor.id.enable) ? d.id : "")
                    +((_decor.id.enable && _decor.title.enable) ? "." : "")
                    +((_decor.title.enable) ? d.title : "")
          })
          .style("font-weight", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.weight//(d.childs.length>0)?"bold":"normal"
          })
          .style("font-size", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.size
            // return (d.childs.length>0)?"medium":"small"
          })
           .style("font-family", function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.family
            // return (d.childs.length>0)?"medium":"small"
          })
          // .text(function (d, i) {
          //   return d.id+"."+d.title;
          // })
          // .style("font-weight", function(d){return (d.childs.length>0)?"bold":"normal"})
          // .style("font-size", function(d){return (d.childs.length>0)?"medium":"small"})
          .style("fill",function(d){
            var _decor = (d.childs.length>0) ? decoration.process.title : decoration.task.title;
            return _decor.font.color
          })

      if(decoration.expenditure.enable){    
        series
          .filter(function(d){return d.expenditure !== undefined})
          .append("path")
          .attr("class", "nv-area")
          .attr("d", function (d) {
               
                return d3.svg.area()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function (p, i) {
                              return nv.utils.NaNtoZero(xScale(getX(p, i)));
                        })
                        .y0(function (p, i) {
                              return nv.utils.NaNtoZero(d.expenditureScale(getY(p, i)));
                        })
                        .y1(function (p, i) {
                              return d.expenditureScale( d.expenditureScale.domain()[1]
                              );
                        })
                        .apply(this, [d.expenditure]);
          })
          .style("fill-opacity",0.2)
          .style("fill",decoration.expenditure.color);

        series
          .filter(function(d){return d.expenditure !== undefined})
          .append("path")
          .attr("class", "nv-area")
          .attr("d", function (d) {
                return d3.svg.line()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function (p, i) {
                              return nv.utils.NaNtoZero(xScale(getX(p, i)));
                        })
                        .y(function (p, i) {
                              return nv.utils.NaNtoZero(d.expenditureScale(getY(p, i)));
                        })
                        .apply(this, [d.expenditure]);
          })
          .style("fill-opacity",0)
          .style("stroke-width",decoration.expenditure.width)
          .style("stroke",decoration.expenditure.color);//#43AC6A
      }
      
      if(decoration.income.enable){    
        series
          .filter(function(d){return d.income !== undefined})
          .append("path")
          .attr("class", "nv-area")
          .attr("d", function (d) {
               
                return d3.svg.area()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function (p, i) {
                              return nv.utils.NaNtoZero(xScale(getX(p, i)));
                        })
                        .y0(function (p, i) {
                              return nv.utils.NaNtoZero(d.incomeScale(getY(p, i)));
                        })
                        .y1(function (p, i) {
                              return d.incomeScale( d.incomeScale.domain()[1]
                              );
                        })
                        .apply(this, [d.income]);
          })
          .style("fill-opacity",0.2)
          .style("fill",decoration.income.color);

        series
          .filter(function(d){return d.income !== undefined})
          .append("path")
          .attr("class", "nv-area")
          .attr("d", function (d) {
                return d3.svg.line()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function (p, i) {
                              return nv.utils.NaNtoZero(xScale(getX(p, i)));
                        })
                        .y(function (p, i) {
                              return nv.utils.NaNtoZero(d.incomeScale(getY(p, i)));
                        })
                        .apply(this, [d.income]);
          })
          .style("fill-opacity",0)
          .style("stroke-width",decoration.income.width)
          .style("stroke",decoration.income.color);//#43AC6A
      }    

        // sources
        //   .enter()
        //   .append("g")
        //   .attr("class", "nvd3 nv-gantt-source")
        //   .attr("transform", function(d){ return "translate(" +margin.left+"," + yScale(d.task) + ")"});

        // sources
        //   .append("circle")
        //   .attr("r",8)
        //   .attr("cx", function(d){return xScale(d.x)})
        //   .attr("cy", 14)
        //   .style("fill",causeColor)
        //   .style("fill-opacity",0.5)
        //   
      
      if(decoration.cause.enable){     
        targets
        .enter()
        .append("g")
        .attr("class", "nvd3 nv-gantt-target")
        .attr("transform", function(d){ return "translate(" +margin.left+"," + yScale(d.task) + ")"});

        targets
          .append("path")
          .attr("d", function(d){
            var width = causeWidth(d);
            width = (width < 4) ? 4 : width;
            return arrowPath({x:xScale(d.x), y:+barWidth/2+barMargin, "width":width})//7})
          })
          .style("stroke-opacity",0)
          .style("stroke", causeColor)
          .style("fill",causeColor)
          .style("fill-opacity",causeOpacity)
      }    

      if(decoration.expenditure.enable || decoration.income.enable ){
        markers
          .enter()
          .append("g")
          .attr("class", "nvd3 nv-gantt-marker")
          .attr("transform", function(d){ return "translate(" +margin.left+"," + yScale(d.index) + ")"});

        markers
          .append("circle")
          .attr("r",function(d){
            return  (d.type == "expenditure") ? decoration.expenditure.width : decoration.income.width
          })
          .attr("cx", function(d){return xScale(d.x)})
          .attr("cy", function(d){
            var s = (d.type == "expenditure") ? data[d.index].expenditureScale : data[d.index].incomeScale
            return s(d.y)
          })
          .style("fill",function(d){
            return (d.type == "expenditure")?decoration.expenditure.color : decoration.income.color//"#F04124":"#43AC6A"
          });
            
         markers
          .append("text")
          .text(function(d){return d.marker})
          .style("text-anchor", "middle")
          .attr("x", function(d){
              return xScale(d.x)
          })
          .attr("y", function(d){
            var s = (d.type == "expenditure") ? data[d.index].expenditureScale : data[d.index].incomeScale
            return s(d.y)
          })
          .attr("dy", "-0.5em")
          .style("font-size", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.size 
              : decoration.income.font.size
          })  
          //"xx-small")
          .style("font-weight", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.weight 
              : decoration.income.font.weight
          })  
          .style("font-family", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.family 
              : decoration.income.font.family
          })  

          //"bold")
          .style("fill","#ffffff")
          .style("stroke","#ffffff")
          .style("stroke-width",3)
          .style("stroke-opacity",0.3)


        markers
          .append("text")
          .text(function(d){return d.marker})
          .style("text-anchor", "middle")
          .attr("x", function(d){
              return xScale(d.x)
          })
          .attr("y", function(d){
            var s = (d.type == "expenditure") ? data[d.index].expenditureScale : data[d.index].incomeScale
            return s(d.y)
          })
          .attr("dy", "-0.5em")
          .style("font-size", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.size 
              : decoration.income.font.size
          })  
          //"xx-small")
          .style("font-weight", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.weight 
              : decoration.income.font.weight
          })  
          .style("font-family", function(d){
            return (d.type == "expenditure") 
              ? decoration.expenditure.font.family 
              : decoration.income.font.family
          })  
          // .style("font-size","xx-small")
          // .style("font-weight","bold")
          .style("fill",function(d){
            return (d.type == "expenditure")
              ? decoration.expenditure.font.color 
              : decoration.income.font.color
          });


        wrap
        .selectAll(".nv-gantt-marker text")
        .call(textWrap, 2 * (xScale(xScale.domain()[1])-xScale(xScale.domain()[0]))/xScale.ticks().length);  
      }    

      })

      return chart;
    
  }  


    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    //chart.dispatch = dispatch;
    chart.options = nv.utils.optionsFunc.bind(chart);

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

    
    //============================================================
    return chart;
  };


})();


