import angular from 'angular';
import 'dictionary';
import "d3";
import "d3.layout.cloud"





angular.module('app.widgets.dm-word-cloud', ['app.dictionary',"app.dps"])
  .service("d3", function(){return d3})
  .controller('WordCloudController', function ( $scope, $http, $dps, EventEmitter, 
                                                      APIProvider, $lookup,$translate, 
                                                      $q, d3, pageSubscriptions) {
    const eventEmitter = new EventEmitter($scope);

    // function updateChart(containerID, ontology){

    //   console.log(ontology);

    //   d3.select("#"+containerID).selectAll("svg").remove();
    //   d3.selectAll("."+containerID+"-overlay").remove();
      
      
    //   let width = d3.select("#"+containerID).node().getBoundingClientRect().width,
    //   height = width,
    //   radius = 35,
    //   padding = 30, // separation between same-color circles
    //   clusterPadding = 6, // separation between different-color circles
    //   maxRadius = 35,
    //   minRadius = 10,
    //   tickCount = 10;


    //   var bounds = d3.geom.polygon([
    //     [0, 0],
    //     [0, height],
    //     [width, height],
    //     [width, 0]
    //   ]);    

    //   var svg = d3.select("#"+containerID).insert("svg")
    //       .attr("width", width)
    //       .attr("height", height)
    //       .attr("style","border:0.1rem solid green")

    //   // console.log(svg.node().getBoundingClientRect())


    //   var rect = d3.select("#"+containerID).node().getBoundingClientRect();
    //   var overlay = d3.select("#"+containerID).append("svg")
    //       .attr("width", width)
    //       .attr("height", height)
    //       .attr("class",containerID+"-overlay")
    //       .style("position","absolute")
    //       .style("top",0)
    //       .style("left",0)
    //       .style("fill","none")
    //       .style("pointer-events","all")
    //       // .attr("stroke","red")
    //       .style("z-index", 3); 

    //   ontology.tags.forEach(function(n,i){
    //       n.index = i;
    //       n.radius = n.value; 
    //       // ontology.links.filter(function(l){
    //       //       return l.target == n.index || l.source == n.index
    //       //     }).length;
    //   })

    //   var values = ontology.tags.map(function(d){return d.radius})
    //   var ticks = [d3.min(values)];
    //   for(var i=1; i<=tickCount; i++) ticks.push(ticks[i-1]+(d3.max(values)-d3.min(values))/tickCount);

    //   var round = function(value){
    //     if(value <= ticks[0]) return ticks[0];
    //     if(value >= ticks[ticks.length-1]) return ticks[ticks.length-1];
    //     for(var i=0; i<ticks.length-1;i++){
    //       if(ticks[i] <= value && value <= ticks[i+1]) 
    //         return (value-ticks[i] >= ticks[i+1]-value) ? ticks[i+1] : ticks[i];
    //     }
    //   }


    //   var lvalues = ontology.links.map(function(l){return l.value})

    //   var scale = d3.scale.ordinal()
    //                   .domain(ticks)
    //                   .rangePoints([minRadius,maxRadius])

    //   var textScale = d3.scale.ordinal()
    //                   .domain(scale.range())
    //                   .rangePoints([10,18])

    //   var textStrokeScale = d3.scale.ordinal()
    //                   .domain(scale.range())
    //                   .rangePoints([0.5,1])


    //   var linkStrangeScale = d3.scale.linear()
    //                   .domain([d3.min(lvalues),d3.max(lvalues)])
    //                   .range([0,1])                

    //   var linkStrokeScale = d3.scale.linear()
    //                   .domain([d3.min(lvalues),d3.max(lvalues)])
    //                   .range([2,5])                


    //   var force = d3.layout.force()
    //       .gravity(.3)
    //     // .linkStrength(function(d){return linkStrangeScale(d.value)})
    //     .distance(function(d){return 50-50*linkStrangeScale(d.value)/*50*(1/(d.value*d.value))*/})
    //       .charge(-(0.1*width))
    //       .size([width, height]);


         
    //   svg.append("defs")
    //         .selectAll()
    //         .data(scale.range())
    //         .enter()
    //         .append("clipPath")
    //           .attr("class","clip")
    //           .attr("id", function(d){return "clip"+d})
    //           .append("circle")
    //           .attr("r", function(d){return d});    

    //   svg = svg.append("g")
    //   overlay = overlay.append("g")



    //   ontology.tags.forEach(function(n){
    //     n.radius = scale(round(n.radius))
    //   })

    //   force
    //     .nodes(ontology.tags)
    //     .links(ontology.links)
    //     .start();

    //   function nodeToNode(d) {
    //       var deltaX = 0.5*(-d.source.x + d.target.x);
    //       var deltaY = 0.5*(-d.source.y + d.target.y);
           
    //       var amx = []
    //       if(deltaX >= deltaY){
    //         amx.push({x:d.source.x+deltaX,y:d.source.y})
    //         amx.push({x:d.target.x-deltaX,y:d.target.y})
    //       }else{
    //         amx.push({x:d.source.x,y:d.source.y+deltaY})
    //         amx.push({x:d.target.x,y:d.target.y-deltaY})
    //       }
          
    //       return "M" + d.source.x + "," + d.source.y
    //            + "C" + amx[0].x + "," + amx[0].y
    //            + " " + amx[1].x + "," + amx[1].y
    //            + " " + d.target.x + "," + d.target.y;
    //     }


    //   var node = svg.selectAll(".node")
    //         .data(ontology.tags)
    //         .enter().append("g")
    //         .attr("class", "node")

    //       // node.append("image")
    //       //   .attr("xlink:href",function(d){return d.icon})
    //       //   .attr("x", function(d){return -d.radius})
    //       //   .attr("y", function(d){return -d.radius})
    //       //   .attr("width", function(d){return d.radius*2})
    //       //   .attr("height", function(d){return d.radius*2})
    //       //   .attr("opacity",0.3)
    //       //   .attr("clip-path",function(d){return "url(#clip"+d.radius+")"})

    //       node.append("text")
    //           .attr("dx", function(d){2})
    //           .attr("dy", function(d){2})
    //           .attr("font-size",function(d){return textScale(d.radius)+"px"})
    //           .attr("stroke","#ddd")
    //           .attr("stroke-opacity","1")
    //           .attr("stroke-width",function(d){return textStrokeScale(d.radius)+"px"})
    //           .text(function(d) { return d.tag });
  
    //       node.append("circle")
    //         .attr("r", function(d){return 2})
    //         .attr("cx", 0)//function(d){return -d.radius})
    //         .attr("cy", 0)//function(d){return -d.radius})
    //         .attr("stroke","#ddd")
    //         // .attr("stroke-width","2px")
    //         // .attr("fill","none")
    //         // .attr("opacity",0.4)
            

    //   var nodeClip = overlay.selectAll(".node-clip")
    //         .data(ontology.tags)
    //         .enter().append("circle")
    //         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    //         .attr("class", "node-clip")
    //         .attr("r", function(d){return d.radius*1.5})
    //         .style("stroke-width", 5)
    //         .on("mouseover", mouseover)
    //         .on("mouseout", mouseout);


    //   var counter=0;
    //   force.on("tick", function() {
    //     node.each(collide(.7));
    //     nodeClip.each(collide(.7))
    //     node
    //     .attr("transform", function(d) {
    //      return "translate(" + d.x + "," + d.y + ")"; 
    //     });
        
    //     nodeClip
    //     .attr("transform", function(d) {
    //      return "translate(" + d.x + "," + d.y + ")"; 
    //     });


    //     var nodeX = ontology.tags.map(function(n){return n.x})
    //     var nodeY = ontology.tags.map(function(n){return n.y})
    //     svg.attr("transform", function(d) {
           
    //        return "translate(" 
    //             + (width/2-(d3.min(nodeX)-25+(d3.max(nodeX)-d3.min(nodeX)+50)/2)) 
    //             + "," 
    //             + (-d3.min(nodeY)+50) 
    //             + ")"; 
    //       });

    //     overlay.attr("transform", function(d) {
    //        return "translate(" 
    //             + (width/2-(d3.min(nodeX)-25+(d3.max(nodeX)-d3.min(nodeX)+50)/2))
    //             + "," 
    //             + (-d3.min(nodeY)+50) 
    //             + ")"; 
    //       });
    //   });


    //   // Resolves collisions between d and all other circles.
    //   function collide(alpha) {
    //     var quadtree = d3.geom.quadtree(ontology.tags);
    //     return function(d) {
    //       var r = d.radius + maxRadius + Math.max(padding, padding),
    //           nx1 = d.x - r,
    //           nx2 = d.x + r,
    //           ny1 = d.y - r,
    //           ny2 = d.y + r;
    //       quadtree.visit(function(quad, x1, y1, x2, y2) {
    //         if (quad.point && (quad.point !== d)) {
    //           var x = d.x - quad.point.x,
    //               y = d.y - quad.point.y,
    //               l = Math.sqrt(x * x + y * y),
    //               r = d.radius+ quad.point.radius + padding;
    //           if (l < r) {
    //             l = (l - r) / l * alpha;
    //             d.x -= x *= l;
    //             d.y -= y *= l;
    //             quad.point.x += x;
    //             quad.point.y += y;
    //           }
    //         }
    //         return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    //       });
    //     };
    //   }


    //   for(;force.alpha()>0.01;){
    //     force.tick();
    //   }
    //   force.stop();



    //   function mouseover(d) {

    //     node.selectAll("image").attr("opacity",0);

    //     var g = svg.insert("g", ".g-highligth")
    //               .attr("class","linkA");
    //     var selectedLinks = ontology.links.filter(
    //           function(l){
    //             return l.target.tag == d.tag || l.source.tag == d.tag
    //           })
    //     var selectedNodes = selectedLinks.map(
    //         function(l){
    //           return (l.target.tag == d.tag) ? l.source : l.target; 
    //         }
    //       )
    //     var selectedText = selectedLinks.map(
    //         function(l){
    //           return (l.target.tag == d.tag) ? l.source : l.target; 
    //         }
    //       )

    //     selectedNodes.push(d);
    //     selectedText.push(d);

    //      g.selectAll("path")
    //         .data(selectedLinks)
    //         .enter()
    //         .append("path")
    //           .attr("d", nodeToNode)
    //           .attr("stroke-width",function(d){return linkStrokeScale(d.value)+"px"})
    //           .style("stroke-dasharray", "0,250")
    //           .attr("stroke-opacity",0.1)
    //           .style("stroke","black")//"rgb(34, 121, 179)")
    //           .style("fill","none")

    //         .transition()
    //           .ease("cubic-in")
    //           .style("stroke-dasharray", "250,250")
    //         .duration(500);
        
    //     var gn = g.insert("g", ".g-highligth")

    //     var gnn = gn.selectAll("g",".node")
    //         .data(selectedNodes)
    //         .enter().append("g").attr("class","node");

    //         // gnn.append("image")
    //         //   .attr("xlink:href", function(d){return d.icon})
    //         //   .attr("x",function(d){return -d.radius})
    //         //   .attr("y",function(d){return -d.radius})
    //         //   .attr("width", function(d){return d.radius*2})
    //         //   .attr("height", function(d){return d.radius*2})
    //         //   .attr("opacity",1)
    //         //   .attr("clip-path",function(d){return "url(#clip"+d.radius+")"})
    //         //   .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";}) 
    //         //   .transition()
    //         //   .ease("cubic-in")
    //         //     .attr("opacity", "0")
    //         //   .duration(500);
              
           
    //         gnn = gn.selectAll(".text")
    //         .data(selectedNodes)
    //         .enter()
    //         .append("g").attr("class","text");
        
    //         gnn.append("text")
    //           .attr("dx", function(d){return d.x})//d.radius-d.radius/2})
    //           .attr("dy", function(d){return d.y})//d.radius-d.radius/3})
    //           .attr("font-size",function(d){return textScale(d.radius)+"px"})
    //           .attr("stroke","white")
    //           .attr("stroke-opacity","0.8")
    //           .attr("stroke-width", "3px")
    //           .text(function(d) { return d.tag });

    //         gnn.append("text")
    //           .attr("dx", function(d){return d.x})//d.radius-d.radius/2})
    //           .attr("dy", function(d){return d.y})//d.radius-d.radius/3})
    //           .attr("font-size",function(d){return textScale(d.radius)+"px"})
    //           .attr("stroke",function(d,i){
    //                   return (i < selectedNodes.length-1) ? "rgb(34, 121, 179)" : "red"
    //           })
    //           .attr("stroke-opacity","0")
    //           .attr("stroke-width",function(d){return textStrokeScale(d.radius)+"px"})
    //           .text(function(d) { return d.tag })
    //          .transition()
    //           .ease("cubic-in")
    //             .attr("stroke-opacity", "1")
    //           .duration(500);

    //         // node.selectAll("text")
    //         //   .attr("stroke-opacity","0.3")
    //         //   .transition()
    //         //   .ease("cubic-in")
    //         //    .attr("stroke-opacity", "0")
    //         //   .duration(500);
                
               

    //   }  

    //   function mouseout(d) {
    //      // node.selectAll("image").attr("opacity",0)
    //      // .transition()
    //      //      .ease("cubic-in")
    //      //      .attr("opacity", 1)
    //      //    .duration(500);

    //       d3.selectAll(".linkA")
    //           .remove();
    //   }

    // }
    

    function updateChart(containerID, ontology){
      var tickCount = 10;
      

      var values = ontology.tags.map(function(l){return l.value})
      var lvalues = ontology.links.map(function(l){return l.value})
      
      
      var scale = d3.scale.linear()
                      .domain([d3.min(values),d3.max(values)])
                      .range([10,32])

      
      // var textScale = d3.scale.ordinal()
      //                 .domain(scale.range())
      //                 .rangePoints([10,18])

      // var textStrokeScale = d3.scale.ordinal()
      //                 .domain(scale.range())
      //                 .rangePoints([0.5,1])


      // var linkStrangeScale = d3.scale.linear()
      //                 .domain([d3.min(lvalues),d3.max(lvalues)])
      //                 .range([0,1])                

      var linkStrokeScale = d3.scale.linear()
                      .domain([d3.min(lvalues),d3.max(lvalues)])
                      .range([2,8])   

      var words = ontology.tags.map((item,i) => {
        return {
          text  : item.tag,
          size  : Math.round(scale(item.value)), 
          index : i,
          key   : item.key,
          property : item.property,
          query : item.query
        }
      })
      console.log("words", words)
      var links = ontology.links.map((item) => {
        return {
                  source:words[item.source], 
                  target:words[item.target], 
                  value:linkStrokeScale(item.value)
               }
      })

      var width = d3.select("#"+containerID + '-cloud').node().getBoundingClientRect().width;

      d3.layout.cloud()
        .size([width, width])
        .padding(7)
        .words(words)
        .rotate(0)//function() { return ~~(Math.random()*2) * 90;}) // 0 or 90deg
        .fontSize(function(d) { return d.size; })
        .on('end', drawCloud)
        .start();

      
      function drawCloud(words) {
         d3.select('#'+containerID+'-cloud').selectAll("svg").remove();

        var labels = d3.select('#'+containerID+'-cloud').append('svg')
          .attr('width', width).attr('height', width)
          .append('g')
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', function(d) { return d.size + 'px'; })
          // .style('font-family', function(d) { return d.font; })
          .style('fill', function(d, i) { return "#999999"})
          .style("cursor","pointer")
          .attr('text-anchor', 'middle')
          .attr('transform', function(d) {
            return 'translate(' + (width/2-d.x)+"," + (width/2-d.y) + ')'//rotate(' + d.rotate + ')';
          })
          .text(function(d) { return d.text; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .on("click",click);




          var svg = d3.select('#'+containerID+'-cloud').select("svg");
          var g = svg.select("g");
          var rect = g.node().getBBox();

          g.attr("transform", function(d) {
           
           return "translate(" 
                + (width/2-(rect.x+rect.width/2)) 
                + "," 
                + (-rect.y) 
                + ")"; 
          });
          svg.attr("height",rect.height);

         
         function mouseover(cd) {
          
          var connectedWords = [];
          links.forEach((item) => {
            if(item.source.index == cd.index){
                connectedWords.push(item.target)
            }
            if(item.target.index == cd.index){
                connectedWords.push(item.source)
            }
          }) 

         
          d3.select(this)
            .transition()
              .ease("cubic-in")
                .style("fill","#CF2A0E")
              .duration(500);


            labels
            .filter((d) => {
              return connectedWords.filter((w) => {
                return w.index == d.index
              }).length > 0
            })
            .transition()
              .ease("cubic-in")
                .style("fill","rgb(34, 121, 179)")
               .duration(500);

            labels
            .filter((d) => {
              return connectedWords.filter((w) => {
                return w.index == d.index
              }).length == 0 && d.index != cd.index
            })
            .transition()
              .ease("cubic-in")
                .style("fill-opacity", 0)
               .duration(500);       
        }

        function mouseout(d) {
          labels
          .transition()
              .ease("cubic-in")
                .style("fill", "#999999")
                .style("fill-opacity",1)
               .duration(100);  
        }

        function click(d){
          console.log("click",d)
          eventEmitter.emit('setLookupKey', d.key);
          // let tmp = {};
          // tmp[d.property.split(".").slice(1).join(".")] = [{includes:d.key}];
          // let query = [tmp];
          let query = d.query.split("{{}}").join(d.key)
          eventEmitter.emit('searchQuery', query);
        } 


       } 



    }
    
    




    
    $scope.refresh = function(){
      load();
    }

    var defaultIcon = {
      author : "./img/author.png",
      topic  : "./img/topic.png",
      source : "./img/source.png",
      indicator : "./img/indicator.png"
    }

    function translate(){
      
      $scope.nodes = [];
      $scope.links = [];
      $scope.ontology.links.forEach( (item) => {
        $scope.links.push({
          source : item.source,
          target : item.target,
          value  : item.value
        })
      }) 
      
      $scope.ontology.tags.forEach((item) => {
        let obj = $lookup(item.tag); 
        $scope.nodes.push({
          tag: (obj.label) ? obj.label : item.tag,
          key: item.tag,
          property: item.property,
          query: item.query,
          icon: (obj.icon) ? obj.icon : defaultIcon[item.meta],
          meta: item.meta,
          value:item.value
        })
      });
    
      let translatePromises = [];
      
      $scope.nodes.forEach((item) => {  
          translatePromises.push($translate(item.tag).then((translation) => {item.tag = translation}))
      })

      $q.all(translatePromises).then(() => {
        $scope.resp = $scope.nodes;
         // $scope.visibility = true;
        setTimeout(function(){
            updateChart($scope.cloudContainerID, {tags:$scope.nodes, links:$scope.links})
        },0);    
       
      })
    }


    function load(){
     
      // $http.post("./api/metadata/tag/dependencies",
        $dps.post("/api/metadata/tag/dependencies",
          {
            "status":"public",
            "tags":[
                  {
                    "meta":"indicator",
                    "property":"$..metadata.dimension.concept.values..label",
                    "query":"$[?(@.dimension.concept.values.contains(function(d){return d.label.startWith('{{}}')}))]"
                  },
                  {
                    "meta":"topic",
                    "property":"$..metadata.dataset.topics",
                    "query":"$[?(@.dataset.topics.contains(function(d){return d.startWith('{{}}')}))]"
                  },
                  {
                    "meta":"source",
                    "property":"$..metadata.dataset.source",
                    "query":"$[?(@.dataset.source.startWith('{{}}'))]"
                  }
              ]
          }
      ).success(function(resp){
            $scope.ontology = resp;
            translate();
      });
  }     


   var addListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            return;
          }
        }
        subscriptions.push(listener);
      };
      
    var removeListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            subscriptions.splice(i, 1);
            return
          }
        }
      };


    $scope.visibility = false;
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
          $scope.cloudContainerID ="cloud-"+$scope.widget.instanceName;

          $scope.lookupListeners = ($scope.widget.lookupListeners) ? $scope.widget.lookupListeners.split(",") : [];
          
         pageSubscriptions().removeListeners({
              emitter: $scope.widget.instanceName,
              signal: "setLookupKey"
          })

            pageSubscriptions().addListeners(
              $scope.lookupListeners.map((item) =>{
                return {
                    emitter: $scope.widget.instanceName,
                    receiver: item.trim(),
                    signal: "setLookupKey",
                    slot: "setLookupKey"
                }
              })
            );
 

          // for(var i in $scope.lookupListeners){
          //   $scope.lookupListeners[i] = $scope.lookupListeners[i].trim();
          //   // console.log($scope.widget.instanceName,$scope.lookupListeners[i]);
          //   addListener({
          //         emitter: $scope.widget.instanceName,
          //         receiver: $scope.lookupListeners[i],
          //         signal: "setLookupKey",
          //         slot: "setLookupKey"
          //       });
          // }

          $scope.searchListeners = ($scope.widget.searchListeners) ? $scope.widget.searchListeners.split(",") : [];
          
          pageSubscriptions().removeListeners({
              emitter: $scope.widget.instanceName,
              signal: "searchQuery"
          })

            pageSubscriptions().addListeners(
              $scope.searchListeners.map((item) =>{
                return {
                    emitter: $scope.widget.instanceName,
                    receiver: item.trim(),
                    signal: "searchQuery",
                    slot: "searchQuery"
                }
              })
            );
          
          // for(var i in $scope.searchListeners){
          //   $scope.searchListeners[i] = $scope.searchListeners[i].trim();
          //   // console.log($scope.widget.instanceName,$scope.searchListeners[i]);
          //   addListener({
          //         emitter: $scope.widget.instanceName,
          //         receiver: $scope.searchListeners[i],
          //         signal: "searchQuery",
          //         slot: "searchQuery"
          //       });

           pageSubscriptions().removeListeners({
              receiver:  $scope.widget.instanceName,
              signal: "slaveVisibility",
          })

          if($scope.widget.masterWidget){
            addListener({
                  emitter:$scope.widget.masterWidget,
                  receiver:  $scope.widget.instanceName,
                  signal: "slaveVisibility",
                  slot: "slaveVisibility"
              });
          }   



        load();
      })
      .provide('refresh', (evt) => {$scope.refresh()})
      .provide("slaveVisibility", (evt, value) => {
        // console.log("slaveVisibility",evt, value)
        $scope.visibility = value;
      })
      .translate( () => {translate()})
      .removal( () => { console.log('Tag Cloud widget is destroyed')});

  });




