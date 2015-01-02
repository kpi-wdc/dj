(function() {
    //console.log("LOAD nv.d3.ext")


//
// SCATTER Model
//
    nv.models.scatter = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var margin       = {top: 0, right: 0, bottom: 0, left: 0}
            , width        = 960
            , height       = 500
            , color        = nv.utils.defaultColor() // chooses color
            , id           = Math.floor(Math.random() * 100000) //Create semi-unique ID incase user doesn't select one
            , x            = d3.scale.linear()
            , y            = d3.scale.linear()
            , z            = d3.scale.linear() //linear because d3.svg.shape.size is treated as area
            , getX         = function(d) { return d.x } // accessor to get the x value
            , getY         = function(d) { return d.y } // accessor to get the y value
            , getLabel     = undefined //function(d) {return (d.label) ? d.label : ''}
            , getSize      = function(d) { return d.size || 1} // accessor to get the point size
            , getShape     = function(d) { return d.shape || 'circle' } // accessor to get point shape
            , onlyCircles  = true // Set to false to use shapes
            , forceX       = [] // List of numbers to Force into the X scale (ie. 0, or a max / min, etc.)
            , forceY       = [] // List of numbers to Force into the Y scale
            , forceSize    = [] // List of numbers to Force into the Size scale
            , interactive  = true // If true, plots a voronoi overlay for advanced point intersection
            , pointKey     = null
            , pointActive  = function(d) { return !d.notActive } // any points that return false will be filtered out
            , padData      = false // If true, adds half a data points width to front and back, for lining up a line chart with a bar chart
            , padDataOuter = .1 //outerPadding to imitate ordinal scale outer padding
            , clipEdge     = false // if true, masks points within x and y scale
            , clipVoronoi  = true // if true, masks each point with a circle... can turn off to slightly increase performance
            , clipRadius   = function() { return 25 } // function to get the radius for voronoi point clips
            , xDomain      = null // Override x domain (skips the calculation from data)
            , yDomain      = null // Override y domain
            , xRange       = null // Override x range
            , yRange       = null // Override y range
            , sizeDomain   = null // Override point size domain
            , sizeRange    = null
            , singlePoint  = false
            , dispatch     = d3.dispatch('elementClick', 'elementMouseover', 'elementMouseout')
            , useVoronoi   = true
            ;

        //============================================================


        //============================================================
        // Private Variables
        //------------------------------------------------------------

        var x0, y0, z0 // used to store previous scales
            , timeoutID
            , needsUpdate = false // Flag for when the points are visually updating, but the interactive layer is behind, to disable tooltips
            ;

        //============================================================


        function chart(selection) {
            console.log(selection)
            selection.each(function(data) {
                var availableWidth = width - margin.left - margin.right,
                    availableHeight = height - margin.top - margin.bottom,
                    container = d3.select(this);

                //add series index to each data point for reference
                data.forEach(function(series, i) {
                    series.values.forEach(function(point) {
                        point.series = i;
                    });
                });

                //------------------------------------------------------------
                // Setup Scales

                // remap and flatten the data for use in calculating the scales' domains
                var seriesData = (xDomain && yDomain && sizeDomain) ? [] : // if we know xDomain and yDomain and sizeDomain, no need to calculate.... if Size is constant remember to set sizeDomain to speed up performance
                    d3.merge(
                        data.map(function(d) {
                            return d.values.map(function(d,i) {
                                return { x: getX(d,i), y: getY(d,i), size: getSize(d,i) }
                            })
                        })
                    );

                x   .domain(xDomain || d3.extent(seriesData.map(function(d) { return d.x; }).concat(forceX)))

                if (padData && data[0])
                    x.range(xRange || [(availableWidth * padDataOuter +  availableWidth) / (2 *data[0].values.length), availableWidth - availableWidth * (1 + padDataOuter) / (2 * data[0].values.length)  ]);
                //x.range([availableWidth * .5 / data[0].values.length, availableWidth * (data[0].values.length - .5)  / data[0].values.length ]);
                else
                    x.range(xRange || [0, availableWidth]);

                y   .domain(yDomain || d3.extent(seriesData.map(function(d) { return d.y }).concat(forceY)))
                    .range(yRange || [availableHeight, 0]);

                z   .domain(sizeDomain || d3.extent(seriesData.map(function(d) { return d.size }).concat(forceSize)))
                    .range(sizeRange || [16, 256]);

                // If scale's domain don't have a range, slightly adjust to make one... so a chart can show a single data point
                if (x.domain()[0] === x.domain()[1] || y.domain()[0] === y.domain()[1]) singlePoint = true;
                if (x.domain()[0] === x.domain()[1])
                    x.domain()[0] ?
                        x.domain([x.domain()[0] - x.domain()[0] * 0.01, x.domain()[1] + x.domain()[1] * 0.01])
                        : x.domain([-1,1]);

                if (y.domain()[0] === y.domain()[1])
                    y.domain()[0] ?
                        y.domain([y.domain()[0] - y.domain()[0] * 0.01, y.domain()[1] + y.domain()[1] * 0.01])
                        : y.domain([-1,1]);

                if ( isNaN(x.domain()[0])) {
                    x.domain([-1,1]);
                }

                if ( isNaN(y.domain()[0])) {
                    y.domain([-1,1]);
                }


                x0 = x0 || x;
                y0 = y0 || y;
                z0 = z0 || z;

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-scatter').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-scatter nv-chart-' + id + (singlePoint ? ' nv-single-point' : ''));
                var defsEnter = wrapEnter.append('defs');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g');

                gEnter.append('g').attr('class', 'nv-groups');
                gEnter.append('g').attr('class', 'nv-point-paths');

                wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //------------------------------------------------------------


                defsEnter.append('clipPath')
                    .attr('id', 'nv-edge-clip-' + id)
                    .append('rect');

                wrap.select('#nv-edge-clip-' + id + ' rect')
                    .attr('width', availableWidth)
                    .attr('height', (availableHeight > 0) ? availableHeight : 0);

                g   .attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + id + ')' : '');


                function updateInteractiveLayer() {

                    if (!interactive) return false;

                    var eventElements;

                    var vertices = d3.merge(data.map(function(group, groupIndex) {
                            return group.values
                                .map(function(point, pointIndex) {
                                    // *Adding noise to make duplicates very unlikely
                                    // *Injecting series and point index for reference
                                    /* *Adding a 'jitter' to the points, because there's an issue in d3.geom.voronoi.
                                     */
                                    var pX = getX(point,pointIndex);
                                    var pY = getY(point,pointIndex);

                                    return [x(pX)+ Math.random() * 1e-7,
                                        y(pY)+ Math.random() * 1e-7,
                                        groupIndex,
                                        pointIndex, point]; //temp hack to add noise untill I think of a better way so there are no duplicates
                                })
                                .filter(function(pointArray, pointIndex) {
                                    return pointActive(pointArray[4], pointIndex); // Issue #237.. move filter to after map, so pointIndex is correct!
                                })
                        })
                    );



                    //inject series and point index for reference into voronoi
                    if (useVoronoi === true) {

                        if (clipVoronoi) {
                            var pointClipsEnter = wrap.select('defs').selectAll('.nv-point-clips')
                                .data([id])
                                .enter();

                            pointClipsEnter.append('clipPath')
                                .attr('class', 'nv-point-clips')
                                .attr('id', 'nv-points-clip-' + id);

                            var pointClips = wrap.select('#nv-points-clip-' + id).selectAll('circle')
                                .data(vertices);

                            pointClips.enter().append('circle')
                                .attr('r', clipRadius);

                            pointClips.exit().remove();
                            pointClips
                                .attr('cx', function(d) { return d[0] })
                                .attr('cy', function(d) { return d[1] });




                            wrap.select('.nv-point-paths')
                                .attr('clip-path', 'url(#nv-points-clip-' + id + ')');
                        }


                        if(vertices.length) {
                            // Issue #283 - Adding 2 dummy points to the voronoi b/c voronoi requires min 3 points to work
                            vertices.push([x.range()[0] - 20, y.range()[0] - 20, null, null]);
                            vertices.push([x.range()[1] + 20, y.range()[1] + 20, null, null]);
                            vertices.push([x.range()[0] - 20, y.range()[0] + 20, null, null]);
                            vertices.push([x.range()[1] + 20, y.range()[1] - 20, null, null]);
                        }

                        var bounds = d3.geom.polygon([
                            [-10,-10],
                            [-10,height + 10],
                            [width + 10,height + 10],
                            [width + 10,-10]
                        ]);

                        var voronoi = d3.geom.voronoi(vertices).map(function(d, i) {
                            return {
                                'data': bounds.clip(d),
                                'series': vertices[i][2],
                                'point': vertices[i][3]
                            }
                        });


                        var pointPaths = wrap.select('.nv-point-paths').selectAll('path')
                            .data(voronoi);
                        pointPaths.enter().append('path')
                            .attr('class', function(d,i) { return 'nv-path-'+i; });
                        pointPaths.exit().remove();
                        pointPaths
                            .attr('d', function(d) {
                                if (d.data.length === 0)
                                    return 'M 0 0'
                                else
                                    return 'M' + d.data.join('L') + 'Z';
                            });

                        var mouseEventCallback = function(d,mDispatch) {
                            if (needsUpdate) return 0;
                            var series = data[d.series];
                            if (typeof series === 'undefined') return;

                            var point  = series.values[d.point];

                            mDispatch({
                                point: point,
                                series: series,
                                pos: [x(getX(point, d.point)) + margin.left, y(getY(point, d.point)) + margin.top],
                                seriesIndex: d.series,
                                pointIndex: d.point
                            });
                        };

                        pointPaths
                            .on('click', function(d) {
                                mouseEventCallback(d, dispatch.elementClick);
                            })
                            .on('mouseover', function(d) {
                                mouseEventCallback(d, dispatch.elementMouseover);
                            })
                            .on('mouseout', function(d, i) {
                                mouseEventCallback(d, dispatch.elementMouseout);
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
                        wrap.select('.nv-groups').selectAll('.nv-group')
                            .selectAll('.nv-point')
                            //.data(dataWithPoints)
                            //.style('pointer-events', 'auto') // recativate events, disabled by css
                            .on('click', function(d,i) {
                                //nv.log('test', d, i);
                                if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
                                var series = data[d.series],
                                    point  = series.values[i];

                                dispatch.elementClick({
                                    point: point,
                                    series: series,
                                    pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                                    seriesIndex: d.series,
                                    pointIndex: i
                                });
                            })
                            .on('mouseover', function(d,i) {
                                if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
                                var series = data[d.series],
                                    point  = series.values[i];

                                dispatch.elementMouseover({
                                    point: point,
                                    series: series,
                                    pos: [x(getX(point, i)) + margin.left, y(getY(point, i)) + margin.top],
                                    seriesIndex: d.series,
                                    pointIndex: i
                                });
                            })
                            .on('mouseout', function(d,i) {
                                if (needsUpdate || !data[d.series]) return 0; //check if this is a dummy point
                                var series = data[d.series],
                                    point  = series.values[i];

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

                var groups = wrap.select('.nv-groups').selectAll('.nv-group')
                    .data(function(d) { return d }, function(d) { return d.key });
                groups.enter().append('g')
                    .style('stroke-opacity', 1e-6)
                    .style('fill-opacity', 1e-6);
                groups.exit()
                    .remove();
                groups
                    .attr('class', function(d,i) { return 'nv-group nv-series-' + i })
                    .classed('hover', function(d) { return d.hover });
                groups
                    .transition()
                    .style('fill', function(d,i) { return color(d, i) })
                    .style('stroke', function(d,i) { return color(d, i) })
                    .style('stroke-opacity', 1)
                    .style('fill-opacity', .5);

                if (onlyCircles) {

                    var points = groups.selectAll('circle.nv-point')
                        .data(function(d) { return d.values }, pointKey);
                    var labels = groups.selectAll('text.nv-label')
                        .data(function(d) { return d.values }, pointKey);

                    points.enter().append('circle')
                        .style('fill', function (d,i) { return d.color })
                        .style('stroke', function (d,i) { return d.color })
                        .attr('cx', function(d,i) { return nv.utils.NaNtoZero(x0(getX(d,i))) })
                        .attr('cy', function(d,i) { return nv.utils.NaNtoZero(y0(getY(d,i))) })
                        .attr('r', function(d,i) { return Math.sqrt(z(getSize(d,i))/Math.PI) });
                    points.exit().remove();
                    labels.enter().append('text')
                        .style('fill',function (d,i) { return d.color })
                        .style('text-anchor','start')
                        .attr('x', function(d,i) { return nv.utils.NaNtoZero(x0(getX(d,i))) })
                        .attr('y', function(d,i) { return nv.utils.NaNtoZero(y0(getY(d,i))) })
                        .attr('dy', '-0.7em')
                        .classed('nv-label',true)
                        .text(function(d,i) {return (getLabel)? getLabel(d,i) : ''});;
                    labels.exit().remove();

                    groups.exit().selectAll('path.nv-point').transition()
                        .attr('cx', function(d,i) { return nv.utils.NaNtoZero(x(getX(d,i))) })
                        .attr('cy', function(d,i) { return nv.utils.NaNtoZero(y(getY(d,i))) })
                        .remove();
                    points.each(function(d,i) {
                        d3.select(this)
                            .classed('nv-point', true)
                            .classed('nv-point-' + i, true)
                            .classed('hover',false)
                        ;
                    });
                    labels.each(function(d,i) {
                        d3.select(this)
                            .classed('nv-label', true)
                        ;
                    });
                    points.transition()
                        .attr('cx', function(d,i) { return nv.utils.NaNtoZero(x(getX(d,i))) })
                        .attr('cy', function(d,i) { return nv.utils.NaNtoZero(y(getY(d,i))) })
                        .attr('r', function(d,i) { return Math.sqrt(z(getSize(d,i))/Math.PI) });
                    labels.transition()
                        .attr('x', function(d,i) { return nv.utils.NaNtoZero(x(getX(d,i))) })
                        .attr('y', function(d,i) { return nv.utils.NaNtoZero(y(getY(d,i))) });

                } else {

                    var points = groups.selectAll('path.nv-point')
                        .data(function(d) { return d.values });
                    points.enter().append('path')
                        .style('fill', function (d,i) { return d.color })
                        .style('stroke', function (d,i) { return d.color })
                        .attr('transform', function(d,i) {
                            return 'translate(' + x0(getX(d,i)) + ',' + y0(getY(d,i)) + ')'
                        })
                        .attr('d',
                        d3.svg.symbol()
                            .type(getShape)
                            .size(function(d,i) { return z(getSize(d,i)) })
                    );
                    points.exit().remove();
                    groups.exit().selectAll('path.nv-point')
                        .transition()
                        .attr('transform', function(d,i) {
                            return 'translate(' + x(getX(d,i)) + ',' + y(getY(d,i)) + ')'
                        })
                        .remove();
                    points.each(function(d,i) {
                        d3.select(this)
                            .classed('nv-point', true)
                            .classed('nv-point-' + i, true)
                            .classed('hover',false)
                        ;
                    });
                    points.transition()
                        .attr('transform', function(d,i) {
                            //nv.log(d,i,getX(d,i), x(getX(d,i)));
                            return 'translate(' + x(getX(d,i)) + ',' + y(getY(d,i)) + ')'
                        })
                        .attr('d',
                        d3.svg.symbol()
                            .type(getShape)
                            .size(function(d,i) { return z(getSize(d,i)) })
                    );
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
        chart.clearHighlights = function() {
            //Remove the 'hover' class from all highlighted points.
            d3.selectAll(".nv-chart-" + id + " .nv-point.hover").classed("hover",false);
        };

        chart.highlightPoint = function(seriesIndex,pointIndex,isHoverOver) {
            d3.select(".nv-chart-" + id + " .nv-series-" + seriesIndex + " .nv-point-" + pointIndex)
                .classed("hover",isHoverOver);
        };


        dispatch.on('elementMouseover.point', function(d) {
            if (interactive) chart.highlightPoint(d.seriesIndex,d.pointIndex,true);
        });

        dispatch.on('elementMouseout.point', function(d) {
            if (interactive) chart.highlightPoint(d.seriesIndex,d.pointIndex,false);
        });

        //============================================================


        //============================================================
        // Expose Public Variables
        //------------------------------------------------------------

        chart.dispatch = dispatch;
        chart.options = nv.utils.optionsFunc.bind(chart);

        chart.x = function(_) {
            if (!arguments.length) return getX;
            getX = d3.functor(_);
            return chart;
        };

        chart.label = function(_) {
            if (!arguments.length) return getLabel;
            getLabel = d3.functor(_);
            return chart;
        };

        chart.y = function(_) {
            if (!arguments.length) return getY;
            getY = d3.functor(_);
            return chart;
        };

        chart.size = function(_) {
            if (!arguments.length) return getSize;
            getSize = d3.functor(_);
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

        chart.zScale = function(_) {
            if (!arguments.length) return z;
            z = _;
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

        chart.sizeDomain = function(_) {
            if (!arguments.length) return sizeDomain;
            sizeDomain = _;
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

        chart.sizeRange = function(_) {
            if (!arguments.length) return sizeRange;
            sizeRange = _;
            return chart;
        };

        chart.forceX = function(_) {
            if (!arguments.length) return forceX;
            forceX = _;
            return chart;
        };

        chart.forceY = function(_) {
            if (!arguments.length) return forceY;
            forceY = _;
            return chart;
        };

        chart.forceSize = function(_) {
            if (!arguments.length) return forceSize;
            forceSize = _;
            return chart;
        };

        chart.interactive = function(_) {
            if (!arguments.length) return interactive;
            interactive = _;
            return chart;
        };

        chart.pointKey = function(_) {
            if (!arguments.length) return pointKey;
            pointKey = _;
            return chart;
        };

        chart.pointActive = function(_) {
            if (!arguments.length) return pointActive;
            pointActive = _;
            return chart;
        };

        chart.padData = function(_) {
            if (!arguments.length) return padData;
            padData = _;
            return chart;
        };

        chart.padDataOuter = function(_) {
            if (!arguments.length) return padDataOuter;
            padDataOuter = _;
            return chart;
        };

        chart.clipEdge = function(_) {
            if (!arguments.length) return clipEdge;
            clipEdge = _;
            return chart;
        };

        chart.clipVoronoi= function(_) {
            if (!arguments.length) return clipVoronoi;
            clipVoronoi = _;
            return chart;
        };

        chart.useVoronoi= function(_) {
            if (!arguments.length) return useVoronoi;
            useVoronoi = _;
            if (useVoronoi === false) {
                clipVoronoi = false;
            }
            return chart;
        };

        chart.clipRadius = function(_) {
            if (!arguments.length) return clipRadius;
            clipRadius = _;
            return chart;
        };

        chart.color = function(_) {
            if (!arguments.length) return color;
            color = nv.utils.getColor(_);
            return chart;
        };

        chart.shape = function(_) {
            if (!arguments.length) return getShape;
            getShape = _;
            return chart;
        };

        chart.onlyCircles = function(_) {
            if (!arguments.length) return onlyCircles;
            onlyCircles = _;
            return chart;
        };

        chart.id = function(_) {
            if (!arguments.length) return id;
            id = _;
            return chart;
        };

        chart.singlePoint = function(_) {
            if (!arguments.length) return singlePoint;
            singlePoint = _;
            return chart;
        };

        //============================================================


        return chart;
    }


//
// SCATTER CHART Model
//

    nv.models.scatterChart = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var scatter      = nv.models.scatter()
            , xAxis        = nv.models.axis()
            , yAxis        = nv.models.axis()
            , legend       = nv.models.legend()
            , controls     = nv.models.legend()
            , distX        = nv.models.distribution()
            , distY        = nv.models.distribution()
            ;

        var margin       = {top: 30, right: 20, bottom: 50, left: 75}
            , width        = null
            , height       = null
            , color        = nv.utils.defaultColor()
            , x            = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.xScale()
            , y            = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.yScale()
            , xPadding     = 0
            , yPadding     = 0
            , showDistX    = false
            , showDistY    = false
            , showLegend   = true
            , showXAxis    = true
            , showYAxis    = true
            , rightAlignYAxis = false
            , showControls = !!d3.fisheye
            , fisheye      = 0
            , pauseFisheye = false
            , tooltips     = true
            , tooltipX     = function(key, x, y) { return '<strong>' + x + '</strong>' }
            , tooltipY     = function(key, x, y) { return '<strong>' + y + '</strong>' }
            , tooltip      = null
            , state = {}
            , defaultState = null
            , dispatch     = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
            , noData       = "No Data Available."
            , transitionDuration = 250
            ;

        scatter
            .xScale(x)
            .yScale(y)
        ;
        xAxis
            .orient('bottom')
            .tickPadding(10)
        ;
        yAxis
            .orient((rightAlignYAxis) ? 'right' : 'left')
            .tickPadding(10)
        ;
        distX
            .axis('x')
        ;
        distY
            .axis('y')
        ;

        controls.updateState(false);

        //============================================================


        //============================================================
        // Private Variables
        //------------------------------------------------------------

        var x0, y0;

        var showTooltip = function(e, offsetElement) {
            //TODO: make tooltip style an option between single or dual on axes (maybe on all charts with axes?)

            var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
                top = e.pos[1] + ( offsetElement.offsetTop || 0),
                leftX = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
                topX = y.range()[0] + margin.top + ( offsetElement.offsetTop || 0),
                leftY = x.range()[0] + margin.left + ( offsetElement.offsetLeft || 0 ),
                topY = e.pos[1] + ( offsetElement.offsetTop || 0),
                xVal = xAxis.tickFormat()(scatter.x()(e.point, e.pointIndex)),
                yVal = yAxis.tickFormat()(scatter.y()(e.point, e.pointIndex));

            if( tooltipX != null )
                nv.tooltip.show([leftX, topX], tooltipX(e.series.key, xVal, yVal, e, chart), 'n', 1, offsetElement, 'x-nvtooltip');
            if( tooltipY != null )
                nv.tooltip.show([leftY, topY], tooltipY(e.series.key, xVal, yVal, e, chart), 'e', 1, offsetElement, 'y-nvtooltip');
            if( tooltip != null )
                nv.tooltip.show([left, top], tooltip(e.series.key, xVal, yVal, e, chart), e.value < 0 ? 'n' : 's', null, offsetElement);
        };

        var controlsData = [
            { key: 'Magnify', disabled: true }
        ];

        //============================================================


        function chart(selection) {
            selection.each(function(data) {
                var container = d3.select(this),
                    that = this;

                var availableWidth = (width  || parseInt(container.style('width')) || 960)
                        - margin.left - margin.right,
                    availableHeight = (height || parseInt(container.style('height')) || 400)
                        - margin.top - margin.bottom;

                chart.update = function() { container.transition().duration(transitionDuration).call(chart); };
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

                x0 = x0 || x;
                y0 = y0 || y;

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-scatterChart').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-scatterChart nv-chart-' + scatter.id());
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g');

                // background for pointer events
                gEnter.append('rect').attr('class', 'nvd3 nv-background');

                gEnter.append('g').attr('class', 'nv-x nv-axis');
                gEnter.append('g').attr('class', 'nv-y nv-axis');
                gEnter.append('g').attr('class', 'nv-scatterWrap');
                gEnter.append('g').attr('class', 'nv-distWrap');
                gEnter.append('g').attr('class', 'nv-legendWrap');
                gEnter.append('g').attr('class', 'nv-controlsWrap');

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Legend

                if (showLegend) {
                    var legendWidth = (showControls) ? availableWidth / 2 : availableWidth;
                    legend.width(legendWidth);

                    wrap.select('.nv-legendWrap')
                        .datum(data)
                        .call(legend);

                    if ( margin.top != legend.height()) {
                        margin.top = legend.height();
                        availableHeight = (height || parseInt(container.style('height')) || 400)
                        - margin.top - margin.bottom;
                    }

                    wrap.select('.nv-legendWrap')
                        .attr('transform', 'translate(' + (availableWidth - legendWidth) + ',' + (-margin.top) +')');
                }

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Controls

                if (showControls) {
                    controls.width(180).color(['#444']);
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

                scatter
                    .width(availableWidth)
                    .height(availableHeight)
                    .color(data.map(function(d,i) {
                        return d.color || color(d, i);
                    }).filter(function(d,i) { return !data[i].disabled }));

                if (xPadding !== 0)
                    scatter.xDomain(null);

                if (yPadding !== 0)
                    scatter.yDomain(null);

                wrap.select('.nv-scatterWrap')
                    .datum(data.filter(function(d) { return !d.disabled }))
                    .call(scatter);

                //Adjust for x and y padding
                if (xPadding !== 0) {
                    var xRange = x.domain()[1] - x.domain()[0];
                    scatter.xDomain([x.domain()[0] - (xPadding * xRange), x.domain()[1] + (xPadding * xRange)]);
                }

                if (yPadding !== 0) {
                    var yRange = y.domain()[1] - y.domain()[0];
                    scatter.yDomain([y.domain()[0] - (yPadding * yRange), y.domain()[1] + (yPadding * yRange)]);
                }

                //Only need to update the scatter again if x/yPadding changed the domain.
                if (yPadding !== 0 || xPadding !== 0) {
                    wrap.select('.nv-scatterWrap')
                        .datum(data.filter(function(d) { return !d.disabled }))
                        .call(scatter);
                }

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup Axes
                if (showXAxis) {
                    xAxis
                        .scale(x)
                        .ticks( xAxis.ticks() && xAxis.ticks().length ? xAxis.ticks() : availableWidth / 100 )
                        .tickSize( -availableHeight , 0);

                    g.select('.nv-x.nv-axis')
                        .attr('transform', 'translate(0,' + y.range()[0] + ')')
                        .call(xAxis);

                }

                if (showYAxis) {
                    yAxis
                        .scale(y)
                        .ticks( yAxis.ticks() && yAxis.ticks().length ? yAxis.ticks() : availableHeight / 36 )
                        .tickSize( -availableWidth, 0);

                    g.select('.nv-y.nv-axis')
                        .call(yAxis);
                }


                if (showDistX) {
                    distX
                        .getData(scatter.x())
                        .scale(x)
                        .width(availableWidth)
                        .color(data.map(function(d,i) {
                            return d.color || color(d, i);
                        }).filter(function(d,i) { return !data[i].disabled }));
                    gEnter.select('.nv-distWrap').append('g')
                        .attr('class', 'nv-distributionX');
                    g.select('.nv-distributionX')
                        .attr('transform', 'translate(0,' + y.range()[0] + ')')
                        .datum(data.filter(function(d) { return !d.disabled }))
                        .call(distX);
                }

                if (showDistY) {
                    distY
                        .getData(scatter.y())
                        .scale(y)
                        .width(availableHeight)
                        .color(data.map(function(d,i) {
                            return d.color || color(d, i);
                        }).filter(function(d,i) { return !data[i].disabled }));
                    gEnter.select('.nv-distWrap').append('g')
                        .attr('class', 'nv-distributionY');
                    g.select('.nv-distributionY')
                        .attr('transform',
                        'translate(' + (rightAlignYAxis ? availableWidth : -distY.size() ) + ',0)')
                        .datum(data.filter(function(d) { return !d.disabled }))
                        .call(distY);
                }

                //------------------------------------------------------------




                if (d3.fisheye) {
                    g.select('.nv-background')
                        .attr('width', availableWidth)
                        .attr('height', availableHeight);

                    g.select('.nv-background').on('mousemove', updateFisheye);
                    g.select('.nv-background').on('click', function() { pauseFisheye = !pauseFisheye;});
                    scatter.dispatch.on('elementClick.freezeFisheye', function() {
                        pauseFisheye = !pauseFisheye;
                    });
                }


                function updateFisheye() {
                    if (pauseFisheye) {
                        g.select('.nv-point-paths').style('pointer-events', 'all');
                        return false;
                    }

                    g.select('.nv-point-paths').style('pointer-events', 'none' );

                    var mouse = d3.mouse(this);
                    x.distortion(fisheye).focus(mouse[0]);
                    y.distortion(fisheye).focus(mouse[1]);

                    g.select('.nv-scatterWrap')
                        .call(scatter);

                    if (showXAxis)
                        g.select('.nv-x.nv-axis').call(xAxis);

                    if (showYAxis)
                        g.select('.nv-y.nv-axis').call(yAxis);

                    g.select('.nv-distributionX')
                        .datum(data.filter(function(d) { return !d.disabled }))
                        .call(distX);
                    g.select('.nv-distributionY')
                        .datum(data.filter(function(d) { return !d.disabled }))
                        .call(distY);
                }



                //============================================================
                // Event Handling/Dispatching (in chart's scope)
                //------------------------------------------------------------

                controls.dispatch.on('legendClick', function(d,i) {
                    d.disabled = !d.disabled;

                    fisheye = d.disabled ? 0 : 2.5;
                    g.select('.nv-background') .style('pointer-events', d.disabled ? 'none' : 'all');
                    g.select('.nv-point-paths').style('pointer-events', d.disabled ? 'all' : 'none' );

                    if (d.disabled) {
                        x.distortion(fisheye).focus(0);
                        y.distortion(fisheye).focus(0);

                        g.select('.nv-scatterWrap').call(scatter);
                        g.select('.nv-x.nv-axis').call(xAxis);
                        g.select('.nv-y.nv-axis').call(yAxis);
                    } else {
                        pauseFisheye = false;
                    }

                    chart.update();
                });

                legend.dispatch.on('stateChange', function(newState) {
                    state.disabled = newState.disabled;
                    dispatch.stateChange(state);
                    chart.update();
                });

                scatter.dispatch.on('elementMouseover.tooltip', function(e) {
                    d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-distx-' + e.pointIndex)
                        .attr('y1', function(d,i) { return e.pos[1] - availableHeight;});
                    d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-disty-' + e.pointIndex)
                        .attr('x2', e.pos[0] + distX.size());

                    e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
                    dispatch.tooltipShow(e);
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

        scatter.dispatch.on('elementMouseout.tooltip', function(e) {
            dispatch.tooltipHide(e);

            d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-distx-' + e.pointIndex)
                .attr('y1', 0);
            d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-disty-' + e.pointIndex)
                .attr('x2', distY.size());
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
        chart.scatter = scatter;
        chart.legend = legend;
        chart.controls = controls;
        chart.xAxis = xAxis;
        chart.yAxis = yAxis;
        chart.distX = distX;
        chart.distY = distY;

        d3.rebind(chart, scatter, 'id', 'interactive', 'pointActive', 'x', 'y', 'shape', 'size', 'xScale', 'yScale', 'zScale', 'xDomain', 'yDomain', 'xRange', 'yRange', 'sizeDomain', 'sizeRange', 'forceX', 'forceY', 'forceSize', 'clipVoronoi', 'clipRadius', 'useVoronoi');
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
            distX.color(color);
            distY.color(color);
            return chart;
        };

        chart.showDistX = function(_) {
            if (!arguments.length) return showDistX;
            showDistX = _;
            return chart;
        };

        chart.showDistY = function(_) {
            if (!arguments.length) return showDistY;
            showDistY = _;
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


        chart.fisheye = function(_) {
            if (!arguments.length) return fisheye;
            fisheye = _;
            return chart;
        };

        chart.xPadding = function(_) {
            if (!arguments.length) return xPadding;
            xPadding = _;
            return chart;
        };

        chart.yPadding = function(_) {
            if (!arguments.length) return yPadding;
            yPadding = _;
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

        chart.tooltipXContent = function(_) {
            if (!arguments.length) return tooltipX;
            tooltipX = _;
            return chart;
        };

        chart.tooltipYContent = function(_) {
            if (!arguments.length) return tooltipY;
            tooltipY = _;
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


//
// RADAR Model
//
    nv.models.radar = function () {

        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var margin = {top: 0, right: 0, bottom: 0, left: 0}
            , width = 500
            , height = 500
            , color = nv.utils.defaultColor() // a function that returns a color
            , getValue = function (d) {
                return d.value
            } // accessor to get the x value from a data point
            , size = 5
            , scales = d3.scale.linear()
            , radius
            , max = 5
            , startAngle = 0
            , cursor = 0
            , clipEdge = false
            ;

        var line = d3.svg.line()
            .x(function (d) {
                return d.x
            })
            .y(function (d) {
                return d.y
            });

        var scatter = nv.models.scatter()
                .size(16) // default size
                .sizeDomain([16, 256])
                .useVoronoi(false)
            ;

        //============================================================


        //============================================================
        // Private Variables
        //------------------------------------------------------------


        //============================================================


        function chart(selection) {
            selection.each(function (data) {


                for (var i in data) {
                    data[i].values.push(data[i].values[0]);
                }

                var availableWidth = width - margin.left - margin.right,
                    availableHeight = height - margin.top - margin.bottom,
                    container = d3.select(this)
                    ;

                // max = max || d3.max(data, getValue) > 0 ? d3.max(data, getValue) : 1

                scales.domain([0, max]).range([0, radius]);

                var current = 0;
                if (cursor < 0) {
                    current = Math.abs(cursor);
                }
                else if (cursor > 0) {
                    current = size - cursor;
                }


                //------------------------------------------------------------
                // Setup Scales

                data = data.map(function (serie, i) {
                    serie.values = serie.values.map(function (value, j) {
                        value.x = calculateX(value.value, j, size);
                        value.y = calculateY(value.value, j, size);
                        value.serie = i;
                        value.focus = (current == j) ? true : false;
                        return value;
                    });
                    return serie;
                });

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-radar').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-radar');
                var defsEnter = wrapEnter.append('defs');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g')

                gEnter.append('g').attr('class', 'nv-groups');
                gEnter.append('g').attr('class', 'nv-scatterWrap');


                // wrap.attr('transform', 'translate(' + radius + ',' + radius + ')');

                //------------------------------------------------------------

                // Points
                scatter
                    .xScale(scales)
                    .yScale(scales)
                    .zScale(scales)
                    .color(color)
                    .width(availableWidth)
                    .height(availableHeight);

                var scatterWrap = wrap.select('.nv-scatterWrap');
                //.datum(data); // Data automatically trickles down from the wrap

                //scatter.update();
                //d3.transition(scatterWrap).call(scatter);

                defsEnter.append('clipPath')
                    .attr('id', 'nv-edge-clip-' + scatter.id())
                    .append('rect');

                wrap.select('#nv-edge-clip-' + scatter.id() + ' rect')
                    .attr('width', availableWidth)
                    .attr('height', availableHeight);

                g.attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + scatter.id() + ')' : '');
                scatterWrap
                    .attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + scatter.id() + ')' : '');


                // Series
                var groups = wrap.select('.nv-groups').selectAll('.nv-group').data(function (d) {
                    return d
                }, function (d) {
                    return d.key
                });
                groups.enter().append('g')
                    .style('stroke-opacity', 1e-6)
                    .style('fill-opacity', 1e-6);
                d3.transition(groups.exit())
                    .style('stroke-opacity', 1e-6)
                    .style('fill-opacity', 1e-6)
                    .remove();
                groups
                    .attr('class', function (d, i) {
                        return 'nv-group nv-series-' + i
                    })
                    .style('fill', function (d, i) {
                        return color(d, i);
                    })
                    .style('stroke', function (d, i) {
                        return color(d, i);
                    });
                d3.transition(groups)
                    .style('stroke-opacity', 1)
                    .style('fill-opacity', .5);

                var lineRadar = groups.selectAll('path.nv-line').data(function (d) {
                    return [d.values]
                });

                lineRadar.enter().append('path')
                    //.attr('class', 'nv-line')
                    .attr('d', line)
                    .style('stroke-width', '1.5px');


                d3.transition(lineRadar.exit())
                    .attr('d', line)
                    .remove();

                lineRadar
                    .style('fill', function (d) {
                        return color(d, d[0].serie);
                    })
                    .style('stroke', function (d, i, j) {
                        return color(d, d[0].serie);
                    })
                    .on('mouseover', function (d, i, j) {
                        wrap.select('.nv-groups').selectAll('.nv-group')
                            .transition(200)
                            .style("fill-opacity", .1);

                        g = wrap.select('.nv-groups').select('.nv-series-' + j);
                        g.transition(200)
                            .style("fill-opacity", 0.7);

                    })
                    .on('mouseout', function () {
                        wrap.select('.nv-groups').selectAll('.nv-group')
                            .transition(200)
                            .style("fill-opacity", 0.5);

                    });


                d3.transition(lineRadar)
                    .attr('d', line);

                for (var i in data) {
                    data[i].values.pop()
                }


            });

            return chart;
        }

        // compute an angle
        function angle(i, length) {
            return i * (2 * Math.PI / length ) + ((2 * Math.PI) * startAngle / 360) + (cursor * 2 * Math.PI) / length;
        }

        // x-caclulator
        // d is the datapoint, i is the index, length is the length of the data
        function calculateX(d, i, length) {
            var l = scales(d);
            return Math.sin(angle(i, length)) * l;
        }

        // y-calculator
        function calculateY(d, i, length) {
            var l = scales(d);
            return Math.cos(angle(i, length)) * l;
        }


        //============================================================
        // Expose Public Variables
        //------------------------------------------------------------

        chart.dispatch = scatter.dispatch;
        chart.scatter = scatter;

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin.top = typeof _.top != 'undefined' ? _.top : margin.top;
            margin.right = typeof _.right != 'undefined' ? _.right : margin.right;
            margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
            margin.left = typeof _.left != 'undefined' ? _.left : margin.left;
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

        chart.size = function (_) {
            if (!arguments.length) return size;
            size = _;
            return chart;
        };

        chart.scales = function (_) {
            if (!arguments.length) return scales;
            scales = _;
            return chart;
        };

        chart.max = function (_) {
            if (!arguments.length) return max;
            max = _;
            return chart;
        };

        chart.radius = function (_) {
            if (!arguments.length) return radius;
            radius = _;
            return chart;
        };

        chart.color = function (_) {
            if (!arguments.length) return color;
            color = nv.utils.getColor(_);
            return chart;
        };

        chart.startAngle = function (_) {
            if (!arguments.length) return startAngle;
            startAngle = _;
            return chart;
        };

        chart.cursor = function (_) {
            if (!arguments.length) return cursor;
            cursor = _;
            return chart;
        };

        //============================================================


        return chart;
    }



//
// RADAR CHART Model
//


    nv.models.radarChart = function () {

        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var radars = nv.models.radar()
            , legend = nv.models.legend();

        var margin = {top: 0, right: 0, bottom: 0, left: 0}
            , color = nv.utils.defaultColor()
            , width = null
            , height = null
            , showLegend = true
            , legs = []
            , ticks = 5
            , scales = d3.scale.linear()
            , edit = false
            , radius
            , startAngle = 180
            , cursor = 0
            , tooltips = true
            , tooltip = function (key, leg, value, e, graph) {
                return '<h3>' + key + '</h3>' +
                    '<p>' + leg + ': ' + value + '</p>'
            }
            , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'prevClick')
            ;

        var line = d3.svg.line()
            .x(function (d) {
                return d.x
            })
            .y(function (d) {
                return d.y
            });

        //============================================================


        //============================================================
        // Private Variables
        //------------------------------------------------------------

        var showTooltip = function (e, offsetElement) {
            console.log("TOOLTIP", e)
            // New addition to calculate position if SVG is scaled with viewBox, may move TODO: consider implementing everywhere else
            if (offsetElement) {
                var svg = d3.select(offsetElement).select('svg');
                var viewBox = svg.attr('viewBox');
                if (viewBox) {
                    viewBox = viewBox.split(' ');
                    var ratio = parseInt(svg.style('width')) / viewBox[2];
                    e.pos[0] = e.pos[0] * ratio;
                    e.pos[1] = e.pos[1] * ratio;
                }
            }

            var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
                top = e.pos[1] + ( offsetElement.offsetTop || 0),
                val = e.series.values[e.pointIndex].value,
                leg = legs[e.pointIndex].label,
                content = tooltip(e.series.key, leg, val, e, chart);
            nv.tooltip.show([left, top], content, null, null, offsetElement);
        };

        //============================================================


        function chart(selection) {
            selection.each(function (data) {

                legs = [];
                for (var i in data[0].values) {
                    legs.push({label: data[0].values[i].label, color: "#000000"});
                }
                //console.log(legs)


                var container = d3.select(this),
                    that = this,
                    size = legs.length,
                    availableWidth = (width || parseInt(container.style('width')) || 500) - margin.left - margin.right,
                    availableHeight = (height || parseInt(container.style('height')) || 500) - margin.top - margin.bottom;

                chart.update = function () {
                    chart(selection)
                };
                chart.container = this;

                var current = 0;
                if (cursor < 0) {
                    current = Math.abs(cursor);
                }
                else if (cursor > 0) {
                    current = legs.length - cursor;
                }

                //------------------------------------------------------------
                // Setup Scales

                // scales = radars.scales();
                radius = (availableWidth - 300 >= availableHeight) ? (availableHeight) / 2 : (availableWidth - 300) / 2;
                scales.domain([0, ticks]).range([0, radius]);

                //------------------------------------------------------------

                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-radarChart').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-radarChart');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g');

                gEnter.append('g').attr('class', 'nv-controlWrap');
                gEnter.append('g').attr('class', 'nv-gridWrap');
                gEnter.append('g').attr('class', 'nv-radarsWrap');
                gEnter.append('g').attr('class', 'nv-legendWrap');

                var gridWrap = wrap.select('g.nv-gridWrap');
                gridWrap.append("g").attr("class", "grid");
                gridWrap.append("g").attr("class", "axes");

                wrap.attr('transform', 'translate(' + parseFloat(radius + margin.left) + ',' + parseFloat(radius + margin.top) + ')');

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Legend

                if (showLegend) {
                    legend.width(30);

                    g.select('.nv-legendWrap')
                        .datum(data)
                        .call(legend);

                    /*
                     if ( margin.top != legend.height()) {
                     margin.top = legend.height();
                     availableHeight = (height || parseInt(container.style('height')) || 400)
                     - margin.top - margin.bottom;
                     }
                     */
                    g.select('.nv-legendWrap')
                        .attr('transform', 'translate(' + (radius + margin.left + margin.right) + ',' + (-radius) + ')');
                }

                //------------------------------------------------------------

                if (edit) {
                    startAngle = 135
                    //Focus
                    var currentLeg = legs[current];
                    var rgbLeg = hexToRgb(currentLeg.color);
                    var controlWrap = wrap.select('g.nv-controlWrap');

                    wrap.select('g.control').remove();
                    var controlEnter = controlWrap.append("g")
                        .attr("class", "control");

                    var controlLine = controlEnter.append("svg:line")
                        .attr('class', 'indicator')
                        .style("stroke", currentLeg.color)
                        .style("fill", "none")
                        .style("opacity", 0.2)
                        .style("stroke-width", 1)
                        .attr("x1", Math.sin(angle(current, size)) * scales(scales.domain()[1]))
                        .attr("y1", Math.cos(angle(current, size)) * scales(scales.domain()[1]))
                        .attr("x2", Math.sin(angle(current, size)) * scales(scales.domain()[1]))
                        .attr("y2", Math.cos(angle(current, size)) * scales(scales.domain()[1]));

                    var controlDescription = controlEnter.append("svg:foreignObject")
                        .attr('width', 200)
                        .attr('height', 0)
                        .attr("x", Math.sin(angle(current, size)) * scales(scales.domain()[1]) * 2)
                        .attr("y", Math.cos(angle(current, size)) * scales(scales.domain()[1]));

                    controlDescription.append("xhtml:div")
                        .attr('class', 'radar-description')
                        .style("background-color", 'rgba(' + rgbLeg.r + ',' + rgbLeg.g + ',' + rgbLeg.b + ',0.1)')
                        .style('border-bottom', '1px solid ' + currentLeg.color)
                        .style("padding", "10px")
                        .style("text-align", "justify")
                        .text(currentLeg.description);


                    var controlActionContent = controlEnter.append("svg:foreignObject")
                        .attr('width', 200)
                        .attr('height', 50)
                        .attr("x", Math.sin(angle(current, size)) * scales(scales.domain()[1]) * 2)
                        .attr("y", Math.cos(angle(current, size)) * scales(scales.domain()[1]) - 25);

                    controlActionContent.append("xhtml:button")
                        .attr('type', 'button')
                        .attr('class', 'radar-prev btn btn-mini icon-arrow-left')
                        .text('prev');


                    var controlSelect = controlActionContent.append("xhtml:select")
                        .attr('class', 'radar-select-note');

                    controlSelect.append('xhtml:option')
                        .attr('value', 0)
                        // .attr('selected', function(d,i){ return (d[0].values[current].value == 0) ? true : false;})
                        .text('Note')
                    controlSelect.append('xhtml:option')
                        .attr('value', 1)
                        //    .attr('selected', function(d,i){ return (d[0].values[current].value == 1) ? true : false;})
                        .text('Nul')
                    controlSelect.append('xhtml:option')
                        .attr('value', 2)
                        //.attr('selected', function(d,i){ return (d[0].values[current].value == 2) ? true : false;})
                        .text('Mauvais')
                    controlSelect.append('xhtml:option')
                        .attr('value', 3)
                        //    .attr('selected', function(d,i){ return (d[0].values[current].value == 3) ? true : false;})
                        .text('Nul')
                    controlSelect.append('xhtml:option')
                        .attr('value', 4)
                        //   .attr('selected', function(d,i){ return (d[0].values[current].value == 4) ? true : false;})
                        .text('Bien')
                    controlSelect.append('xhtml:option')
                        .attr('value', 5)
                        //   .attr('selected', function(d,i){ return (d[0].values[current].value == 4) ? true : false;})
                        .text('Tr├иs bien')

                    controlActionContent.append("xhtml:button")
                        .attr('type', 'button')
                        .attr('class', 'radar-next btn btn-mini icon-arrow-right')
                        .text('next');


                    var checkOption = function (d) {
                        if (d[0].values[current].value == this.value) {
                            return d3.select(this).attr("selected", "selected");
                        }
                    };

                    controlSelect.selectAll("option").each(checkOption);

                    // Animation
                    controlLine.transition().duration(500)
                        .attr("x1", Math.sin(angle(current, size)) * scales(scales.domain()[1]))
                        .attr("y1", Math.cos(angle(current, size)) * scales(scales.domain()[1]))
                        .attr("x2", Math.sin(angle(current, size)) * scales(scales.domain()[1]) * 2 + 200)
                        .attr("y2", Math.cos(angle(current, size)) * scales(scales.domain()[1]))
                        .each('end', function (d) {
                            controlDescription.transition().duration(300).attr('height', '100%')
                        });

                    // Controls
                    controlWrap.select('.radar-prev')
                        .on('click', function (d) {
                            chart.prev();
                            selection.transition().call(chart);
                        });
                    controlWrap.select('.radar-next')
                        .on('click', function (d) {
                            chart.next();
                            selection.transition().call(chart);
                        });

                    controlWrap.select('.radar-select-note')
                        .on('change', function (d) {
                            d[0].values[current].value = this.value;
                            chart.next();
                            selection.transition().call(chart);
                        });

                    //change
                } else {
                    cursor = 0;
                    startAngle = 180;
                    wrap.select('g.control').remove();
                }

                //------------------------------------------------------------
                // Main Chart Component(s)

                radars
                    .width(availableWidth)
                    .height(availableHeight)
                    .size(legs.length)
                    .max(ticks)
                    .startAngle(startAngle)
                    .cursor(cursor)
                    // .scales(scales)
                    .radius(radius)
                    .color(data.map(function (d, i) {
                        return d.color || color(d, i);
                    }).filter(function (d, i) {
                        return !data[i].disabled
                    }))
                ;


                var radarWrap = g.select('.nv-radarsWrap')
                    .datum(data.filter(function (d) {
                        return !d.disabled
                    }));

                d3.transition(radarWrap).call(radars);

                //------------------------------------------------------------

                //------------------------------------------------------------
                // Setup Axes

                // the grid data, number of ticks
                var gridData = buildAxisGrid(size, ticks);

                // Grid
                var grid = wrap.select('.grid').selectAll('.gridlevel').data(gridData);
                grid.exit().remove();

                grid.enter().append("path")
                    .attr("class", "gridlevel")
                    .attr("d", line);


                d3.transition(grid)
                    .attr('d', line);

                grid.style("stroke", "#000")
                    .style("fill", "none")
                    .style("opacity", 0.2)
                    .style("stroke-width", "0.7px")

                // Axes
                var ax = wrap.select("g.axes").selectAll("g.axis").data(legs);
                ax.exit().remove();

                var axEnter = ax.enter().append("g")
                    .attr("class", "axis");

                var legText = axEnter.append("svg:text")
                        .style("text-anchor", function (d, i) {
                            var x = Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                            if (Math.abs(x) < 0.1) {
                                return "middle"
                            }
                            if (x > 0) {
                                return "start"
                            }

                            return "end"
                        })
                        .attr("dy", function (d, i) {
                            var y = Math.cos(angle(i, size)) * scales(scales.domain()[1]);

                            if (Math.abs(y) < 0.1) {
                                return ".72em"
                            }

                            if (y > 0) {
                                return "1em"
                            }
                            return "-.3em"
                        })
                        .style("fill", function (d) {
                            return d.color;
                        })
                        .style("font-size", "9pt")
                        .style("font-weight", function (d, i) {
                            return (i == current && edit) ? "bold" : "normal";
                        })
                        .style("opacity", function (d, i) {
                            return (i == current && edit) ? 1 : 0.9;
                        })
                        .text(function (d) {
                            return d.label
                        })
                        .attr("x", function (d, i) {
                            return Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                        })
                        .attr("y", function (d, i) {
                            return Math.cos(angle(i, size)) * scales(scales.domain()[1]);
                        })
                    ;

                legText.on('click', function (d, i) {
                    chart.cursor(legs.length - i);
                    selection.transition().call(chart);
                });

                d3.transition(ax)
                    .select("text")
                    .style("text-anchor", function (d, i) {
                        var x = Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                        if (Math.abs(x) < 0.1) {
                            return "middle"
                        }
                        if (x > 0) {
                            return "start"
                        }

                        return "end"
                    })
                    .attr("dy", function (d, i) {
                        var y = Math.cos(angle(i, size)) * scales(scales.domain()[1]);

                        if (Math.abs(y) < 0.1) {
                            return ".72em"
                        }

                        if (y > 0) {
                            return "1em"
                        }
                        return "-.3em"
                    })
                    .style("font-weight", function (d, i) {
                        return (i == current && edit) ? "bold" : "normal";
                    })
                    .style("opacity", function (d, i) {
                        return (i == current && edit) ? 1 : 0.9;
                    })
                    .attr("x", function (d, i) {
                        return Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                    })
                    .attr("y", function (d, i) {
                        return Math.cos(angle(i, size)) * scales(scales.domain()[1]);
                    });

                axEnter.append("svg:line")
                    .style("stroke", function (d) {
                        return d.color;
                    })
                    .style("fill", "none")
                    .style("stroke-width", 0.7)
                    .style("opacity", function (d, i) {
                        return (i == current && edit) ? 1 : 0.7;
                    })
                    .attr("x1", function (d, i) {
                        return Math.sin(angle(i, size)) * scales(scales.domain()[0]);
                    })
                    .attr("y1", function (d, i) {
                        return Math.cos(angle(i, size)) * scales(scales.domain()[0]);
                    })
                    .attr("x2", function (d, i) {
                        return Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                    })
                    .attr("y2", function (d, i) {
                        return Math.cos(angle(i, size)) * scales(scales.domain()[1]);
                    });

                d3.transition(ax)
                    .select("line")
                    .style("opacity", function (d, i) {
                        return (i == current && edit) ? 1 : 0.9;
                    })
                    .attr("x1", function (d, i) {
                        return Math.sin(angle(i, size)) * scales(scales.domain()[0]);
                    })
                    .attr("y1", function (d, i) {
                        return Math.cos(angle(i, size)) * scales(scales.domain()[0]);
                    })
                    .attr("x2", function (d, i) {
                        return Math.sin(angle(i, size)) * scales(scales.domain()[1]);
                    })
                    .attr("y2", function (d, i) {
                        return Math.cos(angle(i, size)) * scales(scales.domain()[1]);
                    });
                //------------------------------------------------------------

                //============================================================
                // Event Handling/Dispatching (in chart's scope)
                //------------------------------------------------------------

                radars.dispatch.on('elementClick', function (d, i) {
                    chart.cursor(legs.length - d.pointIndex);
                    selection.transition().call(chart);
                });

                //radars.dispatch.on('tooltipShow', function(e) {
                //    console.log(e)
                //    e.pos = [parseFloat(e.pos[0] + availableHeight/2 + margin.left), parseFloat(e.pos[1] + availableHeight/2 + margin.top)];
                //    if (tooltips) showTooltip(e, that.parentNode);
                //});

                legend.dispatch.on('legendClick', function (d, i) {
                    d.disabled = !d.disabled;

                    if (!data.filter(function (d) {
                            return !d.disabled
                        }).length) {
                        data.map(function (d) {
                            d.disabled = false;
                            wrap.selectAll('.nv-series').classed('disabled', false);

                            return d;
                        });
                    }
                    chart.update()
                    //selection.transition().call(chart);
                });

                dispatch.on('tooltipShow', function (e) {
                    console.log(e)
                    e.pos = [parseFloat(e.pos[0] + availableHeight / 2 + margin.left), parseFloat(e.pos[1] + availableHeight / 2 + margin.top)];
                    if (tooltips) showTooltip(e, that.parentNode);
                });

                //============================================================

            });

            return chart;
        }

        function hexToRgb(hex, opacity) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // compute an angle
        function angle(i, length) {
            return i * (2 * Math.PI / length ) + ((2 * Math.PI) * startAngle / 360) + (cursor * 2 * Math.PI) / length;
        }

        // x-caclulator
        // d is the datapoint, i is the index, length is the length of the data
        function calculateX(d, i, length) {
            var l = scales(d);
            return Math.sin(angle(i, length)) * l;
        }

        // y-calculator
        function calculateY(d, i, length) {
            var l = scales(d);
            return Math.cos(angle(i, length)) * l;
        }

        // * build the spider axis * //
        // rewrite this to conform to d3 axis style? //
        function buildAxisGrid(length, ticks) {
            var min = scales.domain()[0];
            var max = scales.domain()[1] > 0 ? scales.domain()[1] : 1;
            var increase = max / ticks;

            var gridData = []
            for (var i = 0; i <= ticks; i++) {
                var val = min + i * increase;
                var d = [val];
                var gridPoints = [];

                for (var j = 0; j <= length; j++) {
                    gridPoints.push({
                        x: calculateX(d, j, length),
                        y: calculateY(d, j, length)
                    });
                }

                gridData.push(gridPoints)
            }

            return gridData;
        }

        //============================================================
        // Event Handling/Dispatching (out of chart's scope)
        //------------------------------------------------------------

        radars.dispatch.on('elementMouseover.tooltip', function (e) {
            dispatch.tooltipShow(e);
        });

        radars.dispatch.on('elementMouseout.tooltip', function (e) {
            dispatch.tooltipHide(e);
        });

        dispatch.on('tooltipHide', function () {
            if (tooltips) nv.tooltip.cleanup();
        });

        //============================================================


        //============================================================
        // Expose Public Variables
        //------------------------------------------------------------

        // expose chart's sub-components
        chart.dispatch = dispatch;
        chart.radars = radars;


        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin.top = typeof _.top != 'undefined' ? _.top : margin.top;
            margin.right = typeof _.right != 'undefined' ? _.right : margin.right;
            margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
            margin.left = typeof _.left != 'undefined' ? _.left : margin.left;
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

        chart.legs = function (_) {
            if (!arguments.length) return legs;
            legs = _;
            return chart;
        };

        chart.showLegend = function (_) {
            if (!arguments.length) return showLegend;
            showLegend = _;
            return chart;
        };

        chart.cursor = function (_) {
            if (!arguments.length) return cursor;
            cursor = _;
            return chart;
        };

        chart.next = function (_) {
            cursor = cursor - 1;
            if (Math.abs(cursor) > legs.length - 1) cursor = 0;
            return chart;
        };

        chart.prev = function (_) {
            cursor = cursor + 1;
            if (cursor > legs.length - 1) cursor = 0;
            return chart;
        };

        chart.edit = function (_) {
            if (!arguments.length) return edit;
            edit = _;
            return chart;
        };
        //============================================================


        return chart;
    }







    nv.models.line = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var  scatter = nv.models.scatter()
            ;

        var margin = {top: 0, right: 0, bottom: 0, left: 0}
            , width = 960
            , height = 500
            , color = nv.utils.defaultColor() // a function that returns a color
            , getX = function(d) { return d.x } // accessor to get the x value from a data point
            , getY = function(d) { return d.y } // accessor to get the y value from a data point
            , getLabel = undefined //function(d) { return d.y }
            , defined = function(d,i) { return !isNaN(getY(d,i)) && getY(d,i) !== null } // allows a line to be not continuous when it is not defined
            , isArea = function(d) { return d.area } // decides if a line is an area or just a line
            , clipEdge = false // if true, masks lines within x and y scale
            , x //can be accessed via chart.xScale()
            , y //can be accessed via chart.yScale()
            , interpolate = "linear" // controls the line interpolation
            ;

        scatter
            .size(16) // default size
            .sizeDomain([16,256]) //set to speed up calculation, needs to be unset if there is a custom size accessor
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

                //------------------------------------------------------------
                // Setup Scales

                x = scatter.xScale();
                y = scatter.yScale();

                x0 = x0 || x;
                y0 = y0 || y;

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-line').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-line');
                var defsEnter = wrapEnter.append('defs');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g')

                gEnter.append('g').attr('class', 'nv-groups');
                gEnter.append('g').attr('class', 'nv-scatterWrap');

                wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //------------------------------------------------------------




                scatter
                    .width(availableWidth)
                    .height(availableHeight)

                var scatterWrap = wrap.select('.nv-scatterWrap');
                //.datum(data); // Data automatically trickles down from the wrap

                scatterWrap.transition().call(scatter);



                defsEnter.append('clipPath')
                    .attr('id', 'nv-edge-clip-' + scatter.id())
                    .append('rect');

                wrap.select('#nv-edge-clip-' + scatter.id() + ' rect')
                    .attr('width', availableWidth)
                    .attr('height', (availableHeight > 0) ? availableHeight : 0);

                g   .attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + scatter.id() + ')' : '');
                scatterWrap
                    .attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + scatter.id() + ')' : '');




                var groups = wrap.select('.nv-groups').selectAll('.nv-group')
                    .data(function(d) { return d }, function(d) { return d.key });
                groups.enter().append('g')
                    .style('stroke-opacity', 1e-6)
                    .style('fill-opacity', 1e-6);

                groups.exit().remove();

                groups
                    .attr('class', function(d,i) { return 'nv-group nv-series-' + i })
                    .classed('hover', function(d) { return d.hover })
                    .style('fill', function(d,i){ return color(d, i) })
                    .style('stroke', function(d,i){ return color(d, i)});
                groups
                    .transition()
                    .style('stroke-opacity', 1)
                    .style('fill-opacity', .5);



                var areaPaths = groups.selectAll('path.nv-area')
                    .data(function(d) { return isArea(d) ? [d] : [] }); // this is done differently than lines because I need to check if series is an area
                areaPaths.enter().append('path')
                    .attr('class', 'nv-area')
                    .attr('d', function(d) {
                        return d3.svg.area()
                            .interpolate(interpolate)
                            .defined(defined)
                            .x(function(d,i) { return nv.utils.NaNtoZero(x0(getX(d,i))) })
                            .y0(function(d,i) { return nv.utils.NaNtoZero(y0(getY(d,i))) })
                            .y1(function(d,i) { return y0( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
                            //.y1(function(d,i) { return y0(0) }) //assuming 0 is within y domain.. may need to tweak this
                            .apply(this, [d.values])
                    });
                groups.exit().selectAll('path.nv-area')
                    .remove();

                areaPaths
                    .transition()
                    .attr('d', function(d) {
                        return d3.svg.area()
                            .interpolate(interpolate)
                            .defined(defined)
                            .x(function(d,i) { return nv.utils.NaNtoZero(x(getX(d,i))) })
                            .y0(function(d,i) { return nv.utils.NaNtoZero(y(getY(d,i))) })
                            .y1(function(d,i) { return y( y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0] ) })
                            //.y1(function(d,i) { return y0(0) }) //assuming 0 is within y domain.. may need to tweak this
                            .apply(this, [d.values])
                    });



                var linePaths = groups.selectAll('path.nv-line')
                    .data(function(d) { return [d.values] });
                linePaths.enter().append('path')
                    .attr('class', 'nv-line')
                    .attr('d',
                    d3.svg.line()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function(d,i) { return nv.utils.NaNtoZero(x0(getX(d,i))) })
                        .y(function(d,i) { return nv.utils.NaNtoZero(y0(getY(d,i))) })
                );

                linePaths
                    .transition()
                    .attr('d',
                    d3.svg.line()
                        .interpolate(interpolate)
                        .defined(defined)
                        .x(function(d,i) { return nv.utils.NaNtoZero(x(getX(d,i))) })
                        .y(function(d,i) { return nv.utils.NaNtoZero(y(getY(d,i))) })
                );



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

        d3.rebind(chart, scatter, 'id', 'interactive', 'size', 'xScale', 'yScale', 'zScale', 'xDomain', 'yDomain', 'xRange', 'yRange',
            'sizeDomain', 'forceX', 'forceY', 'forceSize', 'clipVoronoi', 'useVoronoi', 'clipRadius', 'padData','highlightPoint','clearHighlights');

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

        chart.x = function(_) {
            if (!arguments.length) return getX;
            getX = _;
            scatter.x(_);
            return chart;
        };

        chart.y = function(_) {
            if (!arguments.length) return getY;
            getY = _;
            scatter.y(_);
            return chart;
        };

        chart.label = function(_) {
            //console.log("chart label",_)
            if (!arguments.length) return getLabel;
            getLabel = _;
            scatter.label(_);
            return chart;
        };

        chart.clipEdge = function(_) {
            if (!arguments.length) return clipEdge;
            clipEdge = _;
            return chart;
        };

        chart.color = function(_) {
            if (!arguments.length) return color;
            color = nv.utils.getColor(_);
            scatter.color(color);
            return chart;
        };

        chart.interpolate = function(_) {
            if (!arguments.length) return interpolate;
            interpolate = _;
            return chart;
        };

        chart.defined = function(_) {
            if (!arguments.length) return defined;
            defined = _;
            return chart;
        };

        chart.isArea = function(_) {
            if (!arguments.length) return isArea;
            isArea = d3.functor(_);
            return chart;
        };

        //============================================================


        return chart;
    }


    nv.models.stackedArea = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var margin = {top: 0, right: 0, bottom: 0, left: 0}
            , width = 960
            , height = 500
            , color = nv.utils.defaultColor() // a function that computes the color
            , id = Math.floor(Math.random() * 100000) //Create semi-unique ID incase user doesn't selet one
            , getX = function(d) { return d.x } // accessor to get the x value from a data point
            , getY = function(d) { return d.y } // accessor to get the y value from a data point
            , getLabel = undefined
            , style = 'stack'
            , offset = 'zero'
            , order = 'default'
            , interpolate = 'linear'  // controls the line interpolation
            , clipEdge = false // if true, masks lines within x and y scale
            , x //can be accessed via chart.xScale()
            , y //can be accessed via chart.yScale()
            , scatter = nv.models.scatter()
            , dispatch =  d3.dispatch('tooltipShow', 'tooltipHide', 'areaClick', 'areaMouseover', 'areaMouseout')
            ;

        scatter
            .size(2.2) // default size
            .sizeDomain([2.2,2.2]) // all the same size by default
        ;

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
            selection.each(function(data) {
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
                data.forEach(function(aseries, i) {
                    aseries.seriesIndex = i;
                    aseries.values = aseries.values.map(function(d, j) {
                        d.index = j;
                        d.seriesIndex = i;
                        return d;
                    });
                });

                var dataFiltered = data.filter(function(series) {
                    return !series.disabled;
                });

                data = d3.layout.stack()
                    .order(order)
                    .offset(offset)
                    .values(function(d) { return d.values })  //TODO: make values customizeable in EVERY model in this fashion
                    .x(getX)
                    .y(getY)
                    .out(function(d, y0, y) {
                        var yHeight = (getY(d) === 0) ? 0 : y;
                        d.display = {
                            y: yHeight,
                            y0: y0
                        };
                    })
                (dataFiltered);


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-stackedarea').data([data]);
                var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-stackedarea');
                var defsEnter = wrapEnter.append('defs');
                var gEnter = wrapEnter.append('g');
                var g = wrap.select('g');

                gEnter.append('g').attr('class', 'nv-areaWrap');
                gEnter.append('g').attr('class', 'nv-scatterWrap');

                wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //------------------------------------------------------------


                scatter
                    .width(availableWidth)
                    .height(availableHeight)
                    .x(getX)
                    .y(function(d) { return d.display.y + d.display.y0 })
                    .forceY([0])
                    .color(data.map(function(d,i) {
                        return d.color || color(d, d.seriesIndex);
                    }));


                var scatterWrap = g.select('.nv-scatterWrap')
                    .datum(data);

                scatterWrap.call(scatter);

                defsEnter.append('clipPath')
                    .attr('id', 'nv-edge-clip-' + id)
                    .append('rect');

                wrap.select('#nv-edge-clip-' + id + ' rect')
                    .attr('width', availableWidth)
                    .attr('height', availableHeight);

                g   .attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + id + ')' : '');

                var area = d3.svg.area()
                    .x(function(d,i)  { return x(getX(d,i)) })
                    .y0(function(d) {
                        return y(d.display.y0)
                    })
                    .y1(function(d) {
                        return y(d.display.y + d.display.y0)
                    })
                    .interpolate(interpolate);

                var zeroArea = d3.svg.area()
                    .x(function(d,i)  { return x(getX(d,i)) })
                    .y0(function(d) { return y(d.display.y0) })
                    .y1(function(d) { return y(d.display.y0) });


                var path = g.select('.nv-areaWrap').selectAll('path.nv-area')
                    .data(function(d) { return d });

                path.enter().append('path').attr('class', function(d,i) { return 'nv-area nv-area-' + i })
                    .attr('d', function(d,i){
                        return zeroArea(d.values, d.seriesIndex);
                    })
                    .on('mouseover', function(d,i) {
                        d3.select(this).classed('hover', true);
                        dispatch.areaMouseover({
                            point: d,
                            series: d.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: d.seriesIndex
                        });
                    })
                    .on('mouseout', function(d,i) {
                        d3.select(this).classed('hover', false);
                        dispatch.areaMouseout({
                            point: d,
                            series: d.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: d.seriesIndex
                        });
                    })
                    .on('click', function(d,i) {
                        d3.select(this).classed('hover', false);
                        dispatch.areaClick({
                            point: d,
                            series: d.key,
                            pos: [d3.event.pageX, d3.event.pageY],
                            seriesIndex: d.seriesIndex
                        });
                    })

                path.exit().remove();

                path
                    .style('fill', function(d,i){
                        return d.color || color(d, d.seriesIndex)
                    })
                    .style('stroke', function(d,i){ return d.color || color(d, d.seriesIndex) });
                path.transition()
                    .attr('d', function(d,i) {
                        return area(d.values,i)
                    });



                //============================================================
                // Event Handling/Dispatching (in chart's scope)
                //------------------------------------------------------------

                scatter.dispatch.on('elementMouseover.area', function(e) {
                    g.select('.nv-chart-' + id + ' .nv-area-' + e.seriesIndex).classed('hover', true);
                });
                scatter.dispatch.on('elementMouseout.area', function(e) {
                    g.select('.nv-chart-' + id + ' .nv-area-' + e.seriesIndex).classed('hover', false);
                });

                //============================================================
                //Special offset functions
                chart.d3_stackedOffset_stackPercent = function(stackData) {
                    var n = stackData.length,    //How many series
                        m = stackData[0].length,     //how many points per series
                        k = 1 / n,
                        i,
                        j,
                        o,
                        y0 = [];

                    for (j = 0; j < m; ++j) { //Looping through all points
                        for (i = 0, o = 0; i < dataRaw.length; i++)  //looping through series'
                            o += getY(dataRaw[i].values[j])   //total value of all points at a certian point in time.

                        if (o) for (i = 0; i < n; i++)
                            stackData[i][j][1] /= o;
                        else
                            for (i = 0; i < n; i++)
                                stackData[i][j][1] = k;
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

        scatter.dispatch.on('elementClick.area', function(e) {
            dispatch.areaClick(e);
        })
        scatter.dispatch.on('elementMouseover.tooltip', function(e) {
            e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top],
                dispatch.tooltipShow(e);
        });
        scatter.dispatch.on('elementMouseout.tooltip', function(e) {
            dispatch.tooltipHide(e);
        });

        //============================================================

        //============================================================
        // Global getters and setters
        //------------------------------------------------------------

        chart.dispatch = dispatch;
        chart.scatter = scatter;

        d3.rebind(chart, scatter, 'interactive', 'size', 'xScale', 'yScale', 'zScale', 'xDomain', 'yDomain', 'xRange', 'yRange',
            'sizeDomain', 'forceX', 'forceY', 'forceSize', 'clipVoronoi', 'useVoronoi','clipRadius','highlightPoint','clearHighlights');

        chart.options = nv.utils.optionsFunc.bind(chart);

        chart.x = function(_) {
            if (!arguments.length) return getX;
            getX = d3.functor(_);
            return chart;
        };

        chart.y = function(_) {
            if (!arguments.length) return getY;
            getY = d3.functor(_);
            return chart;
        }

        chart.label = function(_) {
            //console.log("stacked Area label",_)
            if (!arguments.length) return getLabel;
            getLabel = _;
            scatter.label(_);
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

        chart.clipEdge = function(_) {
            if (!arguments.length) return clipEdge;
            clipEdge = _;
            return chart;
        };

        chart.color = function(_) {
            if (!arguments.length) return color;
            color = nv.utils.getColor(_);
            return chart;
        };

        chart.offset = function(_) {
            if (!arguments.length) return offset;
            offset = _;
            return chart;
        };

        chart.order = function(_) {
            if (!arguments.length) return order;
            order = _;
            return chart;
        };

        //shortcut for offset + order
        chart.style = function(_) {
            if (!arguments.length) return style;
            style = _;

            switch (style) {
                case 'stack':
                    chart.offset('zero');
                    chart.order('default');
                    break;
                case 'stream':
                    chart.offset('wiggle');
                    chart.order('inside-out');
                    break;
                case 'stream-center':
                    chart.offset('silhouette');
                    chart.order('inside-out');
                    break;
                case 'expand':
                    chart.offset('expand');
                    chart.order('default');
                    break;
                case 'stack_percent':
                    chart.offset(chart.d3_stackedOffset_stackPercent);
                    chart.order('default');
                    break;
            }

            return chart;
        };

        chart.interpolate = function(_) {
            if (!arguments.length) return interpolate;
            interpolate = _;
            return chart;
        };
        //============================================================


        return chart;
    }


    nv.models.stackedAreaChart = function() {
        "use strict";
        //============================================================
        // Public Variables with Default Settings
        //------------------------------------------------------------

        var stacked = nv.models.stackedArea()
            , xAxis = nv.models.axis()
            , yAxis = nv.models.axis()
            , legend = nv.models.legend()
            , controls = nv.models.legend()
            , interactiveLayer = nv.interactiveGuideline()
            ;

        var margin = {top: 30, right: 25, bottom: 50, left: 60}
            , width = null
            , height = null
            , color = nv.utils.defaultColor() // a function that takes in d, i and returns color
            , showControls = true
            , showLegend = true
            , showXAxis = true
            , showYAxis = true
            , rightAlignYAxis = false
            , useInteractiveGuideline = false
            , tooltips = true
            , tooltip = function(key, x, y, e, graph) {
                return '<h3>' + key + '</h3>' +
                    '<p>' +  y + ' on ' + x + '</p>'
            }
            , x //can be accessed via chart.xScale()
            , y //can be accessed via chart.yScale()
            , yAxisTickFormat = d3.format(',.2f')
            , state = { style: stacked.style() }
            , defaultState = null
            , noData = 'No Data Available.'
            , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState')
            , controlWidth = 250
            , cData = ['Stacked','Stream','Expanded']
            , controlLabels = {}
            , transitionDuration = 250
            ;

        xAxis
            .orient('bottom')
            .tickPadding(7)
        ;
        yAxis
            .orient((rightAlignYAxis) ? 'right' : 'left')
        ;

        controls.updateState(false);
        //============================================================


        //============================================================
        // Private Variables
        //------------------------------------------------------------

        var showTooltip = function(e, offsetElement) {
            var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
                top = e.pos[1] + ( offsetElement.offsetTop || 0),
                x = xAxis.tickFormat()(stacked.x()(e.point, e.pointIndex)),
                y = yAxis.tickFormat()(stacked.y()(e.point, e.pointIndex)),
                content = tooltip(e.series.key, x, y, e, chart);

            nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
        };

        //============================================================


        function chart(selection) {
            selection.each(function(data) {
                var container = d3.select(this),
                    that = this;

                var availableWidth = (width  || parseInt(container.style('width')) || 960)
                        - margin.left - margin.right,
                    availableHeight = (height || parseInt(container.style('height')) || 400)
                        - margin.top - margin.bottom;

                chart.update = function() { container.transition().duration(transitionDuration).call(chart); };
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

                x = stacked.xScale();
                y = stacked.yScale();

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup containers and skeleton of chart

                var wrap = container.selectAll('g.nv-wrap.nv-stackedAreaChart').data([data]);
                var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-stackedAreaChart').append('g');
                var g = wrap.select('g');

                gEnter.append("rect").style("opacity",0);
                gEnter.append('g').attr('class', 'nv-x nv-axis');
                gEnter.append('g').attr('class', 'nv-y nv-axis');
                gEnter.append('g').attr('class', 'nv-stackedWrap');
                gEnter.append('g').attr('class', 'nv-legendWrap');
                gEnter.append('g').attr('class', 'nv-controlsWrap');
                gEnter.append('g').attr('class', 'nv-interactive');

                g.select("rect").attr("width",availableWidth).attr("height",availableHeight);
                //------------------------------------------------------------
                // Legend

                if (showLegend) {
                    var legendWidth = (showControls) ? availableWidth - controlWidth : availableWidth;
                    legend
                        .width(legendWidth);

                    g.select('.nv-legendWrap')
                        .datum(data)
                        .call(legend);

                    if ( margin.top != legend.height()) {
                        margin.top = legend.height();
                        availableHeight = (height || parseInt(container.style('height')) || 400)
                        - margin.top - margin.bottom;
                    }

                    g.select('.nv-legendWrap')
                        .attr('transform', 'translate(' + (availableWidth-legendWidth) + ',' + (-margin.top) +')');
                }

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Controls

                if (showControls) {
                    var controlsData = [
                        {
                            key: controlLabels.stacked || 'Stacked',
                            metaKey: 'Stacked',
                            disabled: stacked.style() != 'stack',
                            style: 'stack'
                        },
                        {
                            key: controlLabels.stream || 'Stream',
                            metaKey: 'Stream',
                            disabled: stacked.style() != 'stream',
                            style: 'stream'
                        },
                        {
                            key: controlLabels.expanded || 'Expanded',
                            metaKey: 'Expanded',
                            disabled: stacked.style() != 'expand',
                            style: 'expand'
                        },
                        {
                            key: controlLabels.stack_percent || 'Stack %',
                            metaKey: 'Stack_Percent',
                            disabled: stacked.style() != 'stack_percent',
                            style: 'stack_percent'
                        }
                    ];

                    controlWidth = (cData.length/3) * 260;

                    controlsData = controlsData.filter(function(d) {
                        return cData.indexOf(d.metaKey) !== -1;
                    })

                    controls
                        .width( controlWidth )
                        .color(['#444', '#444', '#444']);

                    g.select('.nv-controlsWrap')
                        .datum(controlsData)
                        .call(controls);


                    if ( margin.top != Math.max(controls.height(), legend.height()) ) {
                        margin.top = Math.max(controls.height(), legend.height());
                        availableHeight = (height || parseInt(container.style('height')) || 400)
                        - margin.top - margin.bottom;
                    }


                    g.select('.nv-controlsWrap')
                        .attr('transform', 'translate(0,' + (-margin.top) +')');
                }

                //------------------------------------------------------------


                wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                if (rightAlignYAxis) {
                    g.select(".nv-y.nv-axis")
                        .attr("transform", "translate(" + availableWidth + ",0)");
                }

                //------------------------------------------------------------
                // Main Chart Component(s)

                //------------------------------------------------------------
                //Set up interactive layer
                if (useInteractiveGuideline) {
                    interactiveLayer
                        .width(availableWidth)
                        .height(availableHeight)
                        .margin({left: margin.left, top: margin.top})
                        .svgContainer(container)
                        .xScale(x);
                    wrap.select(".nv-interactive").call(interactiveLayer);
                }

                stacked
                    .width(availableWidth)
                    .height(availableHeight)

                var stackedWrap = g.select('.nv-stackedWrap')
                    .datum(data);

                stackedWrap.transition().call(stacked);

                //------------------------------------------------------------


                //------------------------------------------------------------
                // Setup Axes

                if (showXAxis) {
                    xAxis
                        .scale(x)
                        .ticks( availableWidth / 100 )
                        .tickSize( -availableHeight, 0);

                    g.select('.nv-x.nv-axis')
                        .attr('transform', 'translate(0,' + availableHeight + ')');

                    g.select('.nv-x.nv-axis')
                        .transition().duration(0)
                        .call(xAxis);
                }

                if (showYAxis) {
                    yAxis
                        .scale(y)
                        .ticks(stacked.offset() == 'wiggle' ? 0 : availableHeight / 36)
                        .tickSize(-availableWidth, 0)
                        .setTickFormat( (stacked.style() == 'expand' || stacked.style() == 'stack_percent')
                            ? d3.format('%') : yAxisTickFormat);

                    g.select('.nv-y.nv-axis')
                        .transition().duration(0)
                        .call(yAxis);
                }

                //------------------------------------------------------------


                //============================================================
                // Event Handling/Dispatching (in chart's scope)
                //------------------------------------------------------------

                stacked.dispatch.on('areaClick.toggle', function(e) {
                    if (data.filter(function(d) { return !d.disabled }).length === 1)
                        data.forEach(function(d) {
                            d.disabled = false;
                        });
                    else
                        data.forEach(function(d,i) {
                            d.disabled = (i != e.seriesIndex);
                        });

                    state.disabled = data.map(function(d) { return !!d.disabled });
                    dispatch.stateChange(state);

                    chart.update();
                });

                legend.dispatch.on('stateChange', function(newState) {
                    state.disabled = newState.disabled;
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

                    stacked.style(d.style);


                    state.style = stacked.style();
                    dispatch.stateChange(state);

                    chart.update();
                });


                interactiveLayer.dispatch.on('elementMousemove', function(e) {
                    stacked.clearHighlights();
                    var singlePoint, pointIndex, pointXLocation, allData = [];
                    data
                        .filter(function(series, i) {
                            series.seriesIndex = i;
                            return !series.disabled;
                        })
                        .forEach(function(series,i) {
                            pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
                            stacked.highlightPoint(i, pointIndex, true);
                            var point = series.values[pointIndex];
                            if (typeof point === 'undefined') return;
                            if (typeof singlePoint === 'undefined') singlePoint = point;
                            if (typeof pointXLocation === 'undefined') pointXLocation = chart.xScale()(chart.x()(point,pointIndex));

                            //If we are in 'expand' mode, use the stacked percent value instead of raw value.
                            var tooltipValue = (stacked.style() == 'expand') ? point.display.y : chart.y()(point,pointIndex);
                            allData.push({
                                key: series.key,
                                value: tooltipValue,
                                color: color(series,series.seriesIndex),
                                stackedValue: point.display
                            });
                        });

                    allData.reverse();

                    //Highlight the tooltip entry based on which stack the mouse is closest to.
                    if (allData.length > 2) {
                        var yValue = chart.yScale().invert(e.mouseY);
                        var yDistMax = Infinity, indexToHighlight = null;
                        allData.forEach(function(series,i) {

                            //To handle situation where the stacked area chart is negative, we need to use absolute values
                            //when checking if the mouse Y value is within the stack area.
                            yValue = Math.abs(yValue);
                            var stackedY0 = Math.abs(series.stackedValue.y0);
                            var stackedY = Math.abs(series.stackedValue.y);
                            if ( yValue >= stackedY0 && yValue <= (stackedY + stackedY0))
                            {
                                indexToHighlight = i;
                                return;
                            }
                        });
                        if (indexToHighlight != null)
                            allData[indexToHighlight].highlight = true;
                    }

                    var xValue = xAxis.tickFormat()(chart.x()(singlePoint,pointIndex));

                    //If we are in 'expand' mode, force the format to be a percentage.
                    var valueFormatter = (stacked.style() == 'expand') ?
                        function(d,i) {return d3.format(".1%")(d);} :
                        function(d,i) {return yAxis.tickFormat()(d); };
                    interactiveLayer.tooltip
                        .position({left: pointXLocation + margin.left, top: e.mouseY + margin.top})
                        .chartContainer(that.parentNode)
                        .enabled(tooltips)
                        .valueFormatter(valueFormatter)
                        .data(
                        {
                            value: xValue,
                            series: allData
                        }
                    )();

                    interactiveLayer.renderGuideLine(pointXLocation);

                });

                interactiveLayer.dispatch.on("elementMouseout",function(e) {
                    dispatch.tooltipHide();
                    stacked.clearHighlights();
                });


                dispatch.on('tooltipShow', function(e) {
                    if (tooltips) showTooltip(e, that.parentNode);
                });

                // Update chart from a state object passed to event handler
                dispatch.on('changeState', function(e) {

                    if (typeof e.disabled !== 'undefined' && data.length === e.disabled.length) {
                        data.forEach(function(series,i) {
                            series.disabled = e.disabled[i];
                        });

                        state.disabled = e.disabled;
                    }

                    if (typeof e.style !== 'undefined') {
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

        stacked.dispatch.on('tooltipShow', function(e) {
            //disable tooltips when value ~= 0
            //// TODO: consider removing points from voronoi that have 0 value instead of this hack
            /*
             if (!Math.round(stacked.y()(e.point) * 100)) {  // 100 will not be good for very small numbers... will have to think about making this valu dynamic, based on data range
             setTimeout(function() { d3.selectAll('.point.hover').classed('hover', false) }, 0);
             return false;
             }
             */

            e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top],
                dispatch.tooltipShow(e);
        });

        stacked.dispatch.on('tooltipHide', function(e) {
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
        chart.stacked = stacked;
        chart.legend = legend;
        chart.controls = controls;
        chart.xAxis = xAxis;
        chart.yAxis = yAxis;
        chart.interactiveLayer = interactiveLayer;

        d3.rebind(chart, stacked, 'x', 'y', 'size', 'xScale', 'yScale', 'xDomain', 'yDomain', 'xRange', 'yRange', 'sizeDomain', 'interactive', 'useVoronoi', 'offset', 'order', 'style', 'clipEdge', 'forceX', 'forceY', 'forceSize', 'interpolate');

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
            stacked.color(color);
            return chart;
        };

        chart.label = function(_) {
            //console.log("SA CHART", _)
            if (!arguments.length) return stacked.label;
            stacked.label(_);
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

        chart.useInteractiveGuideline = function(_) {
            if(!arguments.length) return useInteractiveGuideline;
            useInteractiveGuideline = _;
            if (_ === true) {
                chart.interactive(false);
                chart.useVoronoi(false);
            }
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

        chart.controlsData = function(_) {
            if (!arguments.length) return cData;
            cData = _;
            return chart;
        };

        chart.controlLabels = function(_) {
            if (!arguments.length) return controlLabels;
            if (typeof _ !== 'object') return controlLabels;
            controlLabels = _;
            return chart;
        };

        yAxis.setTickFormat = yAxis.tickFormat;

        yAxis.tickFormat = function(_) {
            if (!arguments.length) return yAxisTickFormat;
            yAxisTickFormat = _;
            return yAxis;
        };


        //============================================================

        return chart;
    }


    //console.log("FINISH", nv)
})()