"use strict";

(function () {
  //console.log("LOAD nv.d3.ext")


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
        dispatch = d3.dispatch("elementClick", "elementMouseover", "elementMouseout"),
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

            pointPaths.on("click", function (d) {
              mouseEventCallback(d, dispatch.elementClick);
            }).on("mouseover", function (d) {
              mouseEventCallback(d, dispatch.elementMouseover, d3.event);
            }).on("mouseout", function (d, i) {
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
              //nv.log('test', d, i);
              if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
              var series = data[d.series],
                  point = series.values[i];

              dispatch.elementClick({
                point: point,
                series: series,
                pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                seriesIndex: d.series,
                pointIndex: i
              });
            }).on("mouseover", function (d, i) {
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
            }).on("mouseout", function (d, i) {
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


        // Delay updating the invisible interactive layer for smoother animation
        clearTimeout(timeoutID); // stop repeat calls to updateInteractiveLayer
        timeoutID = setTimeout(updateInteractiveLayer, 300);
        //updateInteractiveLayer();

        //store old scales for use in transitions on update
        x0 = x.copy();
        y0 = y.copy();
        z0 = z.copy();
      });

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


        //------------------------------------------------------------
        // Setup Axes
        if (showXAxis) {
          xAxis.scale(x).ticks(xAxis.ticks() && xAxis.ticks().length ? xAxis.ticks() : availableWidth / 100).tickSize(-availableHeight, 0);

          g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (y.range()[0] + 10) + ")").call(xAxis);
        }

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
      console.log(e);
      var left = e.event.pageX,

      //pos[0],
      top = e.event.pageY,

      //pos[1],
      x = xAxis.tickFormat()(lines.x()(e.point, e.pointIndex)),
          y = yAxis.tickFormat()(lines.y()(e.point, e.pointIndex)),
          content = tooltip(e.series.key, x, y, e, chart);
      console.log(left, top, tooltipShift);
      nv.tooltip.show([left /* + tooltipShift.x*/, top /*+ tooltipShift.y*/], content, null, null, offsetElement, "xy-tooltip with-3d-shadow with-transitions");
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


        if (showLegend) {
          legend.width(availableWidth);

          g.select(".nv-legendWrap").datum(data).call(legend);

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


        var linesWrap = g.select(".nv-linesWrap").datum(data.filter(function (d) {
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
          interactiveLayer.tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top }).chartContainer(that.parentNode).enabled(tooltips).valueFormatter(function (d, i) {
            return yAxis.tickFormat()(d);
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

    d3.rebind(chart, lines, "defined", "isArea", "x", "y", "size", "xScale", "yScale", "xDomain", "yDomain", "xRange", "yRange", "forceX", "forceY", "interactive", "clipEdge", "clipVoronoi", "useVoronoi", "id", "interpolate");

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

      nv.tooltip.show([left, top], content, null, null, offsetElement);
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
          xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);

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
          interactiveLayer.tooltip.position({ left: pointXLocation + margin.left, top: e.mouseY + margin.top }).chartContainer(that.parentNode).enabled(tooltips).valueFormatter(function (d, i) {
            return yAxis.tickFormat()(d);
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

    d3.rebind(chart, lines, "defined", "isArea", "x", "y", "size", "xScale", "yScale", "xDomain", "yDomain", "xRange", "yRange", "forceX", "forceY", "interactive", "clipEdge", "clipVoronoi", "useVoronoi", "id", "interpolate");

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
        yAxisTickFormat = d3.format(",.2f"),
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


        //------------------------------------------------------------
        // Setup Scales

        x = stacked.xScale();
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

        if (showXAxis) {
          xAxis.scale(x).ticks(availableWidth / 100).tickSize(-availableHeight, 0);

          g.select(".nv-x.nv-axis").attr("transform", "translate(0," + (availableHeight + 10) + ")");

          g.select(".nv-x.nv-axis").transition().duration(0).call(xAxis);
        }

        if (showYAxis) {
          yAxis.scale(y).ticks(stacked.offset() == "wiggle" ? 0 : availableHeight / 36).tickSize(-availableWidth, 0).setTickFormat(stacked.style() == "expand" || stacked.style() == "stack_percent" ? d3.format("%") : yAxisTickFormat);

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
        console.log("Chord data", data);
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

        if (showLegend) {
          legend.width(availableWidth).key(function (d) {
            return d.key;
          }).min(2).color(function (d) {
            return "#238443";
          });

          wrap.select(".nv-legendWrap").datum(data).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        }

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

        legend.dispatch.on("stateChange", function (newState) {
          state = newState;
          dispatch.stateChange(state);
          chart.update();
        });

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
        align = true,
        rightAlign = true,
        updateState = true //If true, legend will update data.disabled and trigger a 'stateChange' dispatch.
    ,
        radioButtonMode = false //If true, clicking legend items will cause it to behave like a radio button. (only one can be selected at a time)
    ,
        dispatch = d3.dispatch("legendClick", "legendDblclick", "legendMouseover", "legendMouseout", "stateChange"),
        minEnabledSeries;

    //============================================================


    function chart(selection) {
      selection.each(function (data) {
        var availableWidth = width - margin.left - margin.right,
            container = d3.select(this);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-legend").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-legend").append("g");
        var g = wrap.select("g");

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //------------------------------------------------------------

        var bg = gEnter.selectAll("rect.nv-series-bg").data([0]);

        var series = g.selectAll(".nv-series").data(function (d) {
          return d;
        });

        gEnter.append("rect").style("stroke-width", 1).style("stroke-opacity", 0).style("fill-opacity", 0.5).style("fill", "#ffffff").attr("class", "nv-series-bg").attr("transform", "translate(-10,-25)");

        var seriesEnter = series.enter().append("g").attr("class", "nv-series").on("mouseover", function (d, i) {
          dispatch.legendMouseover(d, i); //TODO: Make consistent with other event objects
        }).on("mouseout", function (d, i) {
          dispatch.legendMouseout(d, i);
        }).on("click", function (d, i) {
          //console.log("LEGEND",updateState,radioButtonMode )
          dispatch.legendClick(d, i);
          if (updateState) {
            if (radioButtonMode) {
              console.log("RADIO MODE select", d);
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
        }).on("dblclick", function (d, i) {
          dispatch.legendDblclick(d, i);
          if (updateState && !minEnabledSeries) {
            //the default behavior of NVD3 legends, when double clicking one,
            // is to set all other series' to false, and make the double clicked series enabled.
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



        seriesEnter.append("circle").style("stroke-width", 2).attr("class", "nv-legend-symbol").attr("r", 5);
        seriesEnter.append("text").attr("text-anchor", "start").attr("class", "nv-legend-text").attr("dy", ".32em").attr("dx", "8");
        series.classed("disabled", function (d) {
          return d.disabled;
        });
        bg.exit().remove();
        series.exit().remove();

        series.select("circle").style("fill", function (d, i) {
          return d.color || color(d, i);
        }).style("stroke", function (d, i) {
          return d.color || color(d, i);
        });
        series.select("text").text(getKey);


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

    var margin = { top: 5, right: 0, bottom: 5, left: 0 },
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
        // prepare data
        var data1 = data.filter(function (item) {
          return !item.disabled != undefined && item.disabled == false;
        })[0];
        var key;
        if (data1) {
          key = data1.key;
          data1 = data1.boundaries;
        } else {
          key = data[0].key;
          data1 = data[0].boundaries;
        }
        //data1 = data1 ? data1.boundaries : data[0].boundaries;
        //console.log("colorScheme", data1);
        //
        var availableWidth = width - margin.left - margin.right,
            container = d3.select(this);


        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll("g.nv-colorScheme").data([data]);
        var gEnter = wrap.enter().append("g").attr("class", "nvd3 nv-colorScheme").append("g");
        var g = wrap.select("g");

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //------------------------------------------------------------


        //var series = g.selectAll('.nv-series')
        //  .data(function (d) {
        //    return d
        //  });
        //var rects = new Array();
        //for(var i=0;i<data1.length-1;i++) rects.push(i);
        //
        var bg = g.selectAll(".nv-color-bg").data([0]);
        var title = g.selectAll(".nv-color-title").data([0]);

        var colors = g.selectAll(".nv-color").data(data1);
        var rectWidth = availableWidth / 2 / data1.length;
        //console.log("rectWidth", rectWidth, availableWidth);
        //var seriesEnter = series.enter().append('g').attr('class', 'nv-series');
        var colorsEnter = colors.enter().append("g").attr("class", "nv-color");

        bg.exit().remove();
        title.exit().remove();

        colors.exit().remove();

        colorsEnter.append("rect").style("stroke-width", 1).style("stroke-opacity", 0).style("fill-opacity", 0.5).style("fill", "#ffffff").attr("class", "nv-color-bg").attr("transform", "translate(-10,-25)");

        colorsEnter.append("text").attr("class", "nv-color-title").attr("text-anchor", "start").style("stroke-opacity", 0).style("font", "bold 0.75rem Arial").style("fill", "#777").attr("transform", "translate(-7,-15)");



        colorsEnter.append("rect").style("stroke-width", 1).style("stroke", "#a0a0a0")
        //.attr('class', 'nv-color')
        .attr("width", rectWidth).attr("height", 5);

        colorsEnter.append("text").attr("text-anchor", "start").attr("class", "nv-legend-text").attr("dy", "-.7em").style("text-anchor", "middle").style("stroke-opacity", 0).style("font", "normal 0.5rem Arial").style("fill", "#777");

        //seriesEnter.append('text')
        //  .attr('text-anchor', 'start')
        //  .attr('class', 'nv-legend-text')
        //  .attr('dy', '.32em')
        //  .attr('dx', '8');


        colors //.select('rect')
        .style("fill", function (d, i) {
          if (i == data1.length - 1) return "#f0f0f0";
          return d.color || color(d, i);
        }).style("stroke", "#a0a0a0");
        //.attr('transform', function (d, i) {
        //  var x = rectWidth*i+5;
        //  return 'translate(' + x + ',' + 0 + ')';
        //});

        colors //.select('rect')
        .transition()
        //.style('fill', function (d, i) {
        //  return d.color || color(d, i)
        //})
        //.style('stroke',  "#a0a0a0")
        .attr("transform", function (d, i) {
          //console.log(d, i, rectWidth);
          var x = rectWidth * i + 10;
          return "translate(" + x + "," + 0 + ")";
        });

        colors.select("text.nv-legend-text").transition().text(function (d) {
          return d;
        });

        wrap.select("rect.nv-color-bg") //.select('rect')
        .transition().attr("width", availableWidth / 2 + 25).attr("height", 40);

        wrap.select("text.nv-color-title") //.select('rect')
        .transition().text(key);


        //position legend as far right as possible within the total width
        //g.attr('transform', 'translate(' + (width - margin.right - maxwidth) + ',' + margin.top + ')');

        height = margin.top + margin.bottom + 15;

        //}
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

    //chart.key = function (_) {
    //  if (!arguments.length) return getKey;
    //  getKey = _;
    //  return chart;
    //};

    //chart.min = function (_) {
    //  if (!arguments.length) return minEnabledSeries;
    //  minEnabledSeries = _;
    //  return chart;
    //};

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

    //chart.updateState = function (_) {
    //  if (!arguments.length) return updateState;
    //  updateState = _;
    //  return chart;
    //};

    //chart.radioButtonMode = function (_) {
    //  if (!arguments.length) return radioButtonMode;
    //  console.log("set radio mode",_)
    //  radioButtonMode = _;
    //  return chart;
    //};

    //============================================================


    return chart;
  };

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

    axis.scale(scale).orient("bottom").tickFormat(function (d) {
      return d;
    });

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
              }).select("text").attr("dy", "-0.5em").attr("y", -axis.tickPadding()).attr("text-anchor", "middle").text(function (d, i) {
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
        color = nv.utils.defaultColor(),
        projection = d3.geo.mercator(),
        path = d3.geo.path().projection(projection),
        zoom = d3.behavior.zoom()
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
        dispatch = d3.dispatch( /*"tooltipShow", "tooltipHide", "chartClick",  "elementClick", "elementDblClick",*/"mapMouseover", "mapMouseout" /*, "zoom"*/);

    //============================================================
    var worldTopo = {
      type: "Topology",
      objects: {
        world: {
          type: "GeometryCollection",
          geometries: [{
            type: "Polygon",
            properties: {
              name: "Afghanistan"
            },
            id: "AFG",
            arcs: [[0, 1, 2, 3, 4, 5]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Angola"
            },
            id: "AGO",
            arcs: [[[6, 7, 8, 9]], [[10, 11, 12]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Albania"
            },
            id: "ALB",
            arcs: [[13, 14, 15, 16, 17]]
          }, {
            type: "Polygon",
            properties: {
              name: "United Arab Emirates"
            },
            id: "ARE",
            arcs: [[18, 19, 20, 21, 22]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Argentina"
            },
            id: "ARG",
            arcs: [[[23, 24]], [[25, 26, 27, 28, 29, 30]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Armenia"
            },
            id: "ARM",
            arcs: [[31, 32, 33, 34, 35]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Antarctica"
            },
            id: "ATA",
            arcs: [[[36]], [[37]], [[38]], [[39]], [[40]], [[41]], [[42]], [[43]]]
          }, {
            type: "Polygon",
            properties: {
              name: "French Southern and Antarctic Lands"
            },
            id: "ATF",
            arcs: [[44]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Australia"
            },
            id: "AUS",
            arcs: [[[45]], [[46]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Austria"
            },
            id: "AUT",
            arcs: [[47, 48, 49, 50, 51, 52, 53]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Azerbaijan"
            },
            id: "AZE",
            arcs: [[[54, -35]], [[55, 56, -33, 57, 58]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Burundi"
            },
            id: "BDI",
            arcs: [[59, 60, 61]]
          }, {
            type: "Polygon",
            properties: {
              name: "Belgium"
            },
            id: "BEL",
            arcs: [[62, 63, 64, 65, 66]]
          }, {
            type: "Polygon",
            properties: {
              name: "Benin"
            },
            id: "BEN",
            arcs: [[67, 68, 69, 70, 71]]
          }, {
            type: "Polygon",
            properties: {
              name: "Burkina Faso"
            },
            id: "BFA",
            arcs: [[72, 73, 74, -70, 75, 76]]
          }, {
            type: "Polygon",
            properties: {
              name: "Bangladesh"
            },
            id: "BGD",
            arcs: [[77, 78, 79]]
          }, {
            type: "Polygon",
            properties: {
              name: "Bulgaria"
            },
            id: "BGR",
            arcs: [[80, 81, 82, 83, 84, 85]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "The Bahamas"
            },
            id: "BHS",
            arcs: [[[86]], [[87]], [[88]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Bosnia and Herzegovina"
            },
            id: "BIH",
            arcs: [[89, 90, 91]]
          }, {
            type: "Polygon",
            properties: {
              name: "Belarus"
            },
            id: "BLR",
            arcs: [[92, 93, 94, 95, 96]]
          }, {
            type: "Polygon",
            properties: {
              name: "Belize"
            },
            id: "BLZ",
            arcs: [[97, 98, 99]]
          }, {
            type: "Polygon",
            properties: {
              name: "Bolivia"
            },
            id: "BOL",
            arcs: [[100, 101, 102, 103, -31]]
          }, {
            type: "Polygon",
            properties: {
              name: "Brazil"
            },
            id: "BRA",
            arcs: [[-27, 104, -103, 105, 106, 107, 108, 109, 110, 111, 112]]
          }, {
            type: "Polygon",
            properties: {
              name: "Brunei"
            },
            id: "BRN",
            arcs: [[113, 114]]
          }, {
            type: "Polygon",
            properties: {
              name: "Bhutan"
            },
            id: "BTN",
            arcs: [[115, 116]]
          }, {
            type: "Polygon",
            properties: {
              name: "Botswana"
            },
            id: "BWA",
            arcs: [[117, 118, 119, 120]]
          }, {
            type: "Polygon",
            properties: {
              name: "Central African Republic"
            },
            id: "CAF",
            arcs: [[121, 122, 123, 124, 125, 126, 127]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Canada"
            },
            id: "CAN",
            arcs: [[[128]], [[129]], [[130]], [[131]], [[132]], [[133]], [[134]], [[135]], [[136]], [[137]], [[138, 139, 140, 141]], [[142]], [[143]], [[144]], [[145]], [[146]], [[147]], [[148]], [[149]], [[150]], [[151]], [[152]], [[153]], [[154]], [[155]], [[156]], [[157]], [[158]], [[159]], [[160]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Switzerland"
            },
            id: "CHE",
            arcs: [[-51, 161, 162, 163]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Chile"
            },
            id: "CHL",
            arcs: [[[-24, 164]], [[-30, 165, 166, -101]]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "China"
            },
            id: "CHN",
            arcs: [[[167]], [[168, 169, 170, 171, 172, 173, -117, 174, 175, 176, 177, -4, 178, 179, 180, 181, 182, 183]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ivory Coast"
            },
            id: "CIV",
            arcs: [[184, 185, 186, 187, -73, 188]]
          }, {
            type: "Polygon",
            properties: {
              name: "Cameroon"
            },
            id: "CMR",
            arcs: [[189, 190, 191, 192, 193, 194, -128, 195]]
          }, {
            type: "Polygon",
            properties: {
              name: "Democratic Republic of the Congo"
            },
            id: "COD",
            arcs: [[196, 197, -60, 198, 199, -10, 200, -13, 201, -126, 202]]
          }, {
            type: "Polygon",
            properties: {
              name: "Republic of the Congo"
            },
            id: "COG",
            arcs: [[-12, 203, 204, -196, -127, -202]]
          }, {
            type: "Polygon",
            properties: {
              name: "Colombia"
            },
            id: "COL",
            arcs: [[205, 206, 207, 208, 209, -107, 210]]
          }, {
            type: "Polygon",
            properties: {
              name: "Costa Rica"
            },
            id: "CRI",
            arcs: [[211, 212, 213, 214]]
          }, {
            type: "Polygon",
            properties: {
              name: "Cuba"
            },
            id: "CUB",
            arcs: [[215]]
          }, {
            type: "Polygon",
            properties: {
              name: "Northern Cyprus"
            },
            id: "-99",
            arcs: [[216, 217]]
          }, {
            type: "Polygon",
            properties: {
              name: "Cyprus"
            },
            id: "CYP",
            arcs: [[218, -218]]
          }, {
            type: "Polygon",
            properties: {
              name: "Czech Republic"
            },
            id: "CZE",
            arcs: [[-53, 219, 220, 221]]
          }, {
            type: "Polygon",
            properties: {
              name: "Germany"
            },
            id: "DEU",
            arcs: [[222, 223, -220, -52, -164, 224, 225, -64, 226, 227, 228]]
          }, {
            type: "Polygon",
            properties: {
              name: "Djibouti"
            },
            id: "DJI",
            arcs: [[229, 230, 231, 232]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Denmark"
            },
            id: "DNK",
            arcs: [[[233]], [[-229, 234]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Dominican Republic"
            },
            id: "DOM",
            arcs: [[235, 236]]
          }, {
            type: "Polygon",
            properties: {
              name: "Algeria"
            },
            id: "DZA",
            arcs: [[237, 238, 239, 240, 241, 242, 243, 244]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ecuador"
            },
            id: "ECU",
            arcs: [[245, -206, 246]]
          }, {
            type: "Polygon",
            properties: {
              name: "Egypt"
            },
            id: "EGY",
            arcs: [[247, 248, 249, 250, 251]]
          }, {
            type: "Polygon",
            properties: {
              name: "Eritrea"
            },
            id: "ERI",
            arcs: [[252, 253, 254, -233]]
          }, {
            type: "Polygon",
            properties: {
              name: "Spain"
            },
            id: "ESP",
            arcs: [[255, 256, 257, 258]]
          }, {
            type: "Polygon",
            properties: {
              name: "Estonia"
            },
            id: "EST",
            arcs: [[259, 260, 261]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ethiopia"
            },
            id: "ETH",
            arcs: [[-232, 262, 263, 264, 265, 266, 267, -253]]
          }, {
            type: "Polygon",
            properties: {
              name: "Finland"
            },
            id: "FIN",
            arcs: [[268, 269, 270, 271]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Fiji"
            },
            id: "FJI",
            arcs: [[[272]], [[273, 274]], [[275, -275]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Falkland Islands"
            },
            id: "FLK",
            arcs: [[276]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "France"
            },
            id: "FRA",
            arcs: [[[277]], [[278, -225, -163, 279, 280, -257, 281, -66]]]
          }, {
            type: "Polygon",
            properties: {
              name: "French Guiana"
            },
            id: "GUF",
            arcs: [[282, 283, 284, 285, -111]]
          }, {
            type: "Polygon",
            properties: {
              name: "Gabon"
            },
            id: "GAB",
            arcs: [[286, 287, -190, -205]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "United Kingdom"
            },
            id: "GBR",
            arcs: [[[288, 289]], [[290]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Georgia"
            },
            id: "GEO",
            arcs: [[291, 292, -58, -32, 293]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ghana"
            },
            id: "GHA",
            arcs: [[294, -189, -77, 295]]
          }, {
            type: "Polygon",
            properties: {
              name: "Guinea"
            },
            id: "GIN",
            arcs: [[296, 297, 298, 299, 300, 301, -187]]
          }, {
            type: "Polygon",
            properties: {
              name: "Gambia"
            },
            id: "GMB",
            arcs: [[302, 303]]
          }, {
            type: "Polygon",
            properties: {
              name: "Guinea Bissau"
            },
            id: "GNB",
            arcs: [[304, 305, -300]]
          }, {
            type: "Polygon",
            properties: {
              name: "Equatorial Guinea"
            },
            id: "GNQ",
            arcs: [[306, -191, -288]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Greece"
            },
            id: "GRC",
            arcs: [[[307]], [[308, -15, 309, -84, 310]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Greenland"
            },
            id: "GRL",
            arcs: [[311]]
          }, {
            type: "Polygon",
            properties: {
              name: "Guatemala"
            },
            id: "GTM",
            arcs: [[312, 313, -100, 314, 315, 316]]
          }, {
            type: "Polygon",
            properties: {
              name: "Guyana"
            },
            id: "GUY",
            arcs: [[317, 318, -109, 319]]
          }, {
            type: "Polygon",
            properties: {
              name: "Honduras"
            },
            id: "HND",
            arcs: [[320, 321, -316, 322, 323]]
          }, {
            type: "Polygon",
            properties: {
              name: "Croatia"
            },
            id: "HRV",
            arcs: [[324, -92, 325, 326, 327, 328]]
          }, {
            type: "Polygon",
            properties: {
              name: "Haiti"
            },
            id: "HTI",
            arcs: [[-237, 329]]
          }, {
            type: "Polygon",
            properties: {
              name: "Hungary"
            },
            id: "HUN",
            arcs: [[-48, 330, 331, 332, 333, -329, 334]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Indonesia"
            },
            id: "IDN",
            arcs: [[[335]], [[336, 337]], [[338]], [[339]], [[340]], [[341]], [[342]], [[343]], [[344, 345]], [[346]], [[347]], [[348, 349]], [[350]]]
          }, {
            type: "Polygon",
            properties: {
              name: "India"
            },
            id: "IND",
            arcs: [[-177, 351, -175, -116, -174, 352, -80, 353, 354]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ireland"
            },
            id: "IRL",
            arcs: [[355, -289]]
          }, {
            type: "Polygon",
            properties: {
              name: "Iran"
            },
            id: "IRN",
            arcs: [[356, -6, 357, 358, 359, 360, -55, -34, -57, 361]]
          }, {
            type: "Polygon",
            properties: {
              name: "Iraq"
            },
            id: "IRQ",
            arcs: [[362, 363, 364, 365, 366, 367, -360]]
          }, {
            type: "Polygon",
            properties: {
              name: "Iceland"
            },
            id: "ISL",
            arcs: [[368]]
          }, {
            type: "Polygon",
            properties: {
              name: "Israel"
            },
            id: "ISR",
            arcs: [[369, 370, 371, -252, 372, 373, 374]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Italy"
            },
            id: "ITA",
            arcs: [[[375]], [[376]], [[377, 378, -280, -162, -50]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Jamaica"
            },
            id: "JAM",
            arcs: [[379]]
          }, {
            type: "Polygon",
            properties: {
              name: "Jordan"
            },
            id: "JOR",
            arcs: [[-370, 380, -366, 381, 382, -372, 383]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Japan"
            },
            id: "JPN",
            arcs: [[[384]], [[385]], [[386]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Kazakhstan"
            },
            id: "KAZ",
            arcs: [[387, 388, 389, 390, -181, 391]]
          }, {
            type: "Polygon",
            properties: {
              name: "Kenya"
            },
            id: "KEN",
            arcs: [[392, 393, 394, 395, -265, 396]]
          }, {
            type: "Polygon",
            properties: {
              name: "Kyrgyzstan"
            },
            id: "KGZ",
            arcs: [[-392, -180, 397, 398]]
          }, {
            type: "Polygon",
            properties: {
              name: "Cambodia"
            },
            id: "KHM",
            arcs: [[399, 400, 401, 402]]
          }, {
            type: "Polygon",
            properties: {
              name: "South Korea"
            },
            id: "KOR",
            arcs: [[403, 404]]
          }, {
            type: "Polygon",
            properties: {
              name: "Kosovo"
            },
            id: "-99",
            arcs: [[-18, 405, 406, 407]]
          }, {
            type: "Polygon",
            properties: {
              name: "Kuwait"
            },
            id: "KWT",
            arcs: [[408, 409, -364]]
          }, {
            type: "Polygon",
            properties: {
              name: "Laos"
            },
            id: "LAO",
            arcs: [[410, 411, -172, 412, -401]]
          }, {
            type: "Polygon",
            properties: {
              name: "Lebanon"
            },
            id: "LBN",
            arcs: [[-374, 413, 414]]
          }, {
            type: "Polygon",
            properties: {
              name: "Liberia"
            },
            id: "LBR",
            arcs: [[415, 416, -297, -186]]
          }, {
            type: "Polygon",
            properties: {
              name: "Libya"
            },
            id: "LBY",
            arcs: [[417, -245, 418, 419, -250, 420, 421]]
          }, {
            type: "Polygon",
            properties: {
              name: "Sri Lanka"
            },
            id: "LKA",
            arcs: [[422]]
          }, {
            type: "Polygon",
            properties: {
              name: "Lesotho"
            },
            id: "LSO",
            arcs: [[423]]
          }, {
            type: "Polygon",
            properties: {
              name: "Lithuania"
            },
            id: "LTU",
            arcs: [[424, 425, 426, -93, 427]]
          }, {
            type: "Polygon",
            properties: {
              name: "Luxembourg"
            },
            id: "LUX",
            arcs: [[-226, -279, -65]]
          }, {
            type: "Polygon",
            properties: {
              name: "Latvia"
            },
            id: "LVA",
            arcs: [[428, -262, 429, -94, -427]]
          }, {
            type: "Polygon",
            properties: {
              name: "Morocco"
            },
            id: "MAR",
            arcs: [[-242, 430, 431]]
          }, {
            type: "Polygon",
            properties: {
              name: "Moldova"
            },
            id: "MDA",
            arcs: [[432, 433]]
          }, {
            type: "Polygon",
            properties: {
              name: "Madagascar"
            },
            id: "MDG",
            arcs: [[434]]
          }, {
            type: "Polygon",
            properties: {
              name: "Mexico"
            },
            id: "MEX",
            arcs: [[435, -98, -314, 436, 437]]
          }, {
            type: "Polygon",
            properties: {
              name: "Macedonia"
            },
            id: "MKD",
            arcs: [[-408, 438, -85, -310, -14]]
          }, {
            type: "Polygon",
            properties: {
              name: "Mali"
            },
            id: "MLI",
            arcs: [[439, -239, 440, -74, -188, -302, 441]]
          }, {
            type: "Polygon",
            properties: {
              name: "Myanmar"
            },
            id: "MMR",
            arcs: [[442, -78, -353, -173, -412, 443]]
          }, {
            type: "Polygon",
            properties: {
              name: "Montenegro"
            },
            id: "MNE",
            arcs: [[444, -326, -91, 445, -406, -17]]
          }, {
            type: "Polygon",
            properties: {
              name: "Mongolia"
            },
            id: "MNG",
            arcs: [[446, -183]]
          }, {
            type: "Polygon",
            properties: {
              name: "Mozambique"
            },
            id: "MOZ",
            arcs: [[447, 448, 449, 450, 451, 452, 453, 454]]
          }, {
            type: "Polygon",
            properties: {
              name: "Mauritania"
            },
            id: "MRT",
            arcs: [[455, 456, 457, -240, -440]]
          }, {
            type: "Polygon",
            properties: {
              name: "Malawi"
            },
            id: "MWI",
            arcs: [[-455, 458, 459]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Malaysia"
            },
            id: "MYS",
            arcs: [[[460, 461]], [[-349, 462, -115, 463]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Namibia"
            },
            id: "NAM",
            arcs: [[464, -8, 465, -119, 466]]
          }, {
            type: "Polygon",
            properties: {
              name: "New Caledonia"
            },
            id: "NCL",
            arcs: [[467]]
          }, {
            type: "Polygon",
            properties: {
              name: "Niger"
            },
            id: "NER",
            arcs: [[-75, -441, -238, -418, 468, -194, 469, -71]]
          }, {
            type: "Polygon",
            properties: {
              name: "Nigeria"
            },
            id: "NGA",
            arcs: [[470, -72, -470, -193]]
          }, {
            type: "Polygon",
            properties: {
              name: "Nicaragua"
            },
            id: "NIC",
            arcs: [[471, -324, 472, -213]]
          }, {
            type: "Polygon",
            properties: {
              name: "Netherlands"
            },
            id: "NLD",
            arcs: [[-227, -63, 473]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Norway"
            },
            id: "NOR",
            arcs: [[[474, -272, 475, 476]], [[477]], [[478]], [[479]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Nepal"
            },
            id: "NPL",
            arcs: [[-352, -176]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "New Zealand"
            },
            id: "NZL",
            arcs: [[[480]], [[481]]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Oman"
            },
            id: "OMN",
            arcs: [[[482, 483, -22, 484]], [[-20, 485]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Pakistan"
            },
            id: "PAK",
            arcs: [[-178, -355, 486, -358, -5]]
          }, {
            type: "Polygon",
            properties: {
              name: "Panama"
            },
            id: "PAN",
            arcs: [[487, -215, 488, -208]]
          }, {
            type: "Polygon",
            properties: {
              name: "Peru"
            },
            id: "PER",
            arcs: [[-167, 489, -247, -211, -106, -102]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Philippines"
            },
            id: "PHL",
            arcs: [[[490]], [[491]], [[492]], [[493]], [[494]], [[495]], [[496]]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Papua New Guinea"
            },
            id: "PNG",
            arcs: [[[497]], [[498]], [[-345, 499]], [[500]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Poland"
            },
            id: "POL",
            arcs: [[-224, 501, 502, -428, -97, 503, 504, -221]]
          }, {
            type: "Polygon",
            properties: {
              name: "Puerto Rico"
            },
            id: "PRI",
            arcs: [[505]]
          }, {
            type: "Polygon",
            properties: {
              name: "North Korea"
            },
            id: "PRK",
            arcs: [[506, 507, -405, 508, -169]]
          }, {
            type: "Polygon",
            properties: {
              name: "Portugal"
            },
            id: "PRT",
            arcs: [[-259, 509]]
          }, {
            type: "Polygon",
            properties: {
              name: "Paraguay"
            },
            id: "PRY",
            arcs: [[-104, -105, -26]]
          }, {
            type: "Polygon",
            properties: {
              name: "Qatar"
            },
            id: "QAT",
            arcs: [[510, 511]]
          }, {
            type: "Polygon",
            properties: {
              name: "Romania"
            },
            id: "ROU",
            arcs: [[512, -434, 513, 514, -81, 515, -333]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Russia"
            },
            id: "RUS",
            arcs: [[[516]], [[-503, 517, -425]], [[518, 519]], [[520]], [[521]], [[522]], [[523]], [[524]], [[525]], [[526, -507, -184, -447, -182, -391, 527, -59, -293, 528, 529, -95, -430, -261, 530, -269, -475, 531, -520]], [[532]], [[533]], [[534]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Rwanda"
            },
            id: "RWA",
            arcs: [[535, -61, -198, 536]]
          }, {
            type: "Polygon",
            properties: {
              name: "Western Sahara"
            },
            id: "ESH",
            arcs: [[-241, -458, 537, -431]]
          }, {
            type: "Polygon",
            properties: {
              name: "Saudi Arabia"
            },
            id: "SAU",
            arcs: [[538, -382, -365, -410, 539, -512, 540, -23, -484, 541]]
          }, {
            type: "Polygon",
            properties: {
              name: "Sudan"
            },
            id: "SDN",
            arcs: [[542, 543, -123, 544, -421, -249, 545, -254, -268, 546]]
          }, {
            type: "Polygon",
            properties: {
              name: "South Sudan"
            },
            id: "SSD",
            arcs: [[547, -266, -396, 548, -203, -125, 549, -543]]
          }, {
            type: "Polygon",
            properties: {
              name: "Senegal"
            },
            id: "SEN",
            arcs: [[550, -456, -442, -301, -306, 551, -304]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Solomon Islands"
            },
            id: "SLB",
            arcs: [[[552]], [[553]], [[554]], [[555]], [[556]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Sierra Leone"
            },
            id: "SLE",
            arcs: [[557, -298, -417]]
          }, {
            type: "Polygon",
            properties: {
              name: "El Salvador"
            },
            id: "SLV",
            arcs: [[558, -317, -322]]
          }, {
            type: "Polygon",
            properties: {
              name: "Somaliland"
            },
            id: "-99",
            arcs: [[-263, -231, 559, 560]]
          }, {
            type: "Polygon",
            properties: {
              name: "Somalia"
            },
            id: "SOM",
            arcs: [[-397, -264, -561, 561]]
          }, {
            type: "Polygon",
            properties: {
              name: "Republic of Serbia"
            },
            id: "SRB",
            arcs: [[-86, -439, -407, -446, -90, -325, -334, -516]]
          }, {
            type: "Polygon",
            properties: {
              name: "Suriname"
            },
            id: "SUR",
            arcs: [[562, -285, 563, -283, -110, -319]]
          }, {
            type: "Polygon",
            properties: {
              name: "Slovakia"
            },
            id: "SVK",
            arcs: [[-505, 564, -331, -54, -222]]
          }, {
            type: "Polygon",
            properties: {
              name: "Slovenia"
            },
            id: "SVN",
            arcs: [[-49, -335, -328, 565, -378]]
          }, {
            type: "Polygon",
            properties: {
              name: "Sweden"
            },
            id: "SWE",
            arcs: [[-476, -271, 566]]
          }, {
            type: "Polygon",
            properties: {
              name: "Swaziland"
            },
            id: "SWZ",
            arcs: [[567, -451]]
          }, {
            type: "Polygon",
            properties: {
              name: "Syria"
            },
            id: "SYR",
            arcs: [[-381, -375, -415, 568, 569, -367]]
          }, {
            type: "Polygon",
            properties: {
              name: "Chad"
            },
            id: "TCD",
            arcs: [[-469, -422, -545, -122, -195]]
          }, {
            type: "Polygon",
            properties: {
              name: "Togo"
            },
            id: "TGO",
            arcs: [[570, -296, -76, -69]]
          }, {
            type: "Polygon",
            properties: {
              name: "Thailand"
            },
            id: "THA",
            arcs: [[571, -462, 572, -444, -411, -400]]
          }, {
            type: "Polygon",
            properties: {
              name: "Tajikistan"
            },
            id: "TJK",
            arcs: [[-398, -179, -3, 573]]
          }, {
            type: "Polygon",
            properties: {
              name: "Turkmenistan"
            },
            id: "TKM",
            arcs: [[-357, 574, -389, 575, -1]]
          }, {
            type: "Polygon",
            properties: {
              name: "East Timor"
            },
            id: "TLS",
            arcs: [[576, -337]]
          }, {
            type: "Polygon",
            properties: {
              name: "Trinidad and Tobago"
            },
            id: "TTO",
            arcs: [[577]]
          }, {
            type: "Polygon",
            properties: {
              name: "Tunisia"
            },
            id: "TUN",
            arcs: [[-244, 578, -419]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Turkey"
            },
            id: "TUR",
            arcs: [[[-294, -36, -361, -368, -570, 579]], [[-311, -83, 580]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Taiwan"
            },
            id: "TWN",
            arcs: [[581]]
          }, {
            type: "Polygon",
            properties: {
              name: "United Republic of Tanzania"
            },
            id: "TZA",
            arcs: [[-394, 582, -448, -460, 583, -199, -62, -536, 584]]
          }, {
            type: "Polygon",
            properties: {
              name: "Uganda"
            },
            id: "UGA",
            arcs: [[-537, -197, -549, -395, -585]]
          }, {
            type: "Polygon",
            properties: {
              name: "Ukraine"
            },
            id: "UKR",
            arcs: [[-530, 585, -514, -433, -513, -332, -565, -504, -96]]
          }, {
            type: "Polygon",
            properties: {
              name: "Uruguay"
            },
            id: "URY",
            arcs: [[-113, 586, -28]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "United States of America"
            },
            id: "USA",
            arcs: [[[587]], [[588]], [[589]], [[590]], [[591]], [[592, -438, 593, -139]], [[594]], [[595]], [[596]], [[-141, 597]]]
          }, {
            type: "Polygon",
            properties: {
              name: "Uzbekistan"
            },
            id: "UZB",
            arcs: [[-576, -388, -399, -574, -2]]
          }, {
            type: "Polygon",
            properties: {
              name: "Venezuela"
            },
            id: "VEN",
            arcs: [[598, -320, -108, -210]]
          }, {
            type: "Polygon",
            properties: {
              name: "Vietnam"
            },
            id: "VNM",
            arcs: [[599, -402, -413, -171]]
          }, {
            type: "MultiPolygon",
            properties: {
              name: "Vanuatu"
            },
            id: "VUT",
            arcs: [[[600]], [[601]]]
          }, {
            type: "Polygon",
            properties: {
              name: "West Bank"
            },
            id: "PSE",
            arcs: [[-384, -371]]
          }, {
            type: "Polygon",
            properties: {
              name: "Yemen"
            },
            id: "YEM",
            arcs: [[602, -542, -483]]
          }, {
            type: "Polygon",
            properties: {
              name: "South Africa"
            },
            id: "ZAF",
            arcs: [[-467, -118, 603, -452, -568, -450, 604], [-424]]
          }, {
            type: "Polygon",
            properties: {
              name: "Zambia"
            },
            id: "ZMB",
            arcs: [[-459, -454, 605, -120, -466, -7, -200, -584]]
          }, {
            type: "Polygon",
            properties: {
              name: "Zimbabwe"
            },
            id: "ZWE",
            arcs: [[-604, -121, -606, -453]]
          }]
        }
      },
      arcs: [[[6700, 7164], [28, -23], [21, 8], [6, 27], [22, 9], [15, 18], [6, 47], [23, 11], [5, 21], [13, -15], [8, -2]], [[6847, 7265], [16, -1], [20, -12]], [[6883, 7252], [9, -7], [20, 19], [9, -12], [9, 27], [17, -1], [4, 9], [3, 24], [12, 20], [15, -13], [-3, -18], [9, -3], [-3, -50], [11, -19], [10, 12], [12, 6], [17, 27], [19, -5], [29, 0]], [[7082, 7268], [5, -17]], [[7087, 7251], [-16, -6], [-14, -11], [-32, -7], [-30, -13], [-16, -25], [6, -25], [4, -30], [-14, -25], [1, -22], [-8, -22], [-26, 2], [11, -39], [-18, -15], [-12, -35], [2, -36], [-11, -16], [-10, 5], [-22, -8], [-3, -16], [-20, 0], [-16, -34], [-1, -50], [-36, -24], [-19, 5], [-6, -13], [-16, 7], [-28, -8], [-47, 30]], [[6690, 6820], [25, 53], [-2, 38], [-21, 10], [-2, 38], [-9, 47], [12, 32], [-12, 9], [7, 43], [12, 74]], [[5664, 4412], [3, -18], [-4, -29], [5, -28], [-4, -22], [3, -20], [-58, 1], [-2, -188], [19, -49], [18, -37]], [[5644, 4022], [-51, -24], [-67, 9], [-19, 28], [-113, -3], [-4, -4], [-17, 27], [-18, 2], [-16, -10], [-14, -12]], [[5325, 4035], [-2, 38], [4, 51], [9, 55], [2, 25], [9, 53], [6, 24], [16, 39], [9, 26], [3, 44], [-1, 34], [-9, 21], [-7, 36], [-7, 35], [2, 12], [8, 24], [-8, 57], [-6, 39], [-14, 38], [3, 11]], [[5342, 4697], [11, 8], [8, -1], [10, 7], [82, -1], [7, -44], [8, -35], [6, -19], [11, -31], [18, 5], [9, 8], [16, -8], [4, 14], [7, 35], [17, 2], [2, 10], [14, 1], [-3, -22], [34, 1], [1, -37], [5, -23], [-4, -36], [2, -36], [9, -22], [-1, -70], [7, 5], [12, -1], [17, 8], [13, -3]], [[5338, 4715], [-8, 45]], [[5330, 4760], [12, 25], [8, 10], [10, -20]], [[5360, 4775], [-10, -12], [-4, -16], [-1, -25], [-7, -7]], [[5571, 7530], [-3, -20], [4, -25], [11, -15]], [[5583, 7470], [0, -15], [-9, -9], [-2, -19], [-13, -29]], [[5559, 7398], [-5, 5], [0, 13], [-15, 19], [-3, 29], [2, 40], [4, 18], [-4, 10]], [[5538, 7532], [-2, 18], [12, 29], [1, -11], [8, 6]], [[5557, 7574], [6, -16], [7, -6], [1, -22]], [[6432, 6490], [5, 3], [1, -16], [22, 9], [23, -2], [17, -1], [19, 39], [20, 38], [18, 37]], [[6557, 6597], [5, -20]], [[6562, 6577], [4, -47]], [[6566, 6530], [-14, 0], [-3, -39], [5, -8], [-12, -12], [0, -24], [-8, -24], [-1, -24]], [[6533, 6399], [-6, -12], [-83, 29], [-11, 60], [-1, 14]], [[3140, 1814], [-17, 2], [-30, 0], [0, 132]], [[3093, 1948], [11, -27], [14, -45], [36, -35], [39, -15], [-13, -30], [-26, -2], [-14, 20]], [[3258, 3743], [51, -96], [23, -9], [34, -44], [29, -23], [4, -26], [-28, -90], [28, -16], [32, -9], [22, 10], [25, 45], [4, 52]], [[3482, 3537], [14, 11], [14, -34], [-1, -47], [-23, -33], [-19, -24], [-31, -57], [-37, -81]], [[3399, 3272], [-7, -47], [-7, -61], [0, -58], [-6, -14], [-2, -38]], [[3377, 3054], [-2, -31], [35, -50], [-4, -41], [18, -26], [-2, -29], [-26, -75], [-42, -32], [-55, -12], [-31, 6], [6, -36], [-6, -44], [5, -30], [-16, -20], [-29, -8], [-26, 21], [-11, -15], [4, -59], [18, -18], [16, 19], [8, -31], [-26, -18], [-22, -37], [-4, -59], [-7, -32], [-26, 0], [-22, -31], [-8, -44], [28, -43], [26, -12], [-9, -53], [-33, -33], [-18, -70], [-25, -23], [-12, -28], [9, -61], [19, -34], [-12, 3]], [[3095, 1968], [-26, 9], [-67, 8], [-11, 34], [0, 45], [-18, -4], [-10, 21], [-3, 63], [22, 26], [9, 37], [-4, 30], [15, 51], [10, 78], [-3, 35], [12, 11], [-3, 22], [-13, 12], [10, 25], [-13, 22], [-6, 68], [11, 12], [-5, 72], [7, 61], [7, 52], [17, 22], [-9, 58], [0, 54], [21, 38], [-1, 50], [16, 57], [0, 55], [-7, 11], [-13, 102], [17, 60], [-2, 58], [10, 53], [18, 56], [20, 36], [-9, 24], [6, 19], [-1, 98], [30, 29], [10, 62], [-3, 14]], [[3136, 3714], [23, 54], [36, -15], [16, -42], [11, 47], [32, -2], [4, -13]], [[6210, 7485], [39, 9]], [[6249, 7494], [5, -15], [11, -10], [-6, -15], [15, -21], [-8, -18], [12, -16], [13, -10], [0, -41]], [[6291, 7348], [-10, -2]], [[6281, 7346], [-11, 34], [0, 10], [-12, -1], [-9, 16], [-5, -1]], [[6244, 7404], [-11, 17], [-21, 15], [3, 28], [-5, 21]], [[3345, 329], [-8, -30], [-8, -27], [-59, 8], [-62, -3], [-34, 20], [0, 2], [-16, 17], [63, -2], [60, -6], [20, 24], [15, 21], [29, -24]], [[577, 361], [-53, -8], [-36, 21], [-17, 21], [-1, 3], [-18, 16], [17, 22], [52, -9], [28, -18], [21, -21], [7, -27]], [[3745, 447], [35, -26], [12, -36], [3, -25], [1, -30], [-43, -19], [-45, -15], [-52, -14], [-59, -11], [-65, 3], [-37, 20], [5, 24], [59, 16], [24, 20], [18, 26], [12, 22], [17, 20], [18, 25], [14, 0], [41, 12], [42, -12]], [[1633, 715], [36, -9], [33, 10], [-16, -20], [-26, -15], [-39, 4], [-27, 21], [6, 20], [33, -11]], [[1512, 716], [43, -23], [-17, 3], [-36, 5], [-38, 17], [20, 12], [28, -14]], [[2250, 808], [31, -8], [30, 7], [17, -34], [-22, 5], [-34, -2], [-34, 2], [-38, -4], [-28, 12], [-15, 24], [18, 11], [35, -8], [40, -5]], [[3098, 866], [4, -27], [-5, -23], [-8, -22], [-33, -8], [-31, -12], [-36, 1], [14, 24], [-33, -9], [-31, -8], [-21, 18], [-2, 24], [30, 23], [20, 7], [32, -2], [8, 30], [1, 22], [0, 47], [16, 28], [25, 9], [15, -22], [6, -22], [12, -26], [10, -26], [7, -26]], [[3371, 1268], [-11, -13], [-21, 9], [-23, -6], [-19, -14], [-20, -15], [-14, -17], [-4, -23], [2, -22], [13, -20], [-19, -14], [-26, -4], [-15, -20], [-17, -19], [-17, -25], [-4, -22], [9, -24], [15, -19], [23, -14], [21, -18], [12, -23], [6, -22], [8, -24], [13, -19], [8, -22], [4, -55], [8, -22], [2, -23], [9, -23], [-4, -31], [-15, -24], [-17, -20], [-37, -8], [-12, -21], [-17, -20], [-42, -22], [-37, -9], [-35, -13], [-37, -13], [-22, -24], [-45, -2], [-49, 2], [-44, -4], [-47, 0], [9, -24], [42, -10], [31, -16], [18, -21], [-31, -19], [-48, 6], [-40, -15], [-2, -24], [-1, -23], [33, -20], [6, -22], [35, -22], [59, -9], [50, -16], [40, -19], [50, -18], [70, -10], [68, -16], [47, -17], [52, -20], [27, -28], [13, -22], [34, 21], [46, 17], [48, 19], [58, 15], [49, 16], [69, 1], [68, -8], [56, -14], [18, 26], [39, 17], [70, 1], [55, 13], [52, 13], [58, 8], [62, 10], [43, 15], [-20, 21], [-12, 21], [0, 22], [-54, -2], [-57, -10], [-54, 0], [-8, 22], [4, 44], [12, 13], [40, 14], [47, 14], [34, 17], [33, 18], [25, 23], [38, 10], [38, 8], [19, 5], [43, 2], [41, 8], [34, 12], [34, 14], [30, 14], [39, 18], [24, 20], [26, 17], [9, 24], [-30, 13], [10, 25], [18, 18], [29, 12], [31, 14], [28, 18], [22, 23], [13, 28], [21, 16], [33, -3], [13, -20], [34, -2], [1, 22], [14, 23], [30, -6], [7, -22], [33, -3], [36, 10], [35, 7], [31, -3], [12, -25], [31, 20], [28, 10], [31, 9], [31, 8], [29, 14], [31, 9], [24, 13], [17, 20], [20, -15], [29, 8], [20, -27], [16, -21], [32, 11], [12, 24], [28, 16], [37, -4], [11, -22], [22, 22], [30, 7], [33, 3], [29, -2], [31, -7], [30, -3], [13, -20], [18, -17], [31, 10], [32, 3], [32, 0], [31, 1], [28, 8], [29, 7], [25, 16], [26, 11], [28, 5], [21, 17], [15, 32], [16, 20], [29, -10], [11, -21], [24, -13], [29, 4], [19, -21], [21, -15], [28, 14], [10, 26], [25, 10], [29, 20], [27, 8], [33, 11], [22, 13], [22, 14], [22, 13], [26, -7], [25, 21], [18, 16], [26, -1], [23, 14], [6, 21], [23, 16], [23, 11], [28, 10], [25, 4], [25, -3], [26, -6], [22, -16], [3, -26], [24, -19], [17, -17], [33, -7], [19, -16], [23, -16], [26, -3], [23, 11], [24, 24], [26, -12], [27, -7], [26, -7], [27, -5], [28, 0], [23, -61], [-1, -15], [-4, -27], [-26, -15], [-22, -22], [4, -23], [31, 1], [-4, -23], [-14, -22], [-13, -24], [21, -19], [32, -6], [32, 11], [15, 23], [10, 22], [15, 18], [17, 18], [7, 21], [15, 29], [18, 5], [31, 3], [28, 7], [28, 9], [14, 23], [8, 22], [19, 22], [27, 15], [23, 12], [16, 19], [15, 11], [21, 9], [27, -6], [25, 6], [28, 7], [30, -4], [20, 17], [14, 39], [11, -16], [13, -28], [23, -12], [27, -4], [26, 7], [29, -5], [26, -1], [17, 6], [24, -4], [21, -12], [25, 8], [30, 0], [25, 8], [29, -8], [19, 19], [14, 20], [19, 16], [35, 44], [18, -8], [21, -16], [18, -21], [36, -36], [27, -1], [25, 0], [30, 7], [30, 8], [23, 16], [19, 18], [31, 2], [21, 13], [22, -12], [14, -18], [19, -19], [31, 2], [19, -15], [33, -15], [35, -5], [29, 4], [21, 19], [19, 18], [25, 5], [25, -8], [29, -6], [26, 9], [25, 0], [24, -6], [26, -5], [25, 10], [30, 9], [28, 3], [32, 0], [25, 5], [25, 5], [8, 29], [1, 24], [17, -16], [5, -27], [10, -24], [11, -20], [23, -10], [32, 4], [36, 1], [25, 3], [37, 0], [26, 1], [36, -2], [31, -5], [20, -18], [-5, -22], [18, -18], [30, -13], [31, -15], [35, -11], [38, -9], [28, -9], [32, -2], [18, 20], [24, -16], [21, -19], [25, -13], [34, -6], [32, -7], [13, -23], [32, -14], [21, -21], [31, -9], [32, 1], [30, -4], [33, 1], [34, -4], [31, -8], [28, -14], [29, -12], [20, -17], [-3, -23], [-15, -21], [-13, -27], [-9, -21], [-14, -24], [-36, -9], [-16, -21], [-36, -13], [-13, -23], [-19, -22], [-20, -18], [-11, -25], [-7, -22], [-3, -26], [0, -22], [16, -23], [6, -22], [13, -21], [52, -8], [11, -26], [-50, -9], [-43, -13], [-52, -2], [-24, -34], [-5, -27], [-12, -22], [-14, -22], [37, -20], [14, -24], [24, -22], [33, -20], [39, -19], [42, -18], [64, -19], [14, -29], [80, -12], [5, -5], [21, -17], [77, 15], [63, -19], [48, -14], [-9997, -1], [24, 35], [50, -19], [3, 2], [30, 19], [4, 0], [3, -1], [40, -25], [35, 25], [7, 3], [81, 11], [27, -14], [13, -7], [41, -20], [79, -15], [63, -18], [107, -14], [80, 16], [118, -11], [67, -19], [73, 17], [78, 17], [6, 27], [-110, 3], [-89, 14], [-24, 23], [-74, 12], [5, 27], [10, 24], [10, 22], [-5, 25], [-46, 16], [-22, 21], [-43, 18], [68, -3], [64, 9], [40, -20], [50, 18], [45, 22], [23, 19], [-10, 25], [-36, 16], [-41, 17], [-57, 4], [-50, 8], [-54, 6], [-18, 22], [-36, 18], [-21, 21], [-9, 67], [14, -6], [25, -18], [45, 6], [44, 8], [23, -26], [44, 6], [37, 13], [35, 16], [32, 20], [41, 5], [-1, 22], [-9, 22], [8, 21], [36, 11], [16, -20], [42, 12], [32, 15], [40, 1], [38, 6], [37, 13], [30, 13], [34, 13], [22, -4], [19, -4], [41, 8], [37, -10], [38, 1], [37, 8], [37, -6], [41, -6], [39, 3], [40, -2], [42, -1], [38, 3], [28, 17], [34, 9], [35, -13], [33, 11], [30, 21], [18, -19], [9, -21], [18, -19], [29, 17], [33, -22], [38, -7], [32, -16], [39, 3], [36, 11], [41, -3], [38, -8], [38, -10], [15, 25], [-18, 20], [-14, 21], [-36, 5], [-15, 22], [-6, 22], [-10, 43], [21, -8], [36, -3], [36, 3], [33, -9], [28, -17], [12, -21], [38, -4], [36, 9], [38, 11], [34, 7], [28, -14], [37, 5], [24, 45], [23, -27], [32, -10], [34, 6], [23, -23], [37, -3], [33, -7], [34, -12], [21, 22], [11, 20], [28, -23], [38, 6], [28, -13], [19, -19], [37, 5], [29, 13], [29, 15], [33, 8], [39, 7], [36, 8], [27, 13], [16, 19], [7, 25], [-3, 24], [-9, 24], [-10, 23], [-9, 23], [-7, 21], [-1, 23], [2, 23], [13, 22], [11, 24], [5, 23], [-6, 26], [-3, 23], [14, 27], [15, 17], [18, 22], [19, 19], [22, 17], [11, 25], [15, 17], [18, 15], [26, 3], [18, 19], [19, 11], [23, 7], [20, 15], [16, 19], [22, 7], [16, -15], [-10, -20], [-29, -17]], [[6914, 2185], [18, -19], [26, -7], [1, -11], [-7, -27], [-43, -4], [-1, 31], [4, 25], [2, 12]], [[9038, 2648], [27, -21], [15, 8], [22, 12], [16, -4], [2, -70], [-9, -21], [-3, -47], [-10, 16], [-19, -41], [-6, 3], [-17, 2], [-17, 50], [-4, 39], [-16, 52], [1, 27], [18, -5]], [[8987, 4244], [10, -46], [18, 22], [9, -25], [13, -23], [-3, -26], [6, -51], [5, -29], [7, -7], [7, -51], [-3, -30], [9, -40], [31, -31], [19, -28], [19, -26], [-4, -14], [16, -37], [11, -64], [11, 13], [11, -26], [7, 9], [5, -63], [19, -36], [13, -22], [22, -48], [8, -48], [1, -33], [-2, -37], [13, -50], [-2, -52], [-5, -28], [-7, -52], [1, -34], [-6, -43], [-12, -53], [-21, -29], [-10, -46], [-9, -29], [-8, -51], [-11, -30], [-7, -44], [-4, -41], [2, -18], [-16, -21], [-31, -2], [-26, -24], [-13, -23], [-17, -26], [-23, 27], [-17, 10], [5, 31], [-15, -11], [-25, -43], [-24, 16], [-15, 9], [-16, 4], [-27, 17], [-18, 37], [-5, 45], [-7, 30], [-13, 24], [-27, 7], [9, 28], [-7, 44], [-13, -41], [-25, -11], [14, 33], [5, 34], [10, 29], [-2, 44], [-22, -50], [-18, -21], [-10, -47], [-22, 25], [1, 31], [-18, 43], [-14, 22], [5, 14], [-36, 35], [-19, 2], [-27, 29], [-50, -6], [-36, -21], [-31, -20], [-27, 4], [-29, -30], [-24, -14], [-6, -31], [-10, -24], [-23, -1], [-18, -5], [-24, 10], [-20, -6], [-19, -3], [-17, -31], [-8, 2], [-14, -16], [-13, -19], [-21, 2], [-18, 0], [-30, 38], [-15, 11], [1, 34], [14, 8], [4, 14], [-1, 21], [4, 41], [-3, 35], [-15, 60], [-4, 33], [1, 34], [-11, 38], [-1, 18], [-12, 23], [-4, 47], [-16, 46], [-4, 26], [13, -26], [-10, 55], [14, -17], [8, -23], [0, 30], [-14, 47], [-3, 18], [-6, 18], [3, 34], [6, 15], [4, 29], [-3, 35], [11, 42], [2, -45], [12, 41], [22, 20], [14, 25], [21, 22], [13, 4], [7, -7], [22, 22], [17, 6], [4, 13], [8, 6], [15, -2], [29, 18], [15, 26], [7, 31], [17, 30], [1, 24], [1, 32], [19, 50], [12, -51], [12, 12], [-10, 28], [9, 29], [12, -13], [3, 45], [15, 29], [7, 23], [14, 10], [0, 17], [13, -7], [0, 15], [12, 8], [14, 8], [20, -27], [16, -35], [17, 0], [18, -6], [-6, 33], [13, 47], [13, 15], [-5, 15], [12, 34], [17, 21], [14, -7], [24, 11], [-1, 30], [-20, 19], [15, 9], [18, -15], [15, -24], [23, -15], [8, 6], [17, -18], [17, 17], [10, -5], [7, 11], [12, -29], [-7, -32], [-11, -24], [-9, -2], [3, -23], [-8, -30], [-10, -29], [2, -17], [22, -32], [21, -19], [15, -20], [20, -35], [8, 0], [14, -15], [4, -19], [27, -20], [18, 20], [6, 32], [5, 26], [4, 33], [8, 47], [-4, 28], [2, 17], [-3, 34], [4, 45], [5, 12], [-4, 20], [7, 31], [5, 32], [1, 17], [10, 22], [8, -29], [2, -37], [7, -7], [1, -25], [10, -30], [2, -33], [-1, -22]], [[5471, 7900], [-2, -24], [-16, 0], [6, -13], [-9, -38]], [[5450, 7825], [-6, -10], [-24, -1], [-14, -13], [-23, 4]], [[5383, 7805], [-40, 15], [-6, 21], [-27, -10], [-4, -12], [-16, 9]], [[5290, 7828], [-15, 1], [-12, 11], [4, 15], [-1, 10]], [[5266, 7865], [8, 3], [14, -16], [4, 16], [25, -3], [20, 11], [13, -2], [9, -12], [2, 10], [-4, 38], [10, 8], [10, 27]], [[5377, 7945], [21, -19], [15, 24], [10, 5], [22, -18], [13, 3], [13, -12]], [[5471, 7928], [-3, -7], [3, -21]], [[6281, 7346], [-19, 8], [-14, 27], [-4, 23]], [[6349, 7527], [15, -31], [14, -42], [13, -2], [8, -16], [-23, -5], [-5, -46], [-4, -21], [-11, -13], [1, -30]], [[6357, 7321], [-7, -3], [-17, 31], [10, 30], [-9, 17], [-10, -4], [-33, -44]], [[6249, 7494], [6, 10], [21, -17], [15, -4], [4, 7], [-14, 32], [7, 9]], [[6288, 7531], [8, -2], [19, -36], [13, -4], [4, 15], [17, 23]], [[5814, 4792], [-1, 71], [-7, 27]], [[5806, 4890], [17, -5], [8, 34], [15, -4]], [[5846, 4915], [1, -23], [6, -14], [1, -19], [-7, -12], [-11, -31], [-10, -22], [-12, -2]], [[5092, 8091], [20, -5], [26, 12], [17, -25], [16, -14]], [[5171, 8059], [-4, -40]], [[5167, 8019], [-7, -2], [-3, -33]], [[5157, 7984], [-24, 26], [-14, -4], [-20, 28], [-13, 23], [-13, 1], [-4, 21]], [[5069, 8079], [23, 12]], [[5074, 5427], [-23, -7]], [[5051, 5420], [-7, 41], [2, 136], [-6, 12], [-1, 29], [-10, 21], [-8, 17], [3, 31]], [[5024, 5707], [10, 7], [6, 26], [13, 5], [6, 18]], [[5059, 5763], [10, 17], [10, 0], [21, -34]], [[5100, 5746], [-1, -19], [6, -35], [-6, -24], [3, -16], [-13, -37], [-9, -18], [-5, -37], [1, -38], [-2, -95]], [[4921, 5627], [-19, 15], [-13, -2], [-10, -15], [-12, 13], [-5, 19], [-13, 13]], [[4849, 5670], [-1, 34], [7, 26], [-1, 20], [23, 48], [4, 41], [7, 14], [14, -8], [11, 12], [4, 16], [22, 26], [5, 19], [26, 24], [15, 9], [7, -12], [18, 0]], [[5010, 5939], [-2, -28], [3, -27], [16, -39], [1, -28], [32, -14], [-1, -40]], [[5024, 5707], [-24, 1]], [[5000, 5708], [-13, 5], [-9, -9], [-12, 4], [-48, -3], [-1, -33], [4, -45]], [[7573, 6360], [0, -43], [-10, 9], [2, -47]], [[7565, 6279], [-8, 30], [-1, 31], [-6, 28], [-11, 34], [-26, 3], [3, -25], [-9, -32], [-12, 12], [-4, -11], [-8, 6], [-11, 5]], [[7472, 6360], [-4, 49], [-10, 45], [5, 35], [-17, 16], [6, 22], [18, 22], [-20, 31], [9, 40], [22, -26], [14, -3], [2, -41], [26, -8], [26, 1], [16, -10], [-13, -50], [-12, -3], [-9, -34], [16, -31], [4, 38], [8, 0], [14, -93]], [[5629, 7671], [8, -25], [11, 5], [21, -9], [41, -4], [13, 16], [33, 13], [20, -21], [17, -6]], [[5793, 7640], [-15, -25], [-10, -42], [9, -34]], [[5777, 7539], [-24, 8], [-28, -18]], [[5725, 7529], [0, -30], [-26, -5], [-19, 20], [-22, -16], [-21, 2]], [[5637, 7500], [-2, 39], [-14, 19]], [[5621, 7558], [5, 8], [-3, 7], [4, 19], [11, 18], [-14, 26], [-2, 21], [7, 14]], [[2846, 6461], [-7, -3], [-7, 34], [-10, 17], [6, 38], [8, -3], [10, -49], [0, -34]], [[2838, 6628], [-30, -10], [-2, 22], [13, 5], [18, -2], [1, -15]], [[2861, 6628], [-5, -42], [-5, 8], [0, 31], [-12, 23], [0, 7], [22, -27]], [[5527, 7708], [10, 0], [-7, -26], [14, -23], [-4, -28], [-7, -2]], [[5533, 7629], [-5, -6], [-9, -13], [-4, -33]], [[5515, 7577], [-25, 23], [-10, 24], [-11, 13], [-12, 22], [-6, 19], [-14, 27], [6, 25], [10, -14], [6, 12], [13, 2], [24, -10], [19, 1], [12, -13]], [[5652, 8242], [27, 0], [30, 22], [6, 34], [23, 19], [-3, 26]], [[5735, 8343], [17, 10], [30, 23]], [[5782, 8376], [29, -15], [4, -15], [15, 7], [27, -14], [3, -27], [-6, -16], [17, -39], [12, -11], [-2, -11], [19, -10], [8, -16], [-11, -13], [-23, 2], [-5, -5], [7, -20], [6, -37]], [[5882, 8136], [-23, -4], [-9, -13], [-2, -30], [-11, 6], [-25, -3], [-7, 14], [-11, -10], [-10, 8], [-22, 1], [-31, 15], [-28, 4], [-22, -1], [-15, -16], [-13, -2]], [[5653, 8105], [-1, 26], [-8, 27], [17, 12], [0, 24], [-8, 22], [-1, 26]], [[2524, 6110], [-1, 8], [4, 3], [5, -7], [10, 36], [5, 0]], [[2547, 6150], [0, -8], [5, -1], [0, -16], [-5, -25], [3, -9], [-3, -21], [2, -6], [-4, -30], [-5, -16], [-5, -1], [-6, -21]], [[2529, 5996], [-8, 0], [2, 67], [1, 47]], [[3136, 3714], [-20, -8], [-11, 82], [-15, 66], [9, 57], [-15, 25], [-4, 43], [-13, 40]], [[3067, 4019], [17, 64], [-12, 49], [7, 20], [-5, 22], [10, 30], [1, 50], [1, 41], [6, 20], [-24, 96]], [[3068, 4411], [21, -5], [14, 1], [6, 18], [25, 24], [14, 22], [37, 10], [-3, -44], [3, -23], [-2, -40], [30, -53], [31, -9], [11, -23], [19, -11], [11, -17], [18, 0], [16, -17], [1, -34], [6, -18], [0, -25], [-8, -1], [11, -69], [53, -2], [-4, -35], [3, -23], [15, -16], [6, -37], [-4, -47], [-8, -26], [3, -33], [-9, -12]], [[3384, 3866], [-1, 18], [-25, 30], [-26, 1], [-49, -17], [-13, -52], [-1, -32], [-11, -71]], [[3482, 3537], [6, 34], [3, 35], [1, 32], [-10, 11], [-11, -9], [-10, 2], [-4, 23], [-2, 54], [-5, 18], [-19, 16], [-11, -12], [-30, 11], [2, 81], [-8, 33]], [[3068, 4411], [-15, -11], [-13, 7], [2, 90], [-23, -35], [-24, 2], [-11, 31], [-18, 4], [5, 25], [-15, 36], [-11, 53], [7, 11], [0, 25], [17, 17], [-3, 32], [7, 20], [2, 28], [32, 40], [22, 11], [4, 9], [25, -2]], [[3058, 4804], [13, 162], [0, 25], [-4, 34], [-12, 22], [0, 42], [15, 10], [6, -6], [1, 23], [-16, 6], [-1, 37], [54, -2], [10, 21], [7, -19], [6, -35], [5, 8]], [[3142, 5132], [15, -32], [22, 4], [5, 18], [21, 14], [11, 10], [4, 25], [19, 17], [-1, 12], [-24, 5], [-3, 37], [1, 40], [-13, 15], [5, 6], [21, -8], [22, -15], [8, 14], [20, 9], [31, 23], [10, 22], [-3, 17]], [[3313, 5365], [14, 2], [7, -13], [-4, -26], [9, -9], [7, -28], [-8, -20], [-4, -51], [7, -30], [2, -27], [17, -28], [14, -3], [3, 12], [8, 3], [13, 10], [9, 16], [15, -5], [7, 2]], [[3429, 5170], [15, -5], [3, 12], [-5, 12], [3, 17], [11, -5], [13, 6], [16, -13]], [[3485, 5194], [12, -12], [9, 16], [6, -3], [4, -16], [13, 4], [11, 22], [8, 44], [17, 54]], [[3565, 5303], [9, 3], [7, -33], [16, -103], [14, -10], [1, -41], [-21, -48], [9, -18], [49, -9], [1, -60], [21, 39], [35, -21], [46, -36], [14, -35], [-5, -32], [33, 18], [54, -32], [41, 3], [41, -49], [36, -66], [21, -17], [24, -3], [10, -18], [9, -76], [5, -35], [-11, -98], [-14, -39], [-39, -82], [-18, -67], [-21, -51], [-7, -1], [-7, -43], [2, -111], [-8, -91], [-3, -39], [-9, -23], [-5, -79], [-28, -77], [-5, -61], [-22, -26], [-7, -35], [-30, 0], [-44, -23], [-19, -26], [-31, -18], [-33, -47], [-23, -58], [-5, -44], [5, -33], [-5, -60], [-6, -28], [-20, -33], [-31, -104], [-24, -47], [-19, -27], [-13, -57], [-18, -33]], [[3517, 3063], [-8, 33], [13, 28], [-16, 40], [-22, 33], [-29, 38], [-10, -2], [-28, 46], [-18, -7]], [[8172, 5325], [11, 22], [23, 32]], [[8206, 5379], [-1, -29], [-2, -37], [-13, 1], [-6, -20], [-12, 31]], [[7546, 6698], [12, -19], [-2, -36], [-23, -2], [-23, 4], [-18, -9], [-25, 22], [-1, 12]], [[7466, 6670], [19, 44], [15, 15], [20, -14], [14, -1], [12, -16]], [[5817, 3752], [-39, -43], [-25, -44], [-10, -40], [-8, -22], [-15, -4], [-5, -29], [-3, -18], [-17, -14], [-23, 3], [-13, 17], [-12, 7], [-14, -14], [-6, -28], [-14, -18], [-13, -26], [-20, -6], [-6, 20], [2, 36], [-16, 56], [-8, 9]], [[5552, 3594], [0, 173], [27, 2], [1, 210], [21, 2], [43, 21], [10, -24], [18, 23], [9, 0], [15, 13]], [[5696, 4014], [5, -4]], [[5701, 4010], [11, -48], [5, -10], [9, -34], [32, -65], [12, -7], [0, -20], [8, -38], [21, -9], [18, -27]], [[5424, 5496], [23, 4], [5, 16], [5, -2], [7, -13], [34, 23], [12, 23], [15, 20], [-3, 21], [8, 6], [27, -4], [26, 27], [20, 65], [14, 24], [18, 10]], [[5635, 5716], [3, -26], [16, -36], [0, -25], [-5, -24], [2, -18], [10, -18]], [[5661, 5569], [21, -25]], [[5682, 5544], [15, -24], [0, -19], [19, -31], [12, -26], [7, -35], [20, -24], [5, -18]], [[5760, 5367], [-9, -7], [-18, 2], [-21, 6], [-10, -5], [-5, -14], [-9, -2], [-10, 12], [-31, -29], [-13, 6], [-4, -5], [-8, -35], [-21, 11], [-20, 6], [-18, 22], [-23, 20], [-15, -19], [-10, -30], [-3, -41]], [[5512, 5265], [-18, 3], [-19, 10], [-16, -32], [-15, -55]], [[5444, 5191], [-3, 18], [-1, 27], [-13, 19], [-10, 30], [-2, 21], [-13, 31], [2, 18], [-3, 25], [2, 45], [7, 11], [14, 60]], [[3231, 7808], [20, -8], [26, 1], [-14, -24], [-10, -4], [-35, 25], [-7, 20], [10, 18], [10, -28]], [[3283, 7958], [-14, -1], [-36, 19], [-26, 28], [10, 5], [37, -15], [28, -25], [1, -11]], [[1569, 7923], [-14, -8], [-46, 27], [-8, 21], [-25, 21], [-5, 16], [-28, 11], [-11, 32], [2, 14], [30, -13], [17, -9], [26, -6], [9, -21], [14, -28], [28, -24], [11, -33]], [[3440, 8052], [-18, -52], [18, 20], [19, -12], [-10, -21], [25, -16], [12, 14], [28, -18], [-8, -43], [19, 10], [4, -32], [8, -36], [-11, -52], [-13, -2], [-18, 11], [6, 48], [-8, 8], [-32, -52], [-17, 2], [20, 28], [-27, 14], [-30, -3], [-54, 2], [-4, 17], [17, 21], [-12, 16], [24, 36], [28, 94], [18, 33], [24, 21], [13, -3], [-6, -16], [-15, -37]], [[1313, 8250], [27, 5], [-8, -67], [24, -48], [-11, 0], [-17, 27], [-10, 27], [-14, 19], [-5, 26], [1, 19], [13, -8]], [[2798, 8730], [-11, -31], [-12, 5], [-8, 17], [2, 4], [10, 18], [12, -1], [7, -12]], [[2725, 8762], [-33, -32], [-19, 1], [-6, 16], [20, 27], [38, 0], [0, -12]], [[2634, 8936], [5, -26], [15, 9], [16, -15], [30, -20], [32, -19], [2, -28], [21, 5], [20, -20], [-25, -18], [-43, 14], [-16, 26], [-27, -31], [-40, -31], [-9, 35], [-38, -6], [24, 30], [4, 46], [9, 54], [20, -5]], [[2892, 9024], [-31, -3], [-7, 29], [12, 34], [26, 8], [21, -17], [1, -25], [-4, -8], [-18, -18]], [[2343, 9140], [-17, -21], [-38, 18], [-22, -6], [-38, 26], [24, 19], [19, 25], [30, -16], [17, -11], [8, -11], [17, -23]], [[3135, 7724], [-18, 33], [0, 81], [-13, 17], [-18, -10], [-10, 16], [-21, -45], [-8, -46], [-10, -27], [-12, -9], [-9, -3], [-3, -15], [-51, 0], [-42, 0], [-12, -11], [-30, -42], [-3, -5], [-9, -23], [-26, 0], [-27, 0], [-12, -10], [4, -11], [2, -18], [0, -6], [-36, -30], [-29, -9], [-32, -31], [-7, 0], [-10, 9], [-3, 8], [1, 6], [6, 21], [13, 33], [8, 35], [-5, 51], [-6, 53], [-29, 28], [3, 11], [-4, 7], [-8, 0], [-5, 9], [-2, 14], [-5, -6], [-7, 2], [1, 6], [-6, 6], [-3, 15], [-21, 19], [-23, 20], [-27, 23], [-26, 21], [-25, -17], [-9, 0], [-34, 15], [-23, -8], [-27, 19], [-28, 9], [-19, 4], [-9, 10], [-5, 32], [-9, 0], [-1, -23], [-57, 0], [-95, 0], [-94, 0], [-84, 0], [-83, 0], [-82, 0], [-85, 0], [-27, 0], [-82, 0], [-79, 0]], [[1588, 7952], [-4, 0], [-54, 58], [-20, 26], [-50, 24], [-15, 53], [3, 36], [-35, 25], [-5, 48], [-34, 43], [0, 30]], [[1374, 8295], [15, 29], [0, 37], [-48, 37], [-28, 68], [-17, 42], [-26, 27], [-19, 24], [-14, 31], [-28, -20], [-27, -33], [-25, 39], [-19, 26], [-27, 16], [-28, 2], [0, 337], [1, 219]], [[1084, 9176], [51, -14], [44, -29], [29, -5], [24, 24], [34, 19], [41, -7], [42, 26], [45, 14], [20, -24], [20, 14], [6, 27], [20, -6], [47, -53], [37, 40], [3, -45], [34, 10], [11, 17], [34, -3], [42, -25], [65, -22], [38, -10], [28, 4], [37, -30], [-39, -29], [50, -13], [75, 7], [24, 11], [29, -36], [31, 30], [-29, 25], [18, 20], [34, 3], [22, 6], [23, -14], [28, -32], [31, 5], [49, -27], [43, 9], [40, -1], [-3, 37], [25, 10], [43, -20], [0, -56], [17, 47], [23, -1], [12, 59], [-30, 36], [-32, 24], [2, 65], [33, 43], [37, -9], [28, -26], [38, -67], [-25, -29], [52, -12], [-1, -60], [38, 46], [33, -38], [-9, -44], [27, -40], [29, 43], [21, 51], [1, 65], [40, -5], [41, -8], [37, -30], [2, -29], [-21, -31], [20, -32], [-4, -29], [-54, -41], [-39, -9], [-29, 18], [-8, -30], [-27, -50], [-8, -26], [-32, -40], [-40, -4], [-22, -25], [-2, -38], [-32, -7], [-34, -48], [-30, -67], [-11, -46], [-1, -69], [40, -10], [13, -55], [13, -45], [39, 12], [51, -26], [28, -22], [20, -28], [35, -17], [29, -24], [46, -4], [30, -6], [-4, -51], [8, -59], [21, -66], [41, -56], [21, 19], [15, 61], [-14, 93], [-20, 31], [45, 28], [31, 41], [16, 41], [-3, 40], [-19, 50], [-33, 44], [32, 62], [-12, 54], [-9, 92], [19, 14], [48, -16], [29, -6], [23, 15], [25, -20], [35, -34], [8, -23], [50, -4], [-1, -50], [9, -74], [25, -10], [21, -35], [40, 33], [26, 65], [19, 28], [21, -53], [36, -75], [31, -71], [-11, -37], [37, -33], [25, -34], [44, -15], [18, -19], [11, -50], [22, -8], [11, -22], [2, -67], [-20, -22], [-20, -21], [-46, -21], [-35, -48], [-47, -10], [-59, 13], [-42, 0], [-29, -4], [-23, -43], [-35, -26], [-40, -78], [-32, -54], [23, 9], [45, 78], [58, 49], [42, 6], [24, -29], [-26, -40], [9, -63], [9, -45], [36, -29], [46, 8], [28, 67], [2, -43], [17, -22], [-34, -38], [-61, -36], [-28, -23], [-31, -43], [-21, 4], [-1, 50], [48, 49], [-44, -2], [-31, -7]], [[1829, 9377], [-14, -27], [61, 17], [39, -29], [31, 30], [26, -20], [23, -58], [14, 25], [-20, 60], [24, 9], [28, -9], [31, -24], [17, -58], [9, -41], [47, -30], [50, -28], [-3, -26], [-46, -4], [18, -23], [-9, -22], [-51, 9], [-48, 16], [-32, -3], [-52, -20], [-70, -9], [-50, -6], [-15, 28], [-38, 16], [-24, -6], [-35, 47], [19, 6], [43, 10], [39, -3], [36, 11], [-54, 13], [-59, -4], [-39, 1], [-15, 22], [64, 23], [-42, -1], [-49, 16], [23, 44], [20, 24], [74, 36], [29, -12]], [[2097, 9395], [-24, -39], [-44, 41], [10, 9], [37, 2], [21, -13]], [[2879, 9376], [3, -16], [-30, 2], [-30, 1], [-30, -8], [-8, 3], [-31, 32], [1, 21], [14, 4], [63, -6], [48, -33]], [[2595, 9379], [22, -36], [26, 47], [70, 24], [48, -61], [-4, -38], [55, 17], [26, 23], [62, -30], [38, -28], [3, -25], [52, 13], [29, -38], [67, -23], [24, -24], [26, -55], [-51, -28], [66, -38], [44, -13], [40, -55], [44, -3], [-9, -42], [-49, -69], [-34, 26], [-44, 57], [-36, -8], [-3, -34], [29, -34], [38, -27], [11, -16], [18, -58], [-9, -43], [-35, 16], [-70, 47], [39, -51], [29, -35], [5, -21], [-76, 24], [-59, 34], [-34, 29], [10, 17], [-42, 30], [-40, 29], [0, -18], [-80, -9], [-23, 20], [18, 44], [52, 1], [57, 7], [-9, 21], [10, 30], [36, 57], [-8, 27], [-11, 20], [-42, 29], [-57, 20], [18, 15], [-29, 36], [-25, 4], [-22, 20], [-14, -18], [-51, -7], [-101, 13], [-59, 17], [-45, 9], [-23, 21], [29, 27], [-39, 0], [-9, 60], [21, 53], [29, 24], [72, 16], [-21, -39]], [[2212, 9420], [33, -12], [50, 7], [7, -17], [-26, -28], [42, -26], [-5, -53], [-45, -23], [-27, 5], [-19, 23], [-69, 45], [0, 19], [57, -7], [-31, 38], [33, 29]], [[2411, 9357], [-30, -45], [-32, 3], [-17, 52], [1, 29], [14, 25], [28, 16], [58, -2], [53, -14], [-42, -53], [-33, -11]], [[1654, 9275], [-73, -29], [-15, 26], [-64, 31], [12, 25], [19, 43], [24, 39], [-27, 36], [94, 10], [39, -13], [71, -3], [27, -17], [30, -25], [-35, -15], [-68, -41], [-34, -42], [0, -25]], [[2399, 9487], [-15, -23], [-40, 5], [-34, 15], [15, 27], [40, 16], [24, -21], [10, -19]], [[2264, 9590], [21, -27], [1, -31], [-13, -44], [-46, -6], [-30, 10], [1, 34], [-45, -4], [-2, 45], [30, -2], [41, 21], [40, -4], [2, 8]], [[1994, 9559], [11, -21], [25, 10], [29, -2], [5, -29], [-17, -28], [-94, -10], [-70, -25], [-43, -2], [-3, 20], [57, 26], [-125, -7], [-39, 10], [38, 58], [26, 17], [78, -20], [50, -35], [48, -5], [-40, 57], [26, 21], [29, -7], [9, -28]], [[2370, 9612], [30, -19], [55, 0], [24, -19], [-6, -22], [32, -14], [17, -14], [38, -2], [40, -5], [44, 13], [57, 5], [45, -5], [30, -22], [6, -24], [-17, -16], [-42, -13], [-35, 8], [-80, -10], [-57, -1], [-45, 8], [-74, 19], [-9, 32], [-4, 29], [-27, 26], [-58, 7], [-32, 19], [10, 24], [58, -4]], [[1772, 9645], [-4, -46], [-21, -20], [-26, -3], [-52, -26], [-44, -9], [-38, 13], [47, 44], [57, 39], [43, -1], [38, 9]], [[2393, 9637], [-13, -2], [-52, 4], [-7, 17], [56, -1], [19, -11], [-3, -7]], [[1939, 9648], [-52, -17], [-41, 19], [23, 19], [40, 6], [39, -10], [-9, -17]], [[1954, 9701], [-34, -11], [-46, 0], [0, 8], [29, 18], [14, -3], [37, -12]], [[2338, 9669], [-41, -12], [-23, 13], [-12, 23], [-2, 24], [36, -2], [16, -4], [33, -21], [-7, -21]], [[2220, 9685], [11, -25], [-45, 7], [-46, 19], [-62, 2], [27, 18], [-34, 14], [-2, 22], [55, -8], [75, -21], [21, -28]], [[2583, 9764], [33, -20], [-38, -17], [-51, -45], [-50, -4], [-57, 8], [-30, 24], [0, 21], [22, 16], [-50, 0], [-31, 19], [-18, 27], [20, 26], [19, 18], [28, 4], [-12, 14], [65, 3], [35, -32], [47, -12], [46, -11], [22, -39]], [[3097, 9967], [74, -4], [60, -8], [51, -16], [-2, -16], [-67, -25], [-68, -12], [-25, -14], [61, 1], [-66, -36], [-45, -17], [-48, -48], [-57, -10], [-18, -12], [-84, -6], [39, -8], [-20, -10], [23, -29], [-26, -21], [-43, -16], [-13, -24], [-39, -17], [4, -14], [48, 3], [0, -15], [-74, -35], [-73, 16], [-81, -9], [-42, 7], [-52, 3], [-4, 29], [52, 13], [-14, 43], [17, 4], [74, -26], [-38, 38], [-45, 11], [23, 23], [49, 14], [8, 21], [-39, 23], [-12, 31], [76, -3], [22, -6], [43, 21], [-62, 7], [-98, -4], [-49, 20], [-23, 24], [-32, 17], [-6, 21], [41, 11], [32, 2], [55, 9], [41, 22], [34, -3], [30, -16], [21, 32], [37, 9], [50, 7], [85, 2], [14, -6], [81, 10], [60, -4], [60, -4]], [[5290, 7828], [-3, -24], [-12, -10], [-20, 7], [-6, -24], [-14, -2], [-5, 10], [-15, -20], [-13, -3], [-12, 13]], [[5190, 7775], [-10, 25], [-13, -9], [0, 27], [21, 33], [-1, 15], [12, -5], [8, 10]], [[5207, 7871], [24, -1], [5, 13], [30, -18]], [[3140, 1814], [-10, -24], [-23, -18], [-14, 2], [-16, 5], [-21, 18], [-29, 8], [-35, 33], [-28, 32], [-38, 66], [23, -12], [39, -40], [36, -21], [15, 27], [9, 41], [25, 24], [20, -7]], [[3095, 1968], [-25, 0], [-13, -14], [-25, -22], [-5, -55], [-11, -1], [-32, 19], [-32, 41], [-34, 34], [-9, 37], [8, 35], [-14, 39], [-4, 101], [12, 57], [30, 45], [-43, 18], [27, 52], [9, 98], [31, -21], [15, 123], [-19, 15], [-9, -73], [-17, 8], [9, 84], [9, 110], [13, 40], [-8, 58], [-2, 66], [11, 2], [17, 96], [20, 94], [11, 88], [-6, 89], [8, 49], [-3, 72], [16, 73], [5, 114], [9, 123], [9, 132], [-2, 96], [-6, 84]], [[3045, 3974], [14, 15], [8, 30]], [[8064, 6161], [-24, -28], [-23, 18], [0, 51], [13, 26], [31, 17], [16, -1], [6, -23], [-12, -26], [-7, -34]], [[8628, 7562], [-18, 35], [-11, -33], [-43, -26], [4, -31], [-24, 2], [-13, 19], [-19, -42], [-30, -32], [-23, -38]], [[8451, 7416], [-39, -17], [-20, -27], [-30, -17], [15, 28], [-6, 23], [22, 40], [-15, 30], [-24, -20], [-32, -41], [-17, -39], [-27, -2], [-14, -28], [15, -40], [22, -10], [1, -26], [22, -17], [31, 42], [25, -23], [18, -2], [4, -31], [-39, -16], [-13, -32], [-27, -30], [-14, -41], [30, -33], [11, -58], [17, -54], [18, -45], [0, -44], [-17, -16], [6, -32], [17, -18], [-5, -48], [-7, -47], [-15, -5], [-21, -64], [-22, -78], [-26, -70], [-38, -55], [-39, -50], [-31, -6], [-17, -27], [-10, 20], [-15, -30], [-39, -29], [-29, -9], [-10, -63], [-15, -3], [-8, 43], [7, 22], [-37, 19], [-13, -9]], [[8001, 6331], [-28, 15], [-14, 24], [5, 34], [-26, 11], [-13, 22], [-24, -31], [-27, -7], [-22, 0], [-15, -14]], [[7837, 6385], [-14, -9], [4, -68], [-15, 2], [-2, 14]], [[7810, 6324], [-1, 24], [-20, -17], [-12, 11], [-21, 22], [8, 49], [-18, 12], [-6, 54], [-30, -10], [4, 70], [26, 50], [1, 48], [-1, 46], [-12, 14], [-9, 35], [-16, -5]], [[7703, 6727], [-30, 9], [9, 25], [-13, 36], [-20, -24], [-23, 14], [-32, -37], [-25, -44], [-23, -8]], [[7466, 6670], [-2, 47], [-17, -13]], [[7447, 6704], [-32, 6], [-32, 14], [-22, 26], [-22, 11], [-9, 29], [-16, 8], [-28, 39], [-22, 18], [-12, -14]], [[7252, 6841], [-38, 41], [-28, 37], [-7, 65], [20, -7], [1, 30], [-12, 30], [3, 48], [-30, 69]], [[7161, 7154], [-45, 24], [-8, 46], [-21, 27]], [[7082, 7268], [-4, 34], [1, 23], [-17, 13], [-9, -6], [-7, 55]], [[7046, 7387], [8, 13], [-4, 14], [26, 28], [20, 12], [29, -8], [11, 38], [35, 7], [10, 23], [44, 32], [4, 13]], [[7229, 7559], [-2, 34], [19, 15], [-25, 103], [55, 24], [14, 13], [20, 106], [55, -20], [15, 27], [2, 59], [23, 6], [21, 39]], [[7426, 7965], [11, 5]], [[7437, 7970], [7, -41], [23, -32], [40, -22], [19, -47], [-10, -70], [10, -25], [33, -10], [37, -8], [33, -37], [18, -7], [12, -54], [17, -35], [30, 1], [58, -13], [36, 8], [28, -9], [41, -36], [34, 0], [12, -18], [32, 32], [45, 20], [42, 2], [32, 21], [20, 32], [20, 20], [-5, 19], [-9, 23], [15, 38], [15, -5], [29, -12], [28, 31], [42, 23], [20, 39], [20, 17], [40, 8], [22, -7], [3, 21], [-25, 41], [-22, 19], [-22, -22], [-27, 10], [-16, -8], [-7, 24], [20, 59], [13, 45]], [[8240, 8005], [34, -23], [39, 38], [-1, 26], [26, 62], [15, 19], [0, 33], [-16, 14], [23, 29], [35, 11], [37, 2], [41, -18], [25, -22], [17, -59], [10, -26], [10, -36], [10, -58], [49, -19], [32, -42], [12, -55], [42, 0], [24, 23], [46, 17], [-15, -53], [-11, -21], [-9, -65], [-19, -58], [-33, 11], [-24, -21], [7, -51], [-4, -69], [-14, -2], [0, -30]], [[4920, 5353], [-12, -1], [-20, 12], [-18, -1], [-33, -10], [-19, -18], [-27, -21], [-6, 1]], [[4785, 5315], [2, 49], [3, 7], [-1, 24], [-12, 24], [-8, 4], [-8, 17], [6, 26], [-3, 28], [1, 18]], [[4765, 5512], [5, 0], [1, 25], [-2, 12], [3, 8], [10, 7], [-7, 47], [-6, 25], [2, 20], [5, 4]], [[4776, 5660], [4, 6], [8, -9], [21, -1], [5, 18], [5, -1], [8, 6], [4, -25], [7, 7], [11, 9]], [[4921, 5627], [7, -84], [-11, -50], [-8, -66], [12, -51], [-1, -23]], [[5363, 5191], [-4, 4], [-16, -8], [-17, 8], [-13, -4]], [[5313, 5191], [-45, 1]], [[5268, 5192], [4, 47], [-11, 39], [-13, 10], [-6, 27], [-7, 8], [1, 16]], [[5236, 5339], [7, 42], [13, 57], [8, 1], [17, 34], [10, 1], [16, -24], [19, 20], [2, 25], [7, 23], [4, 30], [15, 25], [5, 41], [6, 13], [4, 31], [7, 37], [24, 46], [1, 20], [3, 10], [-11, 24]], [[5393, 5795], [1, 19], [8, 3]], [[5402, 5817], [11, -38], [2, -39], [-1, -39], [15, -54], [-15, 1], [-8, -4], [-13, 6], [-6, -28], [16, -35], [13, -10], [3, -24], [9, -41], [-4, -16]], [[5444, 5191], [-2, -31], [-22, 14], [-22, 15], [-35, 2]], [[5856, 5265], [-2, -69], [11, -8], [-9, -21], [-10, -16], [-11, -31], [-6, -27], [-1, -48], [-7, -22], [0, -45]], [[5821, 4978], [-8, -16], [-1, -35], [-4, -5], [-2, -32]], [[5814, 4792], [5, -55], [-2, -30], [5, -35], [16, -33], [15, -74]], [[5853, 4565], [-11, 6], [-37, -10], [-7, -7], [-8, -38], [6, -26], [-5, -70], [-3, -59], [7, -11], [19, -23], [8, 11], [2, -64], [-21, 1], [-11, 32], [-10, 25], [-22, 9], [-6, 31], [-17, -19], [-22, 8], [-10, 27], [-17, 6], [-13, -2], [-2, 19], [-9, 1]], [[5342, 4697], [-4, 18]], [[5360, 4775], [8, -6], [9, 23], [15, -1], [2, -17], [11, -10], [16, 37], [16, 29], [7, 19], [-1, 48], [12, 58], [13, 30], [18, 29], [3, 18], [1, 22], [5, 21], [-2, 33], [4, 52], [5, 37], [8, 32], [2, 36]], [[5760, 5367], [17, -49], [12, -7], [8, 10], [12, -4], [16, 12], [6, -25], [25, -39]], [[5330, 4760], [-22, 62]], [[5308, 4822], [21, 33], [-11, 39], [10, 15], [19, 7], [2, 26], [15, -28], [24, -2], [9, 27], [3, 40], [-3, 46], [-13, 35], [12, 68], [-7, 12], [-21, -5], [-7, 31], [2, 25]], [[2906, 5049], [-12, 14], [-14, 19], [-7, -9], [-24, 8], [-7, 25], [-5, -1], [-28, 34]], [[2809, 5139], [-3, 18], [10, 5], [-1, 29], [6, 22], [14, 4], [12, 37], [10, 31], [-10, 14], [5, 34], [-6, 54], [6, 16], [-4, 50], [-12, 31]], [[2836, 5484], [4, 29], [9, -4], [5, 17], [-6, 35], [3, 9]], [[2851, 5570], [14, -2], [21, 41], [12, 6], [0, 20], [5, 50], [16, 27], [17, 1], [3, 13], [21, -5], [22, 30], [11, 13], [14, 28], [9, -3], [8, -16], [-6, -20]], [[3018, 5753], [-18, -10], [-7, -29], [-10, -17], [-8, -22], [-4, -42], [-8, -35], [15, -4], [3, -27], [6, -13], [3, -24], [-4, -22], [1, -12], [7, -5], [7, -20], [36, 5], [16, -7], [19, -51], [11, 6], [20, -3], [16, 7], [10, -10], [-5, -32], [-6, -20], [-2, -42], [5, -40], [8, -17], [1, -13], [-14, -30], [10, -13], [8, -21], [8, -58]], [[3058, 4804], [-14, 31], [-8, 1], [18, 61], [-21, 27], [-17, -5], [-10, 10], [-15, -15], [-21, 7], [-16, 62], [-13, 15], [-9, 28], [-19, 28], [-7, -5]], [[2695, 5543], [-15, 14], [-6, 12], [4, 10], [-1, 13], [-8, 14], [-11, 12], [-10, 8], [-1, 17], [-8, 10], [2, -17], [-5, -14], [-7, 17], [-9, 5], [-4, 12], [1, 18], [3, 19], [-8, 8], [7, 12]], [[2619, 5713], [4, 7], [18, -15], [7, 7], [9, -5], [4, -12], [8, -4], [7, 13]], [[2676, 5704], [7, -32], [11, -24], [13, -25]], [[2707, 5623], [-11, -6], [0, -23], [6, -9], [-4, -7], [1, -11], [-2, -12], [-2, -12]], [[2715, 6427], [23, -4], [22, 0], [26, -21], [11, -21], [26, 6], [10, -13], [24, -37], [17, -27], [9, 1], [17, -12], [-2, -17], [20, -2], [21, -24], [-3, -14], [-19, -7], [-18, -3], [-19, 4], [-40, -5], [18, 32], [-11, 16], [-18, 4], [-9, 17], [-7, 33], [-16, -2], [-26, 16], [-8, 12], [-36, 10], [-10, 11], [11, 15], [-28, 3], [-20, -31], [-11, -1], [-4, -14], [-14, -7], [-12, 6], [15, 18], [6, 22], [13, 13], [14, 11], [21, 6], [7, 6]], [[5909, 7133], [2, 1], [4, 14], [20, -1], [25, 18], [-19, -25], [2, -11]], [[5943, 7129], [-3, 2], [-5, -5], [-4, 1], [-2, -2], [0, 6], [-2, 4], [-6, 0], [-7, -5], [-5, 3]], [[5943, 7129], [1, -5], [-28, -24], [-14, 8], [-7, 23], [14, 2]], [[5377, 7945], [-16, 25], [-14, 15], [-3, 25], [-5, 17], [21, 13], [10, 15], [20, 11], [7, 11], [7, -6], [13, 6]], [[5417, 8077], [13, -19], [21, -5], [-2, -17], [15, -12], [4, 15], [19, -6], [3, -19], [20, -3], [13, -29]], [[5523, 7982], [-8, 0], [-4, -11], [-7, -3], [-2, -13], [-5, -3], [-1, -5], [-9, -7], [-12, 1], [-4, -13]], [[5275, 8306], [1, -23], [28, -14], [-1, -21], [29, 11], [15, 16], [32, -23], [13, -19]], [[5392, 8233], [6, -30], [-8, -16], [11, -21], [6, -31], [-2, -21], [12, -37]], [[5207, 7871], [3, 42], [14, 40], [-40, 11], [-13, 16]], [[5171, 7980], [2, 26], [-6, 13]], [[5171, 8059], [-5, 62], [17, 0], [7, 22], [6, 54], [-5, 20]], [[5191, 8217], [6, 13], [23, 3], [5, -13], [19, 29], [-6, 22], [-2, 34]], [[5236, 8305], [21, -8], [18, 9]], [[6196, 5808], [7, -19], [-1, -24], [-16, -14], [12, -16]], [[6198, 5735], [-10, -32]], [[6188, 5703], [-7, 11], [-6, -5], [-16, 1], [0, 18], [-2, 17], [9, 27], [10, 26]], [[6176, 5798], [12, -5], [8, 15]], [[5352, 8343], [-17, -48], [-29, 33], [-4, 25], [41, 19], [9, -29]], [[5236, 8305], [-11, 32], [-1, 61], [5, 16], [8, 17], [24, 4], [10, 16], [22, 17], [-1, -30], [-8, -20], [4, -16], [15, -9], [-7, -22], [-8, 6], [-20, -42], [7, -29]], [[3008, 6222], [3, 10], [22, 0], [16, -15], [8, 1], [5, -21], [15, 1], [-1, -17], [12, -2], [14, -22], [-10, -24], [-14, 13], [-12, -3], [-9, 3], [-5, -11], [-11, -3], [-4, 14], [-10, -8], [-11, -41], [-7, 10], [-1, 17]], [[3008, 6124], [0, 16], [-7, 17], [7, 10], [2, 23], [-2, 32]], [[5333, 6444], [-95, -112], [-81, -117], [-39, -26]], [[5118, 6189], [-31, -6], [0, 38], [-13, 10], [-17, 16], [-7, 28], [-94, 129], [-93, 129]], [[4863, 6533], [-105, 143]], [[4758, 6676], [1, 11], [0, 4]], [[4759, 6691], [0, 70], [44, 44], [28, 9], [23, 16], [11, 29], [32, 24], [1, 44], [16, 5], [13, 22], [36, 9], [5, 23], [-7, 13], [-10, 62], [-1, 36], [-11, 38]], [[4939, 7135], [27, 32], [30, 11], [17, 24], [27, 18], [47, 11], [46, 4], [14, -8], [26, 23], [30, 0], [11, -13], [19, 3]], [[5233, 7240], [-5, -30], [4, -56], [-6, -49], [-18, -33], [3, -45], [23, -35], [0, -14], [17, -24], [12, -106]], [[5263, 6848], [9, -52], [1, -28], [-5, -48], [2, -27], [-3, -32], [2, -37], [-11, -25], [17, -43], [1, -25], [10, -33], [13, 11], [22, -28], [12, -37]], [[2769, 4856], [15, 45], [-6, 25], [-11, -27], [-16, 26], [5, 16], [-4, 54], [9, 9], [5, 37], [11, 38], [-2, 24], [15, 13], [19, 23]], [[2906, 5049], [4, -45], [-9, -39], [-30, -62], [-33, -23], [-17, -51], [-6, -40], [-15, -24], [-12, 29], [-11, 7], [-12, -5], [-1, 22], [8, 14], [-3, 24]], [[5969, 6800], [-7, -23], [-6, -45], [-8, -31], [-6, -10], [-10, 19], [-12, 26], [-20, 85], [-3, -5], [12, -63], [17, -59], [21, -92], [10, -32], [9, -34], [25, -65], [-6, -10], [1, -39], [33, -53], [4, -12]], [[6023, 6357], [-110, 0], [-107, 0], [-112, 0]], [[5694, 6357], [0, 218], [0, 210], [-8, 47], [7, 37], [-5, 25], [10, 29]], [[5698, 6923], [37, 0], [27, -15], [28, -18], [13, -9], [21, 19], [11, 17], [25, 5], [20, -8], [7, -29], [7, 19], [22, -14], [22, -3], [13, 15]], [[5951, 6902], [18, -102]], [[6176, 5798], [-10, 20], [-11, 34], [-12, 19], [-8, 21], [-24, 23], [-19, 1], [-7, 12], [-16, -14], [-17, 27], [-8, -44], [-33, 13]], [[6011, 5910], [-3, 23], [12, 87], [3, 39], [9, 18], [20, 10], [14, 34]], [[6066, 6121], [16, -69], [8, -54], [15, -29], [38, -55], [16, -34], [15, -34], [8, -20], [14, -18]], [[4749, 7532], [1, 42], [-11, 25], [39, 43], [34, -11], [37, 1], [30, -10], [23, 3], [45, -2]], [[4947, 7623], [11, -23], [51, -27], [10, 13], [31, -27], [32, 8]], [[5082, 7567], [2, -35], [-26, -39], [-36, -12], [-2, -20], [-18, -33], [-10, -48], [11, -34], [-16, -26], [-6, -39], [-21, -11], [-20, -46], [-35, -1], [-27, 1], [-17, -21], [-11, -22], [-13, 5], [-11, 20], [-8, 34], [-26, 9]], [[4792, 7249], [-2, 20], [10, 22], [4, 16], [-9, 17], [7, 39], [-11, 36], [12, 5], [1, 27], [5, 9], [0, 46], [13, 16], [-8, 30], [-16, 2], [-5, -8], [-16, 0], [-7, 29], [-11, -8], [-10, -15]], [[5675, 8472], [3, 35], [-10, -8], [-18, 21], [-2, 34], [35, 17], [35, 8], [30, -10], [29, 2]], [[5777, 8571], [4, -10], [-20, -34], [8, -55], [-12, -19]], [[5757, 8453], [-22, 0], [-24, 22], [-13, 7], [-23, -10]], [[6188, 5703], [-6, -21], [10, -32], [10, -29], [11, -21], [90, -70], [24, 0]], [[6327, 5530], [-79, -177], [-36, -3], [-25, -41], [-17, -1], [-8, -19]], [[6162, 5289], [-19, 0], [-11, 20], [-26, -25], [-8, -24], [-18, 4], [-6, 7], [-7, -1], [-9, 0], [-35, 50], [-19, 0], [-10, 20], [0, 33], [-14, 10]], [[5980, 5383], [-17, 64], [-12, 14], [-5, 23], [-14, 29], [-17, 4], [9, 34], [15, 2], [4, 18]], [[5943, 5571], [0, 53]], [[5943, 5624], [8, 62], [13, 16], [3, 24], [12, 45], [17, 30], [11, 58], [4, 51]], [[5794, 9138], [-4, -42], [42, -39], [-26, -45], [33, -67], [-19, -51], [25, -43], [-11, -39], [41, -40], [-11, -31], [-25, -34], [-60, -75]], [[5779, 8632], [-50, -5], [-49, -21], [-45, -13], [-16, 32], [-27, 20], [6, 58], [-14, 53], [14, 35], [25, 37], [63, 64], [19, 12], [-3, 25], [-39, 28]], [[5663, 8957], [-9, 23], [-1, 91], [-43, 40], [-37, 29]], [[5573, 9140], [17, 16], [30, -32], [37, 3], [30, -14], [26, 26], [14, 44], [43, 20], [35, -24], [-11, -41]], [[9954, 4033], [9, -17], [-4, -31], [-17, -8], [-16, 7], [-2, 26], [10, 21], [13, -8], [7, 10]], [[0, 4079], [9981, -14], [-17, -13], [-4, 23], [14, 12], [9, 3], [-9983, 18]], [[0, 4108], [0, -29]], [[0, 4108], [6, 3], [-4, -28], [-2, -4]], [[3300, 1994], [33, 36], [24, -15], [16, 24], [22, -27], [-8, -21], [-37, -17], [-13, 20], [-23, -26], [-14, 26]], [[5265, 7548], [-9, -46], [-13, 12], [-6, 40], [5, 22], [18, 22], [5, -50]], [[5157, 7984], [6, -6], [8, 2]], [[5190, 7775], [-2, -17], [9, -22], [-10, -18], [7, -46], [15, -8], [-3, -25]], [[5206, 7639], [-25, -34], [-55, 16], [-40, -19], [-4, -35]], [[4947, 7623], [14, 35], [5, 118], [-28, 62], [-21, 30], [-42, 23], [-3, 43], [36, 12], [47, -15], [-9, 67], [26, -25], [65, 46], [8, 48], [24, 12]], [[3485, 5194], [7, 25], [3, 27]], [[3495, 5246], [4, 26], [-10, 34]], [[3489, 5306], [-3, 41], [15, 51]], [[3501, 5398], [9, -7], [21, -14], [29, -50], [5, -24]], [[5308, 4822], [-29, 60], [-18, 49], [-17, 61], [1, 19], [6, 19], [7, 43], [5, 44]], [[5263, 5117], [10, 4], [40, -1], [0, 71]], [[4827, 8240], [-21, 12], [-17, -1], [6, 32], [-6, 32]], [[4789, 8315], [23, 2], [30, -37], [-15, -40]], [[4916, 8521], [-30, -63], [29, 8], [30, -1], [-7, -48], [-25, -53], [29, -4], [2, -6], [25, -69], [19, -10], [17, -67], [8, -24], [33, -11], [-3, -38], [-14, -17], [11, -30], [-25, -31], [-37, 0], [-48, -16], [-13, 12], [-18, -28], [-26, 7], [-19, -23], [-15, 12], [41, 62], [25, 13], [-1, 0], [-43, 9], [-8, 24], [29, 18], [-15, 32], [5, 39], [42, -6], [4, 35], [-19, 36], [0, 1], [-34, 10], [-7, 16], [10, 27], [-9, 16], [-15, -28], [-1, 57], [-14, 30], [10, 61], [21, 48], [23, -4], [33, 4]], [[6154, 7511], [4, 26], [-7, 40], [-16, 22], [-16, 6], [-10, 19]], [[6109, 7624], [4, 6], [23, -10], [41, -9], [38, -28], [5, -11], [17, 9], [25, -13], [9, -24], [17, -13]], [[6210, 7485], [-27, 29], [-29, -3]], [[5029, 5408], [-44, -35], [-15, -20], [-25, -17], [-25, 17]], [[5000, 5708], [-2, -18], [12, -30], [0, -43], [2, -47], [7, -21], [-6, -54], [2, -29], [8, -37], [6, -21]], [[4765, 5512], [-8, 1], [-5, -24], [-8, 1], [-6, 12], [2, 24], [-11, 36], [-8, -7], [-6, -1]], [[4715, 5554], [-7, -3], [0, 21], [-4, 16], [0, 17], [-6, 25], [-7, 21], [-23, 0], [-6, -11], [-8, -1], [-4, -13], [-4, -17], [-14, -26]], [[4632, 5583], [-13, 35], [-10, 24], [-8, 7], [-6, 12], [-4, 26], [-4, 13], [-8, 10]], [[4579, 5710], [13, 29], [8, -2], [7, 10], [6, 0], [5, 8], [-3, 20], [3, 6], [1, 20]], [[4619, 5801], [13, -1], [20, -14], [6, 1], [3, 7], [15, -5], [4, 4]], [[4680, 5793], [1, -22], [5, 0], [7, 8], [5, -2], [7, -15], [12, -5], [8, 13], [9, 8], [6, 8], [6, -1], [6, -13], [3, -17], [12, -24], [-6, -16], [-1, -19], [6, 6], [3, -7], [-1, -17], [8, -18]], [[4532, 5834], [3, 27]], [[4535, 5861], [31, 1], [6, 14], [9, 1], [11, -14], [8, -1], [9, 10], [6, -17], [-12, -13], [-12, 1], [-12, 13], [-10, -14], [-5, -1], [-7, -8], [-25, 1]], [[4579, 5710], [-15, 24], [-11, 4], [-7, 17], [1, 9], [-9, 13], [-2, 12]], [[4536, 5789], [15, 10], [9, -2], [8, 7], [51, -3]], [[5263, 5117], [-5, 9], [10, 66]], [[5658, 7167], [15, -20], [22, 3], [20, -4], [0, -10], [15, 7], [-4, -18], [-40, -5], [1, 10], [-34, 12], [5, 25]], [[5723, 7469], [-17, 2], [-14, 6], [-34, -16], [19, -33], [-14, -10], [-15, 0], [-15, 31], [-5, -13], [6, -36], [14, -27], [-10, -13], [15, -27], [14, -18], [0, -33], [-25, 16], [8, -30], [-18, -7], [11, -52], [-19, -1], [-23, 26], [-10, 47], [-5, 40], [-11, 27], [-14, 34], [-2, 16]], [[5583, 7470], [18, 6], [11, 13], [15, -2], [5, 11], [5, 2]], [[5725, 7529], [13, -16], [-8, -37], [-7, -7]], [[3701, 9939], [93, 35], [97, -2], [36, 21], [98, 6], [222, -7], [174, -47], [-52, -23], [-106, -3], [-150, -5], [14, -11], [99, 7], [83, -21], [54, 18], [23, -21], [-30, -34], [71, 22], [135, 23], [83, -12], [15, -25], [-113, -42], [-16, -14], [-88, -10], [64, -3], [-32, -43], [-23, -38], [1, -66], [33, -38], [-43, -3], [-46, -19], [52, -31], [6, -50], [-30, -6], [36, -50], [-61, -5], [32, -24], [-9, -20], [-39, -10], [-39, 0], [35, -40], [0, -26], [-55, 24], [-14, -15], [37, -15], [37, -36], [10, -48], [-49, -11], [-22, 22], [-34, 34], [10, -40], [-33, -31], [73, -2], [39, -3], [-75, -52], [-75, -46], [-81, -21], [-31, 0], [-29, -23], [-38, -62], [-60, -42], [-19, -2], [-37, -15], [-40, -13], [-24, -37], [0, -41], [-15, -39], [-45, -47], [11, -47], [-12, -48], [-14, -58], [-39, -4], [-41, 49], [-56, 0], [-27, 32], [-18, 58], [-49, 73], [-14, 39], [-3, 53], [-39, 54], [10, 44], [-18, 21], [27, 69], [42, 22], [11, 25], [6, 46], [-32, -21], [-15, -9], [-25, -8], [-34, 19], [-2, 40], [11, 31], [25, 1], [57, -15], [-48, 37], [-24, 20], [-28, -8], [-23, 15], [31, 55], [-17, 22], [-22, 41], [-34, 62], [-35, 23], [0, 25], [-74, 34], [-59, 5], [-74, -3], [-68, -4], [-32, 19], [-49, 37], [73, 19], [56, 3], [-119, 15], [-62, 24], [3, 23], [106, 28], [101, 29], [11, 21], [-75, 22], [24, 23], [97, 41], [40, 7], [-12, 26], [66, 16], [86, 9], [85, 1], [30, -19], [74, 33], [66, -22], [39, -5], [58, -19], [-66, 32], [4, 25]], [[2497, 5869], [-14, 10], [-17, 1], [-13, 12], [-15, 24]], [[2438, 5916], [1, 18], [3, 13], [-4, 12], [13, 48], [36, 0], [1, 20], [-5, 4], [-3, 12], [-10, 14], [-11, 20], [13, 0], [0, 33], [26, 0], [26, 0]], [[2529, 5996], [10, -11], [2, 9], [8, -7]], [[2549, 5987], [-13, -23], [-13, -16], [-2, -12], [2, -11], [-5, -15]], [[2518, 5910], [-7, -4], [2, -7], [-6, -6], [-9, -15], [-1, -9]], [[3340, 5552], [18, -22], [17, -38], [1, -31], [10, -1], [15, -29], [11, -21]], [[3412, 5410], [-4, -53], [-17, -15], [1, -14], [-5, -31], [13, -42], [9, -1], [3, -33], [17, -51]], [[3313, 5365], [-19, 45], [7, 16], [0, 27], [17, 10], [7, 11], [-10, 22], [3, 21], [22, 35]], [[2574, 5825], [-5, 18], [-8, 5]], [[2561, 5848], [2, 24], [-4, 6], [-6, 4], [-12, -7], [-1, 8], [-8, 10], [-6, 12], [-8, 5]], [[2549, 5987], [3, -3], [6, 11], [8, 1], [3, -5], [4, 3], [13, -6], [13, 2], [9, 6], [3, 7], [9, -3], [6, -4], [8, 1], [5, 5], [13, -8], [4, -1], [9, -11], [8, -13], [10, -9], [7, -17]], [[2690, 5943], [-9, 2], [-4, -8], [-10, -8], [-7, 0], [-6, -8], [-6, 3], [-4, 9], [-3, -2], [-4, -14], [-3, 1], [0, -12], [-10, -17], [-5, -7], [-3, -7], [-8, 12], [-6, -16], [-6, 1], [-6, -2], [0, -29], [-4, 0], [-3, -14], [-9, -2]], [[5522, 7770], [7, -23], [9, -17], [-11, -22]], [[5515, 7577], [-3, -10]], [[5512, 7567], [-26, 22], [-16, 21], [-26, 18], [-23, 43], [6, 5], [-13, 25], [-1, 19], [-17, 10], [-9, -26], [-8, 20], [0, 21], [1, 1]], [[5380, 7746], [20, -2], [5, 9], [9, -9], [11, -1], [0, 16], [10, 6], [2, 24], [23, 16]], [[5460, 7805], [8, -7], [21, -26], [23, -11], [10, 9]], [[3008, 6124], [-19, 10], [-13, -5], [-17, 5], [-13, -11], [-15, 18], [3, 19], [25, -8], [21, -5], [10, 13], [-12, 26], [0, 23], [-18, 9], [7, 16], [17, -3], [24, -9]], [[5471, 7900], [14, -15], [10, -6], [24, 7], [2, 12], [11, 2], [14, 9], [3, -4], [13, 8], [6, 13], [9, 4], [30, -18], [6, 6]], [[5613, 7918], [15, -16], [2, -16]], [[5630, 7886], [-17, -12], [-13, -40], [-17, -40], [-22, -11]], [[5561, 7783], [-17, 2], [-22, -15]], [[5460, 7805], [-6, 20], [-4, 0]], [[8352, 4453], [-11, -2], [-37, 42], [26, 11], [14, -18], [10, -17], [-2, -16]], [[8471, 4532], [2, -11], [1, -18]], [[8474, 4503], [-18, -45], [-24, -13], [-3, 8], [2, 20], [12, 36], [28, 23]], [[8274, 4579], [10, -16], [17, 5], [7, -25], [-32, -12], [-19, -8], [-15, 1], [10, 34], [15, 0], [7, 21]], [[8413, 4579], [-4, -32], [-42, -17], [-37, 7], [0, 22], [22, 12], [18, -18], [18, 5], [25, 21]], [[8017, 4657], [53, -6], [6, 25], [51, -29], [10, -38], [42, -11], [34, -35], [-31, -23], [-31, 24], [-25, -1], [-29, 4], [-26, 11], [-32, 22], [-21, 6], [-11, -7], [-51, 24], [-5, 25], [-25, 5], [19, 56], [34, -3], [22, -23], [12, -5], [4, -21]], [[8741, 4690], [-14, -40], [-3, 45], [5, 21], [6, 20], [7, -17], [-1, -29]], [[8534, 4853], [-11, -19], [-19, 10], [-5, 26], [28, 3], [7, -20]], [[8623, 4875], [10, -45], [-23, 24], [-23, 5], [-16, -4], [-19, 2], [6, 33], [35, 2], [30, -17]], [[8916, 4904], [0, -193], [1, -192]], [[8917, 4519], [-25, 48], [-28, 12], [-7, -17], [-35, -1], [12, 48], [17, 16], [-7, 64], [-14, 50], [-53, 50], [-23, 5], [-42, 54], [-8, -28], [-11, -5], [-6, 21], [0, 26], [-21, 29], [29, 21], [20, -1], [-2, 16], [-41, 0], [-11, 35], [-25, 11], [-11, 29], [37, 14], [14, 20], [45, -25], [4, -22], [8, -95], [29, -35], [23, 62], [32, 36], [25, 0], [23, -21], [21, -21], [30, -11]], [[8478, 5141], [-22, -58], [-21, -12], [-27, 12], [-46, -3], [-24, -8], [-4, -45], [24, -53], [15, 27], [52, 20], [-2, -27], [-12, 9], [-12, -35], [-25, -23], [27, -76], [-5, -20], [25, -68], [-1, -39], [-14, -17], [-11, 20], [13, 49], [-27, -23], [-7, 16], [3, 23], [-20, 35], [3, 57], [-19, -18], [2, -69], [1, -84], [-17, -9], [-12, 18], [8, 54], [-4, 57], [-12, 1], [-9, 40], [12, 39], [4, 47], [14, 89], [5, 24], [24, 44], [22, -18], [35, -8], [32, 3], [27, 43], [5, -14]], [[8574, 5124], [-2, -51], [-14, 6], [-4, -36], [11, -32], [-8, -7], [-11, 38], [-8, 75], [6, 47], [9, 22], [2, -32], [16, -5], [3, -25]], [[8045, 5176], [5, -39], [19, -34], [18, 12], [18, -4], [16, 30], [13, 5], [26, -17], [23, 13], [14, 82], [11, 21], [10, 67], [32, 0], [24, -10]], [[8274, 5302], [-16, -53], [20, -56], [-5, -28], [32, -54], [-33, -7], [-10, -40], [2, -54], [-27, -40], [-1, -59], [-10, -91], [-5, 21], [-31, -26], [-11, 36], [-20, 3], [-14, 19], [-33, -21], [-10, 29], [-18, -4], [-23, 7], [-4, 79], [-14, 17], [-13, 50], [-4, 52], [3, 55], [16, 39]], [[7939, 4712], [-31, -1], [-24, 49], [-35, 48], [-12, 36], [-21, 48], [-14, 44], [-21, 83], [-24, 49], [-9, 51], [-10, 46], [-25, 37], [-14, 51], [-21, 33], [-29, 65], [-3, 30], [18, -2], [43, -12], [25, -57], [21, -40], [16, -25], [26, -63], [28, -1], [23, -41], [16, -49], [22, -27], [-12, -49], [16, -20], [10, -2], [5, -41], [10, -33], [20, -5], [14, -37], [-7, -74], [-1, -91]], [[7252, 6841], [-17, -27], [-11, -55], [27, -23], [26, -29], [36, -33], [38, -8], [16, -30], [22, -5], [33, -14], [23, 1], [4, 23], [-4, 38], [2, 25]], [[7703, 6727], [2, -22], [-10, -11], [2, -36], [-19, 10], [-36, -41], [0, -33], [-15, -50], [-1, -29], [-13, -48], [-21, 13], [-1, -61], [-7, -20], [3, -25], [-14, -14]], [[7472, 6360], [-4, -21], [-19, 1], [-34, -13], [2, -44], [-15, -35], [-40, -40], [-31, -69], [-21, -38], [-28, -38], [0, -27], [-13, -15], [-26, -21], [-12, -3], [-9, -45], [6, -77], [1, -49], [-11, -56], [0, -101], [-15, -2], [-12, -46], [8, -19], [-25, -17], [-10, -40], [-11, -17], [-26, 55], [-13, 83], [-11, 60], [-9, 28], [-15, 56], [-7, 74], [-5, 37], [-25, 81], [-12, 115], [-8, 75], [0, 72], [-5, 55], [-41, -35], [-19, 7], [-36, 71], [13, 22], [-8, 23], [-33, 50]], [[6893, 6457], [19, 40], [61, -1], [-6, 51], [-15, 30], [-4, 46], [-18, 26], [31, 62], [32, -4], [29, 61], [18, 60], [27, 60], [-1, 42], [24, 34], [-23, 29], [-9, 40], [-10, 52], [14, 25], [42, -14], [31, 9], [26, 49]], [[4827, 8240], [5, -42], [-21, -53], [-49, -35], [-40, 9], [23, 62], [-15, 60], [38, 46], [21, 28]], [[6497, 7255], [25, 12], [19, 33], [19, -1], [12, 11], [20, -6], [31, -30], [22, -6], [31, -53], [21, -2], [3, -49]], [[6690, 6820], [14, -31], [11, -36], [27, -26], [1, -52], [13, -10], [2, -27], [-40, -30], [-10, -69]], [[6708, 6539], [-53, 18], [-30, 13], [-31, 8], [-12, 73], [-13, 10], [-22, -11], [-28, -28], [-34, 20], [-28, 45], [-27, 17], [-18, 56], [-21, 79], [-15, -10], [-17, 20], [-11, -24]], [[6348, 6825], [-15, 32], [0, 31], [-9, 0], [5, 43], [-15, 45], [-34, 32], [-19, 56], [6, 46], [14, 21], [-2, 34], [-18, 18], [-18, 70]], [[6243, 7253], [-15, 48], [5, 18], [-8, 68], [19, 17]], [[6357, 7321], [9, -43], [26, -13], [20, -29], [39, -10], [44, 15], [2, 14]], [[6348, 6825], [-16, 3]], [[6332, 6828], [-19, 5], [-20, -56]], [[6293, 6777], [-52, 4], [-78, 119], [-41, 41], [-34, 16]], [[6088, 6957], [-11, 72]], [[6077, 7029], [61, 62], [11, 71], [-3, 43], [16, 15], [14, 37]], [[6176, 7257], [12, 9], [32, -8], [10, -15], [13, 10]], [[4597, 8984], [-7, -39], [31, -40], [-36, -45], [-80, -41], [-24, -10], [-36, 8], [-78, 19], [28, 26], [-61, 29], [49, 12], [-1, 17], [-58, 14], [19, 38], [42, 9], [43, -40], [42, 32], [35, -17], [45, 32], [47, -4]], [[5992, 6990], [-5, -19]], [[5987, 6971], [-10, 8], [-6, -39], [7, -7], [-7, -8], [-1, -15], [13, 8]], [[5983, 6918], [0, -23], [-14, -95]], [[5951, 6902], [8, 19], [-2, 4], [8, 27], [5, 45], [4, 15], [1, 0]], [[5975, 7012], [9, 0], [3, 11], [7, 0]], [[5994, 7023], [1, -24], [-4, -9], [1, 0]], [[5431, 7316], [-10, -46], [4, -19], [-6, -30], [-21, 22], [-14, 7], [-39, 30], [4, 30], [32, -6], [28, 7], [22, 5]], [[5255, 7492], [17, -42], [-4, -78], [-13, 4], [-11, -20], [-10, 16], [-2, 71], [-6, 34], [15, -3], [14, 18]], [[5383, 7805], [-3, -29], [7, -25]], [[5387, 7751], [-22, 8], [-23, -20], [1, -30], [-3, -17], [9, -30], [26, -29], [14, -49], [31, -48], [22, 0], [7, -13], [-8, -11], [25, -22], [20, -18], [24, -30], [3, -11], [-5, -22], [-16, 28], [-24, 10], [-12, -39], [20, -21], [-3, -31], [-11, -4], [-15, -50], [-12, -5], [0, 18], [6, 32], [6, 12], [-11, 35], [-8, 29], [-12, 8], [-8, 25], [-18, 11], [-12, 24], [-21, 4], [-21, 26], [-26, 39], [-19, 34], [-8, 58], [-14, 7], [-23, 20], [-12, -8], [-16, -28], [-12, -4]], [[2845, 6150], [19, -5], [14, -15], [5, -16], [-19, -1], [-9, -10], [-15, 10], [-16, 21], [3, 14], [12, 4], [6, -2]], [[5992, 6990], [31, -24], [54, 63]], [[6088, 6957], [-5, -8], [-56, -30], [28, -59], [-9, -10], [-5, -20], [-21, -8], [-7, -21], [-12, -19], [-31, 10]], [[5970, 6792], [-1, 8]], [[5983, 6918], [4, 17], [0, 36]], [[8739, 7075], [4, -20], [-16, -36], [-11, 19], [-15, -14], [-7, -34], [-18, 16], [0, 28], [15, 36], [16, -7], [12, 25], [20, -13]], [[8915, 7252], [-10, -47], [4, -30], [-14, -42], [-35, -27], [-49, -4], [-40, -67], [-19, 22], [-1, 44], [-48, -13], [-33, -27], [-32, -2], [28, -43], [-19, -101], [-18, -24], [-13, 23], [7, 53], [-18, 17], [-11, 41], [26, 18], [15, 37], [28, 30], [20, 41], [55, 17], [30, -12], [29, 105], [19, -28], [40, 59], [16, 23], [18, 72], [-5, 67], [11, 37], [30, 11], [15, -82], [-1, -48], [-25, -59], [0, -61]], [[8997, 7667], [19, -12], [20, 25], [6, -67], [-41, -16], [-25, -59], [-43, 41], [-15, -65], [-31, -1], [-4, 59], [14, 46], [29, 3], [8, 82], [9, 46], [32, -62], [22, -20]], [[6970, 7554], [-15, -10], [-37, -42], [-12, -42], [-11, 0], [-7, 28], [-36, 2], [-5, 48], [-14, 0], [2, 60], [-33, 43], [-48, -5], [-32, -8], [-27, 53], [-22, 22], [-43, 43], [-6, 5], [-71, -35], [1, -218]], [[6554, 7498], [-14, -3], [-20, 46], [-18, 17], [-32, -12], [-12, -20]], [[6458, 7526], [-2, 14], [7, 25], [-5, 21], [-32, 20], [-13, 53], [-15, 15], [-1, 19], [27, -6], [1, 44], [23, 9], [25, -9], [5, 58], [-5, 36], [-28, -2], [-24, 14], [-32, -26], [-26, -12]], [[6363, 7799], [-14, 9], [3, 31], [-18, 39], [-20, -2], [-24, 40], [16, 45], [-8, 12], [22, 65], [29, -34], [3, 43], [58, 64], [43, 2], [61, -41], [33, -24], [30, 25], [44, 1], [35, -30], [8, 17], [39, -2], [7, 28], [-45, 40], [27, 29], [-5, 16], [26, 15], [-20, 41], [13, 20], [104, 21], [13, 14], [70, 22], [25, 24], [50, -12], [9, -61], [29, 14], [35, -20], [-2, -32], [27, 3], [69, 56], [-10, -19], [35, -46], [62, -150], [15, 31], [39, -34], [39, 16], [16, -11], [13, -34], [20, -12], [11, -25], [36, 8], [15, -36]], [[7229, 7559], [-17, 9], [-14, 21], [-42, 6], [-46, 2], [-10, -6], [-39, 24], [-16, -12], [-4, -35], [-46, 21], [-18, -9], [-7, -26]], [[6155, 4958], [-20, -24], [-7, -24], [-10, -4], [-4, -42], [-9, -24], [-5, -39], [-12, -20]], [[6088, 4781], [-40, 59], [-1, 35], [-101, 120], [-5, 6]], [[5941, 5001], [0, 63], [8, 24], [14, 39], [10, 43], [-13, 68], [-3, 30], [-13, 41]], [[5944, 5309], [17, 35], [19, 39]], [[6162, 5289], [-24, -67], [0, -215], [17, -49]], [[7046, 7387], [-53, -9], [-34, 19], [-30, -4], [3, 34], [30, -10], [10, 18]], [[6972, 7435], [21, -6], [36, 43], [-33, 31], [-20, -15], [-21, 22], [24, 39], [-9, 5]], [[7849, 5777], [-7, 72], [18, 49], [36, 11], [26, -8]], [[7922, 5901], [23, -23], [12, 40], [25, -21]], [[7982, 5897], [6, -40], [-3, -71], [-47, -45], [13, -36], [-30, -4], [-24, -24]], [[7897, 5677], [-23, 9], [-11, 30], [-14, 61]], [[8564, 7339], [24, -70], [7, -38], [0, -68], [-10, -33], [-25, -11], [-22, -25], [-25, -5], [-3, 32], [5, 45], [-13, 61], [21, 10], [-19, 51]], [[8504, 7288], [2, 5], [12, -2], [11, 27], [20, 2], [11, 4], [4, 15]], [[5557, 7574], [5, 13]], [[5562, 7587], [7, 4], [4, 20], [5, 3], [4, -8], [5, -4], [3, -10], [5, -2], [5, -11], [4, 0], [-3, -14], [-3, -7], [1, -5]], [[5599, 7553], [-6, -2], [-17, -9], [-1, -12], [-4, 0]], [[6332, 6828], [6, -26], [-3, -13], [9, -45]], [[6344, 6744], [-19, -1], [-7, 28], [-25, 6]], [[7922, 5901], [9, 26], [1, 50], [-22, 52], [-2, 58], [-21, 48], [-21, 4], [-6, -20], [-16, -2], [-8, 10], [-30, -35], [0, 53], [7, 62], [-19, 3], [-2, 36], [-12, 18]], [[7780, 6264], [6, 21], [24, 39]], [[7837, 6385], [17, -47], [12, -54], [34, 0], [11, -52], [-18, -15], [-8, -21], [34, -36], [23, -70], [17, -52], [21, -41], [7, -41], [-5, -59]], [[5975, 7012], [10, 49], [14, 41], [0, 2]], [[5999, 7104], [13, -3], [4, -23], [-15, -22], [-7, -33]], [[4785, 5315], [-7, 0], [-29, 28], [-25, 45], [-24, 32], [-18, 38]], [[4682, 5458], [6, 19], [2, 17], [12, 33], [13, 27]], [[5412, 6408], [-20, -22], [-15, 33], [-44, 25]], [[5263, 6848], [13, 14], [3, 25], [-3, 24], [19, 23], [8, 19], [14, 17], [2, 45]], [[5319, 7015], [32, -20], [12, 5], [23, -10], [37, -26], [13, -53], [25, -11], [39, -25], [30, -29], [13, 15], [13, 27], [-6, 45], [9, 29], [20, 28], [19, 8], [37, -12], [10, -27], [10, 0], [9, -10], [28, -7], [6, -19]], [[5694, 6357], [0, -118], [-32, 0], [0, -25]], [[5662, 6214], [-111, 113], [-111, 113], [-28, -32]], [[7271, 5502], [-4, -62], [-12, -16], [-24, -14], [-13, 47], [-5, 85], [13, 96], [19, -33], [13, -42], [13, -61]], [[5804, 3347], [10, -18], [-9, -29], [-4, -19], [-16, -9], [-5, -19], [-10, -6], [-21, 46], [15, 37], [15, 23], [13, 12], [12, -18]], [[5631, 8267], [-2, 15], [3, 16], [-13, 10], [-29, 10]], [[5590, 8318], [-6, 50]], [[5584, 8368], [32, 18], [47, -4], [27, 6], [4, -12], [15, -4], [26, -29]], [[5652, 8242], [-7, 19], [-14, 6]], [[5584, 8368], [1, 44], [14, 37], [26, 20], [22, -44], [22, 1], [6, 46]], [[5757, 8453], [14, -14], [2, -28], [9, -35]], [[4759, 6691], [-4, 0], [0, -31], [-17, -2], [-9, -14], [-13, 0], [-10, 8], [-23, -6], [-9, -46], [-9, -5], [-13, -74], [-38, -64], [-9, -81], [-12, -27], [-3, -21], [-63, -5]], [[4527, 6323], [1, 27], [11, 17], [9, 30], [-2, 20], [10, 42], [15, 38], [9, 9], [8, 35], [0, 31], [10, 37], [19, 21], [18, 60], [0, 1], [14, 23], [26, 6], [22, 41], [14, 16], [23, 49], [-7, 73], [10, 51], [4, 31], [18, 40], [28, 27], [21, 25], [18, 61], [9, 36], [20, 0], [17, -25], [26, 4], [29, -13], [12, -1]], [[5739, 7906], [6, 9], [19, 6], [20, -19], [12, -2], [12, -16], [-2, -20], [11, -9], [4, -25], [9, -15], [-2, -9], [5, -6], [-7, -4], [-16, 1], [-3, 9], [-6, -5], [2, -11], [-7, -19], [-5, -20], [-7, -6]], [[5784, 7745], [-5, 27], [3, 25], [-1, 26], [-16, 35], [-9, 25], [-9, 17], [-8, 6]], [[6376, 4321], [7, -25], [7, -39], [4, -71], [7, -28], [-2, -28], [-5, -18], [-10, 35], [-5, -18], [5, -43], [-2, -25], [-8, -14], [-1, -50], [-11, -69], [-14, -81], [-17, -112], [-11, -82], [-12, -69], [-23, -14], [-24, -25], [-16, 15], [-22, 21], [-8, 31], [-2, 53], [-10, 47], [-2, 42], [5, 43], [13, 10], [0, 20], [13, 45], [2, 37], [-6, 28], [-5, 38], [-2, 54], [9, 33], [4, 38], [14, 2], [15, 12], [11, 10], [12, 1], [16, 34], [23, 36], [8, 30], [-4, 25], [12, -7], [15, 41], [1, 36], [9, 26], [10, -25]], [[2301, 6586], [-10, -52], [-5, -43], [-2, -79], [-3, -29], [5, -32], [9, -29], [5, -45], [19, -44], [6, -34], [11, -29], [29, -16], [12, -25], [24, 17], [21, 6], [21, 11], [18, 10], [17, 24], [7, 34], [2, 50], [5, 17], [19, 16], [29, 13], [25, -2], [17, 5], [6, -12], [-1, -29], [-15, -35], [-6, -36], [5, -10], [-4, -26], [-7, -46], [-7, 15], [-6, -1]], [[2438, 5916], [-32, 64], [-14, 19], [-23, 16], [-15, -5], [-22, -22], [-14, -6], [-20, 16], [-21, 11], [-26, 27], [-21, 8], [-31, 28], [-23, 28], [-7, 16], [-16, 3], [-28, 19], [-12, 27], [-30, 34], [-14, 37], [-6, 29], [9, 5], [-3, 17], [7, 16], [0, 20], [-10, 27], [-2, 23], [-9, 30], [-25, 59], [-28, 46], [-13, 37], [-24, 24], [-5, 14], [4, 37], [-14, 13], [-17, 29], [-7, 41], [-14, 5], [-17, 31], [-13, 29], [-1, 19], [-15, 44], [-10, 45], [1, 23], [-20, 23], [-10, -2], [-15, 16], [-5, -24], [5, -28], [2, -45], [10, -24], [21, -41], [4, -14], [4, -4], [4, -20], [5, 1], [6, -38], [8, -15], [6, -21], [17, -30], [10, -55], [8, -26], [8, -28], [1, -31], [13, -2], [12, -27], [10, -26], [-1, -11], [-12, -21], [-5, 0], [-7, 36], [-18, 33], [-20, 29], [-14, 15], [1, 43], [-5, 32], [-13, 19], [-19, 26], [-4, -8], [-7, 16], [-17, 14], [-16, 34], [2, 5], [11, -4], [11, 22], [1, 27], [-22, 42], [-16, 17], [-10, 36], [-11, 39], [-12, 47], [-12, 54]], [[1746, 6980], [32, 4], [35, 7], [-2, -12], [41, -29], [64, -41], [55, 0], [22, 0], [0, 24], [48, 0], [10, -20], [15, -19], [16, -26], [9, -31], [7, -32], [15, -18], [23, -18], [17, 47], [23, 1], [19, -24], [14, -40], [10, -35], [16, -34], [6, -41], [8, -28], [22, -18], [20, -13], [10, 2]], [[5599, 7553], [9, 4], [13, 1]], [[4661, 5921], [10, 11], [4, 35], [9, 1], [20, -16], [15, 11], [11, -4], [4, 13], [112, 1], [6, 42], [-5, 7], [-13, 255], [-14, 255], [43, 1]], [[5118, 6189], [0, -136], [-15, -39], [-2, -37], [-25, -9], [-38, -5], [-10, -21], [-18, -3]], [[4680, 5793], [1, 18], [-2, 23], [-11, 16], [-5, 34], [-2, 37]], [[7737, 5644], [-3, 44], [9, 45], [-10, 35], [3, 65], [-12, 30], [-9, 71], [-5, 75], [-12, 49], [-18, -30], [-32, -42], [-15, 5], [-17, 14], [9, 73], [-6, 56], [-21, 68], [3, 21], [-16, 7], [-20, 49]], [[7780, 6264], [-16, -14], [-16, -26], [-20, -2], [-12, -64], [-12, -11], [14, -52], [17, -43], [12, -39], [-11, -51], [-9, -11], [6, -30], [19, -47], [3, -33], [0, -27], [11, -54], [-16, -55], [-13, -61]], [[5538, 7532], [-6, 4], [-8, 19], [-12, 12]], [[5533, 7629], [8, -10], [4, -9], [9, -6], [10, -12], [-2, -5]], [[7437, 7970], [29, 10], [53, 51], [42, 28], [24, -18], [29, -1], [19, -28], [28, -2], [40, -15], [27, 41], [-11, 35], [28, 61], [31, -24], [26, -7], [32, -15], [6, -44], [39, -25], [26, 11], [36, 7], [27, -7], [28, -29], [16, -30], [26, 1], [35, -10], [26, 15], [36, 9], [41, 42], [17, -6], [14, -20], [33, 5]], [[5959, 4377], [21, 5], [34, -17], [7, 8], [19, 1], [10, 18], [17, -1], [30, 23], [22, 34]], [[6119, 4448], [5, -26], [-1, -59], [3, -52], [1, -92], [5, -29], [-8, -43], [-11, -41], [-18, -36], [-25, -23], [-31, -28], [-32, -64], [-10, -11], [-20, -42], [-11, -13], [-3, -42], [14, -45], [5, -35], [0, -17], [5, 3], [-1, -58], [-4, -28], [6, -10], [-4, -25], [-11, -21], [-23, -20], [-34, -32], [-12, -21], [3, -25], [7, -4], [-3, -31]], [[5911, 3478], [-21, 0]], [[5890, 3478], [-2, 26], [-4, 27]], [[5884, 3531], [-3, 21], [5, 66], [-7, 42], [-13, 83]], [[5866, 3743], [29, 67], [7, 43], [5, 5], [3, 35], [-5, 17], [1, 44], [6, 41], [0, 75], [-15, 19], [-13, 4], [-6, 15], [-13, 12], [-23, -1], [-2, 22]], [[5840, 4141], [-2, 42], [84, 49]], [[5922, 4232], [16, -28], [8, 5], [11, -15], [1, -23], [-6, -28], [2, -42], [19, -36], [8, 41], [12, 12], [-2, 76], [-12, 43], [-10, 19], [-10, -1], [-7, 77], [7, 45]], [[4661, 5921], [-18, 41], [-17, 43], [-18, 16], [-13, 17], [-16, -1], [-13, -12], [-14, 5], [-10, -19]], [[4542, 6011], [-2, 32], [8, 29], [3, 55], [-3, 59], [-3, 29], [2, 30], [-7, 28], [-14, 25]], [[4526, 6298], [6, 20], [108, -1], [-5, 86], [7, 30], [26, 5], [-1, 152], [91, -4], [0, 90]], [[5922, 4232], [-15, 15], [9, 55], [9, 21], [-6, 49], [6, 48], [5, 16], [-7, 50], [-14, 26]], [[5909, 4512], [28, -11], [5, -16], [10, -28], [7, -80]], [[7836, 5425], [7, -5], [16, -36], [12, -40], [2, -39], [-3, -27], [2, -21], [2, -35], [10, -16], [11, -52], [-1, -20], [-19, -4], [-27, 44], [-32, 47], [-4, 30], [-16, 39], [-4, 49], [-10, 32], [4, 43], [-7, 25]], [[7779, 5439], [5, 11], [23, -26], [2, -30], [18, 7], [9, 24]], [[8045, 5176], [21, -20], [21, 11], [6, 50], [12, 11], [33, 13], [20, 47], [14, 37]], [[8206, 5379], [22, 41], [14, 47], [11, 0], [14, -30], [1, -26], [19, -16], [23, -18], [-2, -23], [-19, -3], [5, -29], [-20, -20]], [[5453, 3369], [-20, 45], [-11, 43], [-6, 58], [-7, 42], [-9, 91], [-1, 71], [-3, 32], [-11, 25], [-15, 48], [-14, 71], [-6, 37], [-23, 58], [-2, 45]], [[5644, 4022], [23, 14], [18, -4], [11, -13], [0, -5]], [[5552, 3594], [0, -218], [-25, -30], [-15, -4], [-17, 11], [-13, 4], [-4, 25], [-11, 17], [-14, -30]], [[9604, 3812], [23, -36], [14, -28], [-10, -14], [-16, 16], [-19, 27], [-18, 31], [-19, 42], [-4, 20], [12, -1], [16, -20], [12, -20], [9, -17]], [[5412, 6408], [7, -92], [10, -15], [1, -19], [11, -20], [-6, -25], [-11, -120], [-1, -77], [-35, -56], [-12, -78], [11, -22], [0, -38], [18, -1], [-3, -28]], [[5393, 5795], [-5, -1], [-19, 64], [-6, 3], [-22, -33], [-21, 17], [-15, 3], [-8, -8], [-17, 2], [-16, -25], [-14, -2], [-34, 31], [-13, -15], [-14, 1], [-10, 23], [-28, 22], [-30, -7], [-7, -13], [-4, -34], [-8, -24], [-2, -53]], [[5236, 5339], [-29, -21], [-11, 3], [-10, -13], [-23, 1], [-15, 37], [-9, 43], [-19, 39], [-21, -1], [-25, 0]], [[2619, 5713], [-10, 18], [-13, 24], [-6, 20], [-12, 19], [-13, 26], [3, 9], [4, -9], [2, 5]], [[2690, 5943], [-2, -5], [-2, -13], [3, -22], [-6, -20], [-3, -24], [-1, -26], [1, -15], [1, -27], [-4, -6], [-3, -25], [2, -15], [-6, -16], [2, -16], [4, -9]], [[5092, 8091], [14, 16], [24, 87], [38, 25], [23, -2]], [[5863, 9167], [-47, -24], [-22, -5]], [[5573, 9140], [-17, -2], [-4, -39], [-53, 9], [-7, -33], [-27, 1], [-18, -42], [-28, -66], [-43, -83], [10, -20], [-10, -24], [-27, 1], [-18, -55], [2, -79], [17, -29], [-9, -70], [-23, -40], [-12, -34]], [[5306, 8535], [-19, 36], [-55, -69], [-37, -13], [-38, 30], [-10, 63], [-9, 137], [26, 38], [73, 49], [55, 61], [51, 82], [66, 115], [47, 44], [76, 74], [61, 26], [46, -3], [42, 49], [51, -3], [50, 12], [87, -43], [-36, -16], [30, -37]], [[5686, 9657], [-62, -24], [-49, 13], [19, 16], [-16, 19], [57, 11], [11, -22], [40, -13]], [[5506, 9766], [92, -44], [-70, -23], [-15, -44], [-25, -11], [-13, -49], [-34, -2], [-59, 36], [25, 21], [-42, 17], [-54, 50], [-21, 46], [75, 21], [16, -20], [39, 0], [11, 21], [40, 2], [35, -21]], [[5706, 9808], [55, -21], [-41, -32], [-81, -7], [-82, 10], [-5, 16], [-40, 1], [-30, 27], [86, 17], [40, -14], [28, 17], [70, -14]], [[9805, 2640], [6, -24], [20, 24], [8, -25], [0, -25], [-10, -27], [-18, -44], [-14, -24], [10, -28], [-22, -1], [-23, -22], [-8, -39], [-16, -60], [-21, -26], [-14, -17], [-26, 1], [-18, 20], [-30, 4], [-5, 22], [15, 43], [35, 59], [18, 11], [20, 22], [24, 31], [16, 31], [13, 44], [10, 15], [5, 33], [19, 27], [6, -25]], [[9849, 2922], [20, -63], [1, 41], [13, -16], [4, -45], [22, -19], [19, -5], [16, 22], [14, -6], [-7, -53], [-8, -34], [-22, 1], [-7, -18], [3, -25], [-4, -11], [-11, -32], [-14, -41], [-21, -23], [-5, 15], [-12, 9], [16, 48], [-9, 33], [-30, 23], [1, 22], [20, 20], [5, 46], [-1, 38], [-12, 40], [1, 10], [-13, 25], [-22, 52], [-12, 42], [11, 4], [15, -33], [21, -15], [8, -52]], [[6475, 6041], [-9, 41], [-22, 98]], [[6444, 6180], [83, 59], [19, 118], [-13, 42]], [[6566, 6530], [12, -40], [16, -22], [20, -8], [17, -10], [12, -34], [8, -20], [10, -7], [0, -13], [-10, -36], [-5, -16], [-12, -19], [-10, -41], [-13, 3], [-5, -14], [-5, -30], [4, -39], [-3, -7], [-13, 0], [-17, -22], [-3, -29], [-6, -12], [-18, 0], [-10, -15], [0, -24], [-14, -16], [-15, 5], [-19, -19], [-12, -4]], [[6557, 6597], [8, 20], [3, -5], [-2, -25], [-4, -10]], [[6893, 6457], [-20, 15], [-9, 43], [-21, 45], [-51, -12], [-45, -1], [-39, -8]], [[2836, 5484], [-9, 17], [-6, 32], [7, 16], [-7, 4], [-5, 20], [-14, 16], [-12, -4], [-6, -20], [-11, -15], [-6, -2], [-3, -13], [13, -32], [-7, -7], [-4, -9], [-13, -3], [-5, 35], [-4, -10], [-9, 4], [-5, 24], [-12, 3], [-7, 7], [-12, 0], [-1, -13], [-3, 9]], [[2707, 5623], [10, -22], [-1, -12], [11, -3], [3, 5], [8, -14], [13, 4], [12, 15], [17, 12], [9, 17], [16, -3], [-1, -6], [15, -2], [12, -10], [10, -18], [10, -16]], [[3045, 3974], [-28, 33], [-2, 25], [-55, 59], [-50, 65], [-22, 36], [-11, 49], [4, 17], [-23, 77], [-28, 109], [-26, 118], [-11, 27], [-9, 43], [-21, 39], [-20, 24], [9, 26], [-14, 57], [9, 41], [22, 37]], [[8510, 5555], [2, -40], [2, -33], [-9, -54], [-11, 60], [-13, -30], [9, -43], [-8, -28], [-32, 35], [-8, 42], [8, 28], [-17, 28], [-9, -24], [-13, 2], [-21, -33], [-4, 17], [11, 50], [17, 17], [15, 22], [10, -27], [21, 17], [5, 26], [19, 1], [-1, 46], [22, -28], [3, -30], [2, -21]], [[8443, 5665], [-10, -20], [-9, -37], [-8, -17], [-17, 40], [5, 16], [7, 17], [3, 36], [16, 4], [-5, -40], [21, 57], [-3, -56]], [[8291, 5608], [-37, -56], [14, 41], [20, 37], [16, 41], [15, 58], [5, -48], [-18, -33], [-15, -40]], [[8385, 5760], [16, -18], [18, 0], [0, -25], [-13, -25], [-18, -18], [-1, 28], [2, 30], [-4, 28]], [[8485, 5776], [8, -66], [-21, 16], [0, -20], [7, -37], [-13, -13], [-1, 42], [-9, 3], [-4, 36], [16, -5], [0, 22], [-17, 45], [27, -1], [7, -22]], [[8375, 5830], [-7, -51], [-12, 29], [-15, 45], [24, -2], [10, -21]], [[8369, 6151], [17, -17], [9, 15], [2, -15], [-4, -24], [9, -43], [-7, -49], [-16, -19], [-5, -48], [7, -47], [14, -7], [13, 7], [34, -32], [-2, -32], [9, -15], [-3, -27], [-22, 29], [-10, 31], [-7, -22], [-18, 36], [-25, -9], [-14, 13], [1, 25], [9, 15], [-8, 13], [-4, -21], [-14, 34], [-4, 26], [-1, 56], [11, -19], [3, 92], [9, 54], [17, 0]], [[9329, 4655], [-8, -6], [-12, 22], [-12, 38], [-6, 45], [4, 6], [3, -18], [8, -13], [14, -38], [13, -20], [-4, -16]], [[9221, 4734], [-15, -5], [-4, -17], [-15, -14], [-15, -14], [-14, 0], [-23, 18], [-16, 16], [2, 18], [25, -8], [15, 4], [5, 29], [4, 1], [2, -31], [16, 4], [8, 20], [16, 21], [-4, 35], [17, 1], [6, -9], [-1, -33], [-9, -36]], [[8916, 4904], [48, -41], [51, -34], [19, -30], [16, -30], [4, -34], [46, -37], [7, -31], [-25, -7], [6, -39], [25, -39], [18, -62], [15, 2], [-1, -27], [22, -10], [-9, -11], [30, -25], [-3, -17], [-18, -4], [-7, 16], [-24, 6], [-28, 9], [-22, 38], [-16, 32], [-14, 52], [-36, 26], [-24, -17], [-17, -20], [4, -43], [-22, -20], [-16, 9], [-28, 3]], [[9253, 4792], [-9, -16], [-5, 35], [-6, 23], [-13, 19], [-16, 25], [-20, 18], [8, 14], [15, -17], [9, -13], [12, -14], [11, -25], [11, -19], [3, -30]], [[5392, 8233], [19, 18], [43, 27], [35, 20], [28, -10], [2, -14], [27, -1]], [[5546, 8273], [34, -7], [51, 1]], [[5653, 8105], [14, -52], [-3, -17], [-14, -6], [-25, -50], [7, -26], [-6, 3]], [[5626, 7957], [-26, 23], [-20, -8], [-13, 6], [-17, -13], [-14, 21], [-11, -8], [-2, 4]], [[3159, 6151], [14, -5], [5, -12], [-7, -15], [-21, 1], [-17, -2], [-1, 25], [4, 9], [23, -1]], [[8628, 7562], [4, -10]], [[8632, 7552], [-11, 3], [-12, -20], [-8, -20], [1, -42], [-14, -13], [-5, -11], [-11, -17], [-18, -10], [-12, -16], [-1, -25], [-3, -7], [11, -9], [15, -26]], [[8504, 7288], [-13, 11], [-4, -11], [-8, -5], [-1, 11], [-7, 5], [-8, 10], [8, 26], [7, 7], [-3, 11], [7, 31], [-2, 10], [-16, 7], [-13, 15]], [[4792, 7249], [-11, -15], [-14, 8], [-15, -6], [5, 46], [-3, 36], [-12, 6], [-7, 22], [2, 39], [11, 21], [2, 24], [6, 36], [-1, 25], [-5, 21], [-1, 20]], [[6411, 6520], [-2, 43], [7, 31], [8, 6], [8, -18], [1, -35], [-6, -35]], [[6427, 6512], [-8, -4], [-8, 12]], [[5630, 7886], [12, 13], [17, -7], [18, 0], [13, -14], [10, 9], [20, 5], [7, 14], [12, 0]], [[5784, 7745], [12, -11], [13, 9], [13, -10]], [[5822, 7733], [0, -15], [-13, -13], [-9, 6], [-7, -71]], [[5629, 7671], [-5, 10], [6, 10], [-7, 7], [-8, -13], [-17, 17], [-2, 25], [-17, 14], [-3, 18], [-15, 24]], [[8989, 8056], [28, -105], [-41, 19], [-17, -85], [27, -61], [-1, -41], [-21, 36], [-18, -46], [-5, 50], [3, 57], [-3, 64], [6, 45], [2, 79], [-17, 58], [3, 80], [25, 28], [-11, 27], [13, 8], [7, -39], [10, -57], [-1, -58], [11, -59]], [[5546, 8273], [6, 26], [38, 19]], [[0, 9132], [68, -45], [73, -59], [-3, -37], [19, -15], [-6, 43], [75, -8], [55, -56], [-28, -26], [-46, -6], [0, -57], [-11, -13], [-26, 2], [-22, 21], [-36, 17], [-7, 26], [-28, 9], [-31, -7], [-16, 20], [6, 22], [-33, -14], [13, -28], [-16, -25]], [[0, 8896], [0, 236]], [[0, 9282], [9999, -40], [-30, -3], [-5, 19], [-9964, 24]], [[0, 9282], [4, 3], [23, 0], [40, -17], [-2, -8], [-29, -14], [-36, -4], [0, 40]], [[8988, 9383], [-42, -1], [-57, 7], [-5, 3], [27, 23], [34, 6], [40, -23], [3, -15]], [[9186, 9493], [-32, -23], [-44, 5], [-52, 23], [7, 20], [51, -9], [70, -16]], [[9029, 9522], [-22, -44], [-102, 1], [-46, -14], [-55, 39], [15, 40], [37, 11], [73, -2], [100, -31]], [[6598, 9235], [-17, -5], [-91, 8], [-7, 26], [-50, 16], [-4, 32], [28, 13], [-1, 32], [55, 50], [-25, 7], [66, 52], [-7, 27], [62, 31], [91, 38], [93, 11], [48, 22], [54, 8], [19, -23], [-19, -19], [-98, -29], [-85, -28], [-86, -57], [-42, -57], [-43, -57], [5, -49], [54, -49]], [[0, 8896], [9963, -26], [-36, 4], [25, -31], [17, -49], [13, -16], [3, -24], [-7, -16], [-52, 13], [-78, -44], [-25, -7], [-42, -42], [-40, -36], [-11, -27], [-39, 41], [-73, -46], [-12, 22], [-27, -26], [-37, 8], [-9, -38], [-33, -58], [1, -24], [31, -13], [-4, -86], [-25, -2], [-12, -49], [11, -26], [-48, -30], [-10, -67], [-41, -15], [-9, -60], [-40, -55], [-10, 41], [-12, 86], [-15, 131], [13, 82], [23, 35], [2, 28], [43, 13], [50, 75], [47, 60], [50, 48], [23, 83], [-34, -5], [-17, -49], [-70, -65], [-23, 73], [-72, -20], [-69, -99], [23, -36], [-62, -16], [-43, -6], [2, 43], [-43, 9], [-35, -29], [-85, 10], [-91, -18], [-90, -115], [-106, -139], [43, -8], [14, -37], [27, -13], [18, 30], [30, -4], [40, -65], [1, -50], [-21, -59], [-3, -71], [-12, -94], [-42, -86], [-9, -41], [-38, -69], [-38, -68], [-18, -35], [-37, -34], [-17, -1], [-17, 29], [-38, -44], [-4, -19]], [[6363, 7799], [-12, -35], [-27, -10], [-28, -61], [25, -56], [-2, -40], [30, -70]], [[6109, 7624], [-35, 49], [-32, 23], [-24, 34], [20, 10], [23, 49], [-15, 24], [41, 24], [-1, 13], [-25, -10]], [[6061, 7840], [1, 26], [14, 17], [27, 4], [5, 20], [-7, 33], [12, 30], [-1, 18], [-41, 19], [-16, -1], [-17, 28], [-21, -9], [-35, 20], [0, 12], [-10, 26], [-22, 3], [-2, 18], [7, 12], [-18, 33], [-29, -5], [-8, 3], [-7, -14], [-11, 3]], [[5777, 8571], [31, 33], [-29, 28]], [[5863, 9167], [29, 20], [46, -35], [76, -14], [105, -67], [21, -28], [2, -40], [-31, -31], [-45, -15], [-124, 44], [-21, -7], [45, -43], [2, -28], [2, -60], [36, -18], [22, -15], [3, 28], [-17, 26], [18, 22], [67, -37], [24, 15], [-19, 43], [65, 58], [25, -4], [26, -20], [16, 40], [-23, 35], [14, 36], [-21, 36], [78, -18], [16, -34], [-35, -7], [0, -33], [22, -20], [43, 13], [7, 38], [58, 28], [97, 50], [20, -3], [-27, -35], [35, -7], [19, 21], [52, 1], [42, 25], [31, -36], [32, 39], [-29, 35], [14, 19], [82, -18], [39, -18], [100, -68], [19, 31], [-28, 31], [-1, 13], [-34, 6], [10, 28], [-15, 46], [-1, 19], [51, 53], [18, 54], [21, 11], [74, -15], [5, -33], [-26, -48], [17, -19], [9, -41], [-6, -81], [31, -36], [-12, -40], [-55, -84], [32, -8], [11, 21], [31, 15], [7, 29], [24, 29], [-16, 33], [13, 39], [-31, 5], [-6, 33], [22, 59], [-36, 48], [50, 40], [-7, 42], [14, 2], [15, -33], [-11, -57], [29, -11], [-12, 43], [46, 23], [58, 3], [51, -34], [-25, 49], [-2, 63], [48, 12], [67, -2], [60, 7], [-23, 31], [33, 39], [31, 2], [54, 29], [74, 8], [9, 16], [73, 6], [23, -14], [62, 32], [51, -1], [8, 25], [26, 25], [66, 25], [48, -19], [-38, -15], [63, -9], [7, -29], [25, 14], [82, -1], [62, -29], [23, -22], [-7, -30], [-31, -18], [-73, -33], [-21, -17], [35, -8], [41, -15], [25, 11], [14, -38], [12, 15], [44, 10], [90, -10], [6, -28], [116, -9], [2, 46], [59, -11], [44, 1], [45, -32], [13, -37], [-17, -25], [35, -47], [44, -24], [27, 62], [44, -26], [48, 16], [53, -18], [21, 16], [45, -8], [-20, 55], [37, 25], [251, -38], [24, -35], [72, -45], [112, 11], [56, -10], [23, -24], [-4, -44], [35, -16], [37, 12], [49, 1], [52, -11], [53, 6], [49, -52], [34, 19], [-23, 37], [13, 27], [88, -17], [58, 4], [80, -29], [-9960, -25]], [[7918, 9684], [-157, -23], [51, 77], [23, 7], [21, -4], [70, -33], [-8, -24]], [[6420, 9816], [-37, -8], [-25, -4], [-4, -10], [-33, -10], [-30, 14], [16, 19], [-62, 2], [54, 10], [43, 1], [5, -16], [16, 14], [26, 10], [42, -13], [-11, -9]], [[7775, 9718], [-60, -8], [-78, 17], [-46, 23], [-21, 42], [-38, 12], [72, 40], [60, 14], [54, -30], [64, -57], [-7, -53]], [[5844, 4990], [11, -33], [-1, -35], [-8, -7]], [[5821, 4978], [7, -6], [16, 18]], [[4526, 6298], [1, 25]], [[6188, 6023], [-4, 26], [-8, 17], [-2, 24], [-15, 21], [-15, 50], [-7, 48], [-20, 40], [-12, 10], [-18, 56], [-4, 41], [2, 35], [-16, 66], [-13, 23], [-15, 12], [-10, 34], [2, 13], [-8, 31], [-8, 13], [-11, 44], [-17, 48], [-14, 40], [-14, 0], [5, 33], [1, 20], [3, 24]], [[6344, 6744], [11, -51], [14, -13], [5, -21], [18, -25], [2, -24], [-3, -20], [4, -20], [8, -16], [4, -20], [4, -14]], [[6427, 6512], [5, -22]], [[6444, 6180], [-80, -23], [-26, -26], [-20, -62], [-13, -10], [-7, 20], [-11, -3], [-27, 6], [-5, 5], [-32, -1], [-7, -5], [-12, 15], [-7, -29], [3, -25], [-12, -19]], [[5943, 5617], [-4, 1], [0, 29], [-3, 20], [-14, 24], [-4, 42], [4, 44], [-13, 4], [-2, -13], [-17, -3], [7, -17], [2, -36], [-15, -32], [-14, -43], [-14, -6], [-23, 34], [-11, -12], [-3, -17], [-14, -11], [-1, -12], [-28, 0], [-3, 12], [-20, 2], [-10, -10], [-8, 5], [-14, 34], [-5, 17], [-20, -9], [-8, -27], [-7, -53], [-10, -11], [-8, -6]], [[5663, 5567], [-2, 2]], [[5635, 5716], [0, 14], [-10, 17], [-1, 35], [-5, 23], [-10, -4], [3, 22], [7, 25], [-3, 24], [9, 18], [-6, 14], [7, 36], [13, 44], [24, -4], [-1, 234]], [[6023, 6357], [9, -58], [-6, -10], [4, -61], [11, -71], [10, -14], [15, -22]], [[5943, 5624], [0, -7]], [[5943, 5617], [0, -46]], [[5944, 5309], [-17, -28], [-20, 1], [-22, -14], [-18, 13], [-11, -16]], [[5682, 5544], [-19, 23]], [[4535, 5861], [-11, 46], [-14, 21], [12, 11], [14, 41], [6, 31]], [[4536, 5789], [-4, 45]], [[9502, 4438], [8, -20], [-19, 0], [-11, 37], [17, -15], [5, -2]], [[9467, 4474], [-11, -1], [-17, 6], [-5, 9], [1, 23], [19, -9], [9, -12], [4, -16]], [[9490, 4490], [-4, -11], [-21, 52], [-5, 35], [9, 0], [10, -47], [11, -29]], [[9440, 4565], [1, -12], [-22, 25], [-15, 21], [-10, 20], [4, 6], [13, -14], [23, -27], [6, -19]], [[9375, 4623], [-5, -3], [-13, 14], [-11, 24], [1, 10], [17, -25], [11, -20]], [[4682, 5458], [-8, 5], [-20, 24], [-14, 31], [-5, 22], [-3, 43]], [[2561, 5848], [-3, -14], [-16, 1], [-10, 6], [-12, 12], [-15, 3], [-8, 13]], [[6198, 5735], [9, -11], [5, -25], [13, -24], [14, -1], [26, 16], [30, 7], [25, 18], [13, 4], [10, 11], [16, 2]], [[6359, 5732], [0, -1], [0, -25], [0, -59], [0, -31], [-13, -36], [-19, -50]], [[6359, 5732], [9, 1], [13, 9], [14, 6], [14, 20], [10, 0], [1, -16], [-3, -35], [0, -31], [-6, -21], [-7, -64], [-14, -66], [-17, -75], [-24, -87], [-23, -66], [-33, -81], [-28, -48], [-42, -58], [-25, -45], [-31, -72], [-6, -31], [-6, -14]], [[3412, 5410], [34, -11], [2, 10], [23, 4], [30, -15]], [[3489, 5306], [10, -35], [-4, -25]], [[5626, 7957], [-8, -15], [-5, -24]], [[5380, 7746], [7, 5]], [[5663, 8957], [-47, -17], [-27, -41], [4, -36], [-44, -48], [-54, -50], [-20, -84], [20, -41], [26, -33], [-25, -67], [-29, -14], [-11, -99], [-15, -55], [-34, 6], [-16, -47], [-32, -3], [-9, 56], [-23, 67], [-21, 84]], [[5890, 3478], [-5, -26], [-17, -6], [-16, 32], [0, 20], [7, 22], [3, 17], [8, 5], [14, -11]], [[5999, 7104], [-2, 45], [7, 25]], [[6004, 7174], [7, 13], [7, 13], [2, 33], [9, -12], [31, 17], [14, -12], [23, 1], [32, 22], [15, -1], [32, 9]], [[5051, 5420], [-22, -12]], [[7849, 5777], [-25, 28], [-24, -2], [4, 47], [-24, 0], [-2, -65], [-15, -87], [-10, -52], [2, -43], [18, -2], [12, -53], [5, -52], [15, -33], [17, -7], [14, -31]], [[7779, 5439], [-11, 23], [-4, 29], [-15, 34], [-14, 28], [-4, -35], [-5, 33], [3, 37], [8, 56]], [[6883, 7252], [16, 60], [-6, 44], [-20, 14], [7, 26], [23, -3], [13, 33], [9, 38], [37, 13], [-6, -27], [4, -17], [12, 2]], [[6497, 7255], [-5, 42], [4, 62], [-22, 20], [8, 40], [-19, 4], [6, 49], [26, -14], [25, 19], [-20, 35], [-8, 34], [-23, -15], [-3, -43], [-8, 38]], [[6554, 7498], [31, 1], [-4, 29], [24, 21], [23, 34], [37, -31], [3, -47], [11, -12], [30, 2], [9, -10], [14, -61], [32, -41], [18, -28], [29, -29], [37, -25], [-1, -36]], [[8471, 4532], [3, 14], [24, 13], [19, 2], [9, 8], [10, -8], [-10, -16], [-29, -25], [-23, -17]], [[3286, 5693], [16, 8], [6, -2], [-1, -44], [-23, -7], [-5, 6], [8, 16], [-1, 23]], [[5233, 7240], [31, 24], [19, -7], [-1, -30], [24, 22], [2, -12], [-14, -29], [0, -27], [9, -15], [-3, -51], [-19, -29], [6, -33], [14, -1], [7, -28], [11, -9]], [[6004, 7174], [-11, 27], [11, 22], [-17, -5], [-23, 13], [-19, -34], [-43, -6], [-22, 31], [-30, 2], [-6, -24], [-20, -7], [-26, 31], [-31, -1], [-16, 59], [-21, 33], [14, 46], [-18, 28], [31, 56], [43, 3], [12, 45], [53, -8], [33, 38], [32, 17], [46, 1], [49, -42], [40, -22], [32, 9], [24, -6], [33, 31]], [[5777, 7539], [3, -23], [25, -19], [-5, -14], [-33, -3], [-12, -19], [-23, -31], [-9, 27], [0, 12]], [[8382, 6499], [-17, -95], [-12, -49], [-14, 50], [-4, 44], [17, 58], [22, 45], [13, -18], [-5, -35]], [[6088, 4781], [-12, -73], [1, -33], [18, -22], [1, -15], [-8, -36], [2, -18], [-2, -28], [10, -37], [11, -58], [10, -13]], [[5909, 4512], [-15, 18], [-18, 10], [-11, 10], [-12, 15]], [[5844, 4990], [10, 8], [31, -1], [56, 4]], [[6061, 7840], [-22, -5], [-18, -19], [-26, -3], [-24, -22], [1, -37], [14, -14], [28, 4], [-5, -21], [-31, -11], [-37, -34], [-16, 12], [6, 28], [-30, 17], [5, 12], [26, 19], [-8, 14], [-43, 15], [-2, 22], [-25, -8], [-11, -32], [-21, -44]], [[3517, 3063], [-12, -38], [-31, -32], [-21, 11], [-15, -6], [-26, 25], [-18, -1], [-17, 32]], [[679, 6185], [-4, -10], [-7, 8], [1, 17], [-4, 21], [1, 7], [5, 10], [-2, 11], [1, 6], [3, -1], [10, -10], [5, -5], [5, -8], [7, -21], [-1, -3], [-11, -13], [-9, -9]], [[664, 6277], [-9, -4], [-5, 12], [-3, 5], [0, 4], [3, 5], [9, -6], [8, -9], [-3, -7]], [[646, 6309], [-1, -7], [-15, 2], [2, 7], [14, -2]], [[621, 6317], [-2, -3], [-2, 1], [-9, 2], [-4, 13], [-1, 2], [7, 8], [3, -3], [8, -20]], [[574, 6356], [-4, -6], [-9, 11], [1, 4], [5, 6], [6, -1], [1, -14]], [[3135, 7724], [5, -19], [-30, -29], [-29, -20], [-29, -18], [-15, -35], [-4, -13], [-1, -31], [10, -32], [11, -1], [-3, 21], [8, -13], [-2, -17], [-19, -9], [-13, 1], [-20, -10], [-12, -3], [-17, -3], [-23, -17], [41, 11], [8, -11], [-39, -18], [-17, 0], [0, 7], [-8, -16], [8, -3], [-6, -43], [-20, -45], [-2, 15], [-6, 3], [-9, 15], [5, -32], [7, -10], [1, -23], [-9, -23], [-16, -47], [-2, 3], [8, 40], [-14, 22], [-3, 49], [-5, -25], [5, -38], [-18, 10], [19, -19], [1, -57], [8, -4], [3, -20], [4, -59], [-17, -44], [-29, -18], [-18, -34], [-14, -4], [-14, -22], [-4, -20], [-31, -38], [-16, -28], [-13, -35], [-4, -42], [5, -41], [9, -51], [13, -41], [0, -26], [13, -69], [-1, -39], [-1, -23], [-7, -36], [-8, -8], [-14, 7], [-4, 26], [-11, 14], [-15, 51], [-13, 45], [-4, 23], [6, 39], [-8, 33], [-22, 49], [-10, 9], [-28, -27], [-5, 3], [-14, 28], [-17, 14], [-32, -7], [-24, 7], [-21, -5], [-12, -9], [5, -15], [0, -24], [5, -12], [-5, -8], [-10, 9], [-11, -11], [-20, 2], [-20, 31], [-25, -8], [-20, 14], [-17, -4], [-24, -14], [-25, -44], [-27, -25], [-16, -28], [-6, -27], [0, -41], [1, -28], [5, -20]], [[1746, 6980], [-4, 30], [-18, 34], [-13, 7], [-3, 17], [-16, 3], [-10, 16], [-26, 6], [-7, 9], [-3, 32], [-27, 60], [-23, 82], [1, 14], [-13, 19], [-21, 50], [-4, 48], [-15, 32], [6, 49], [-1, 51], [-8, 45], [10, 56], [4, 53], [3, 54], [-5, 79], [-9, 51], [-8, 27], [4, 12], [40, -20], [15, -56], [7, 15], [-5, 49], [-9, 48]], [[750, 8432], [-28, -23], [-14, 15], [-4, 28], [25, 21], [15, 9], [18, -4], [12, -18], [-24, -28]], [[401, 8597], [-18, -9], [-18, 11], [-17, 16], [28, 10], [22, -6], [3, -22]], [[230, 8826], [17, -12], [17, 6], [23, -15], [27, -8], [-2, -7], [-21, -12], [-21, 13], [-11, 11], [-24, -4], [-7, 5], [2, 23]], [[1374, 8295], [-15, 22], [-25, 19], [-8, 52], [-36, 47], [-15, 56], [-26, 4], [-44, 2], [-33, 17], [-57, 61], [-27, 11], [-49, 21], [-38, -5], [-55, 27], [-33, 25], [-30, -12], [5, -41], [-15, -4], [-32, -12], [-25, -20], [-30, -13], [-4, 35], [12, 58], [30, 18], [-8, 15], [-35, -33], [-19, -39], [-40, -42], [20, -29], [-26, -42], [-30, -25], [-28, -18], [-7, -26], [-43, -31], [-9, -28], [-32, -25], [-20, 5], [-25, -17], [-29, -20], [-23, -20], [-47, -16], [-5, 9], [31, 28], [27, 18], [29, 33], [35, 6], [14, 25], [38, 35], [6, 12], [21, 21], [5, 44], [14, 35], [-32, -18], [-9, 11], [-15, -22], [-18, 30], [-8, -21], [-10, 29], [-28, -23], [-17, 0], [-3, 35], [5, 21], [-17, 22], [-37, -12], [-23, 28], [-19, 14], [0, 34], [-22, 25], [11, 34], [23, 33], [10, 30], [22, 4], [19, -9], [23, 28], [20, -5], [21, 19], [-5, 27], [-16, 10], [21, 23], [-17, -1], [-30, -13], [-8, -13], [-22, 13], [-39, -6], [-41, 14], [-12, 24], [-35, 34], [39, 25], [62, 29], [23, 0], [-4, -30], [59, 2], [-23, 37], [-34, 23], [-20, 29], [-26, 25], [-38, 19], [15, 31], [49, 2], [35, 27], [7, 29], [28, 28], [28, 6], [52, 27], [26, -4], [42, 31], [42, -12], [21, -27], [12, 11], [47, -3], [-2, -14], [43, -10], [28, 6], [59, -18], [53, -6], [21, -8], [37, 10], [42, -18], [31, -8]], [[3018, 5753], [-1, -14], [-16, -7], [9, -26], [0, -31], [-12, -35], [10, -47], [12, 4], [6, 43], [-8, 21], [-2, 45], [35, 24], [-4, 27], [10, 19], [10, -41], [19, -1], [18, -33], [1, -20], [25, 0], [30, 6], [16, -27], [21, -7], [16, 18], [0, 15], [34, 4], [34, 1], [-24, -18], [10, -28], [22, -4], [21, -29], [4, -48], [15, 2], [11, -14]], [[8001, 6331], [-37, -51], [-24, -56], [-6, -41], [22, -62], [25, -77], [26, -37], [17, -47], [12, -109], [-3, -104], [-24, -39], [-31, -38], [-23, -49], [-35, -55], [-10, 37], [8, 40], [-21, 34]], [[9661, 4085], [-9, -8], [-9, 26], [1, 16], [17, -34]], [[9641, 4175], [4, -47], [-7, 7], [-6, -3], [-4, 16], [0, 45], [13, -18]], [[6475, 6041], [-21, -16], [-5, -26], [-1, -20], [-27, -25], [-45, -28], [-24, -41], [-13, -3], [-8, 3], [-16, -25], [-18, -11], [-23, -3], [-7, -3], [-6, -16], [-8, -4], [-4, -15], [-14, 1], [-9, -8], [-19, 3], [-7, 35], [1, 32], [-5, 17], [-5, 44], [-8, 24], [5, 3], [-2, 27], [3, 12], [-1, 25]], [[5817, 3752], [11, 0], [14, -10], [9, 7], [15, -6]], [[5911, 3478], [-7, -43], [-3, -49], [-7, -27], [-19, -30], [-5, -8], [-12, -30], [-8, -31], [-16, -42], [-31, -61], [-20, -36], [-21, -26], [-29, -23], [-14, -3], [-3, -17], [-17, 9], [-14, -11], [-30, 11], [-17, -7], [-12, 3], [-28, -23], [-24, -10], [-17, -22], [-13, -1], [-11, 21], [-10, 1], [-12, 26], [-1, -8], [-4, 16], [0, 34], [-9, 40], [9, 11], [0, 45], [-19, 55], [-14, 50], [0, 1], [-20, 76]], [[5840, 4141], [-21, -8], [-15, -23], [-4, -21], [-10, -4], [-24, -49], [-15, -38], [-10, -2], [-9, 7], [-31, 7]]],
      transform: {
        scale: [0.036003600360036005, 0.016927109510951093],
        translate: [-180, -85.609038]
      }
    };

    //============================================================
   
    // projection.scale(sc / 2 / Math.PI).translate([width / 2, height / 1.3]);

    zoom.translate([0, 0]);
   

    var complementedColor = function (hex) {
      var color = parseInt(hex.slice(1), 16);
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
      return text.length * fontSize * 0.5;
    };

    var getFontSize = function (element, data) {
      var bounds = path.bounds(data);
      var textWidth = element.clientWidth;
      var textHeight = element.clientHeight;
      var h1 = (bounds[1][1] - bounds[0][1]) * 0.1;
      var h2 = (bounds[1][0] - bounds[0][0]) * 0.1;
      h1 = h1 > h2 ? h2 : h1;
      h1 = h1 < 12 ? 12 : h1;
      h1 = h1 > 16 ? 16 : h1;

      return h1;
    };


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

    //var approximateLength = function(text,fontSize){
    //  return text.length * fontSize * 0.5;
    //}

    function chart(selection) {
      selection.each(function (data) {
              var data1 = data[0].filter(function (item) {
          return !item.disabled != undefined && item.disabled == false;
        })[0];
        
        if (!data1) {
          data1 = data[0][0];
        }

        var availableWidth = width - margin.left - margin.right,
            availableHeight = height - margin.top - margin.bottom,
            container = d3.select(this);

        
        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll(".nv-wrap.nv-map").data(data);

        var wrapEnter = wrap.enter().append("g").attr("class", "nvd3 nv-wrap nv-map nv-chart-" + id);

        var gEnter = wrapEnter.append("g");
        var g = wrap.select("g");

        var pathContainer = gEnter.append("g");
        pathContainer.attr("class", "nv-map");

        wrapEnter.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var geoData = topojson.feature(worldTopo, worldTopo.objects.world).features.filter(function (feature) {
          return feature.id !== "ATA";
        });

        geoData.forEach(function (item, index) {
          var d = data1.values.filter(function (d) {
            return item.id == d.id;
          })[0];
          item.properties.category = d && d.category != null ? d.category : null;
          item.properties.value = d && d.value != null ? d.value.toPrecision(3) : null;
          item.properties.key = data1.key;
         });

        
        var tr = zoom.translate();
        
        if (tr[0] == 0 && tr[1] == 0) {
          
          projection.scale(1).translate([0,0]);
          var selectionBounds;
          
          geoData.forEach(function (item, index) {
            var d = data1.values.filter(function (d) {
              return item.id == d.id;
            })[0];
            if ( d ) { selectionBounds = mergeBounds(selectionBounds,path.bounds(item)) };
          });          
          
           var  dx = selectionBounds[1][0] - selectionBounds[0][0],
           dy = selectionBounds[1][1] - selectionBounds[0][1],
           x = (selectionBounds[0][0] + selectionBounds[1][0]) / 2,
           y = (selectionBounds[0][1] + selectionBounds[1][1]) / 2,
           scale =2*Math.PI*Math.min(width/dx, height/dy),
           translate = [(width/2-(scale*x/2/Math.PI)), (height/2-(scale*y/2/Math.PI))];
           zoom.scale(scale).translate(translate);
        }

        var geo = g.select(".nv-map").selectAll("path.map-subunit").data(geoData);
        var labels = g.select(".nv-map").selectAll("text.nv-map-label").data(geoData);
        var values = g.select(".nv-map").selectAll("text.nv-map-value").data(geoData);
        geo.exit().remove();
        labels.exit().remove();
        values.exit().remove();


        geo
          .enter()
          .append("path")
          .on("mouseover", function (d, i) {
              d3.select(this).transition().style("stroke", function (d) {
              return d.properties.category == null ? "#909090" : complementedColor(color(d, d.properties.category));
            })
          .style("stroke-opacity", "0.75").style("stroke-width", "3");
            dispatch.mapMouseover({
              point: d,
              series: d.key,
              pos: [d3.event.pageX, d3.event.pageY]
            });
          })
          .on("mouseout", function (d, i) {
            d3.select(this).transition()
            .style("stroke", "#909090")
            .style("stroke-opacity", "1")
            .style("stroke-width", "1");
            dispatch.mapMouseout({
              point: d,
              series: d.key,
              pos: [d3.event.pageX, d3.event.pageY]
            });
          });


        geo.transition().attr("class", function (d, i) {
          return "map-subunit subunit-id-" + i;
        }).style("fill", function (d) {
          return d.properties.category == null ? "#f0f0f0" : color(d, d.properties.category);
        }).style("fill-opacity", "0.6").style("stroke-width", "1px").style("stroke", "#909090");

        var highlightSubunit = function (d, i) {
          g.select(".nv-map").selectAll("path.subunit-id-" + i).transition().style("stroke", function (d) {
            return d.properties.category == null ? "#909090" : complementedColor(color(d, d.properties.category));
          }).style("stroke-opacity", "0.75").style("stroke-width", "3");
        };
        var clearSubunit = function (d, i) {
          g.select(".nv-map").selectAll("path.subunit-id-" + i).transition().style("stroke", "#909090").style("stroke-opacity", "1").style("stroke-width", "1");
        };

        labels.enter().append("text").text(function (d) {
          return d.properties.name;
        }).attr("text-anchor", "middle").attr("class", "nv-map-label").attr("dy", "-.5em").style("text-anchor", "middle").style("font-weight", "bold").style("opacity", 0).style("fill", "#000").style("stroke", "#ffffff").style("stroke-opacity", 0.25).style("stroke-width", 3).on("mouseover", function (d, i) {
          highlightSubunit(d, i);

          dispatch.mapMouseover({
            point: d,
            series: d.key,
            //pos: [d3.event.pageX-d3.event.offsetX, d3.event.pageY-d3.event.offsetY]
            pos: [d3.event.pageX, d3.event.pageY] //,
          });
        }).on("mouseout", function (d, i) {
          clearSubunit(d, i);
          dispatch.mapMouseout({
            point: d,
            series: d.key,
            pos: [d3.event.pageX, d3.event.pageY] //,
          });
        });

        values.enter().append("text").text(function (d) {
          return d.properties.value;
        }).attr("text-anchor", "middle").attr("class", "nv-map-value").attr("dy", ".7em").style("text-anchor", "middle").style("stroke-opacity", 0).style("font", "bold Arial").style("fill", function (d) {
          return "#000";
        }).style("stroke", "#ffffff").style("stroke-opacity", 0.15).style("stroke-width", 3).style("opacity", 0).on("mouseover", function (d, i) {
          highlightSubunit(d, i);
          dispatch.mapMouseover({
            point: d,
            series: d.key,
            //pos: [d3.event.pageX-d3.event.offsetX, d3.event.pageY-d3.event.offsetY]
            pos: [d3.event.pageX, d3.event.pageY] //,
          });
        }).on("mouseout", function (d, i) {
          clearSubunit(d, i);
          dispatch.mapMouseout({
            point: d,
            series: d.key,
            pos: [d3.event.pageX, d3.event.pageY] //,
          });
        });




        var beforeZoom = function () {
          geo.transition().style("fill-opacity", 0);
          labels.transition().text("");
          values.transition().text("");
        };

        var zoomed = function () {
          projection.scale(zoom.scale() / 2 / Math.PI).translate(zoom.translate());
          geo.transition().attr("d", path);
        };

        var afterZoom = function () {
         projection.scale(zoom.scale() / 2 / Math.PI).translate(zoom.translate());

          geo
            .transition()
            .attr("d", path)
            .style("fill-opacity", "0.5")
            .style("stroke-width", 1)
            .style("fill", function (d) {
              if (d.properties.category == null || d.properties.category == undefined) return "#f0f0f0";
              if (isNaN(d.properties.category)) return color(d, 0)
              return color(d, d.properties.category);
            });

          labels.transition().attr("transform", function (d) {
            var position = path.centroid(d);
            return "translate(" + position[0] + "," + position[1] + ")";
          }).text(function (d, i) {
            var fontSize = getFontSize(labels[0][i], d);
            //fontSize = (fontSize > 10) ? fontSize : 10;
            var w = approximateLength(d.properties.name, fontSize);
            var bounds = path.bounds(d);
            if (w * 1.2 > bounds[1][0] - bounds[0][0]) {
              return d.id;
            } else {
              return d.properties.name;
            }
          }).style("font-size", function (d, i) {
            var fontSize = getFontSize(labels[0][i], d);
            //fontSize = (fontSize > 8) ? fontSize : 8;
            //var w = approximateLength(d.properties.name, fontSize);
            //var bounds = path.bounds(d);
            //if(w * 1.5 > bounds[1][0] - bounds[0][0]) {
            //  return 2*fontSize+"px"
            //}
            return fontSize + "px";
          }).style("opacity", function (d, i) {
            var bounds = path.bounds(d);
            var opct = labels[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
            opct = getFontSize(labels[0][i], d) < 10 ? 0 : opct;
            return opct;
          });


          values.transition().text(function (d) {
            return d.properties.value;
          }).style("font-size", function (d, i) {
            return getFontSize(labels[0][i], d) + "px";
          }).attr("transform", function (d) {
            var position = path.centroid(d);
            return "translate(" + position[0] + "," + position[1] + ")";
          }).style("opacity", function (d, i) {
            var bounds = path.bounds(d);
            var opct = labels[0][i].clientWidth * 2 > bounds[1][0] - bounds[0][0] ? 0 : 1;
            opct = getFontSize(labels[0][i], d) < 12 ? 0 : opct;
            return opct;
          });
        };

        zoom
          .on("zoomstart", beforeZoom).on("zoom", zoomed).on("zoomend", afterZoom);
        
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

    //console.log(topojson);
    return chart;
  };

  // Mapbox Maps https://www.mapbox.com/developers/api/maps/#mapids
  //Mapbox api access token
  // pk.eyJ1IjoiYm9sZGFrIiwiYSI6InZrSEF6RXMifQ.c8WIV6zoinhXwXXY2cFurg
  //
  //Tiles using
  //          <!DOCTYPE html>
  //          <meta charset="utf-8">
  //          <style>
  //
  //          body {
  //            margin: 0;
  //          }
  //
  //          path {
  //            fill: none;
  //            stroke: red;
  //            stroke-linejoin: round;
  //            stroke-width: 1.5px;
  //          }
  //
  //          </style>
  //          <body>
  //          <script src="http://d3js.org/d3.v3.min.js"></script>
  //          <script src="http://d3js.org/d3.geo.tile.v0.min.js"></script>
  //          <script src="http://d3js.org/topojson.v1.min.js"></script>
  //          <script>
  //
  //          var width = Math.max(960, window.innerWidth),
  //            height = Math.max(500, window.innerHeight);
  //
  //          var tile = d3.geo.tile()
  //            .size([width, height]);
  //
  //          var projection = d3.geo.mercator()
  //            .scale((1 << 12) / 2 / Math.PI)
  //            .translate([width / 2, height / 2]);
  //
  //          var center = projection([-100, 40]);
  //
  //          var path = d3.geo.path()
  //            .projection(projection);
  //
  //          var zoom = d3.behavior.zoom()
  //            .scale(projection.scale() * 2 * Math.PI)
  //            .scaleExtent([1 << 11, 1 << 14])
  //            .translate([width - center[0], height - center[1]])
  //            .on("zoom", zoomed);
  //
  //          var svg = d3.select("body").append("svg")
  //            .attr("width", width)
  //            .attr("height", height);
  //
  //          var raster = svg.append("g");
  //
  //          var vector = svg.append("path");
  //
  //          d3.json("/d/4090846/us.json", function(error, us) {
  //            svg.call(zoom);
  //            vector.datum(topojson.mesh(us, us.objects.states));
  //            zoomed();
  //          });
  //
  //          function zoomed() {
  //            var tiles = tile
  //              .scale(zoom.scale())
  //              .translate(zoom.translate())
  //            ();
  //
  //            projection
  //              .scale(zoom.scale() / 2 / Math.PI)
  //              .translate(zoom.translate());
  //
  //            vector
  //              .attr("d", path);
  //
  //            var image = raster
  //              .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
  //              .selectAll("image")
  //              .data(tiles, function(d) { return d; });
  //
  //            image.exit()
  //              .remove();
  //
  //            image.enter().append("image")
  //              .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/examples.map-i86nkdio/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
  //              .attr("width", 1)
  //              .attr("height", 1)
  //              .attr("x", function(d) { return d[0]; })
  //              .attr("y", function(d) { return d[1]; });
  //          }
  //
  //          </script>


  nv.models.mapChart = function () {
    "use strict";
    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------
    //console.log('mapChart ', topojson);
    var map = nv.models.map(),
        legend = nv.models.legend(),
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
        // console.log("MAP CHART", data);


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

        if (showLegend) {
          legend.width(availableWidth).key(function (d) {
            return d.key;
          })
          //.min(2)
          .color(function (d) {
            return "#238443";
          });

          wrap.select(".nv-legendWrap").datum(data).call(legend);

          if (margin.top != legend.height()) {
            margin.top = legend.height();
            availableHeight = (height || parseInt(container.style("height")) || 400) - margin.top - margin.bottom;
          }

          wrap.select(".nv-legendWrap").attr("transform", "translate(0," + -margin.top + ")");
        }

        //------------------------------------------------------------
        //------------------------------------------------------------
        // Color Scheme

        //if (showLegend) {
        colorScheme.width(availableWidth)
        //.key(function (d) {
        //  return d.key;
        //})
        //.min(2)
        .color(color);

        wrap.select(".nv-colorsWrap").datum(data).call(colorScheme);

        //if (margin.top != legend.height()) {
        //  margin.top = legend.height();
        //  availableHeight = (height || parseInt(container.style('height')) || 400)
        //  - margin.top - margin.bottom;
        //}
        var h = height || parseInt(container.style("height")) || 400;
        // console.log("Chart height", h);
        wrap.select(".nv-colorsWrap").attr("transform", "translate(" + 0 + "," + (h - 75) + ")");
        //}

        //------------------------------------------------------------

        wrap.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //------------------------------------------------------------
        // Main Chart Component(s)

        map.width(availableWidth - margin.left)
        //.height(availableHeight-legend.height() - margin.bottom - margin.top);
        .height(availableHeight);

        //console.log(margin,legend.height(),map.height());

        //mapWrap
        wrap.select(".nv-mapWrap")
        //.attr('transform', 'translate(0,' + (legend.height()+margin.top) + ')')
        .datum([data]).call(map);



        //d3.transition(mapWrap).call(map);

        //------------------------------------------------------------


        //============================================================
        // Event Handling/Dispatching (in chart's scope)
        //------------------------------------------------------------

        legend.dispatch.on("stateChange", function (newState) {
          state = newState;
          dispatch.stateChange(state);
          chart.update();
        });

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
  }


  //console.log("FINISH", nv)
  ;
})();
