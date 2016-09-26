import angular from 'angular';
import 'angular-foundation';


angular
  .module('app.widgets.v2.event-viewer', ['mm.foundation'])
  .controller('EventViewerController', 
    function ($scope, pageSubscriptions, APIProvider, i18n) {
  
  new APIProvider($scope)
    .config(() => {

      $scope.widget.timeFormat = $scope.widget.timeFormat || {
        flow: "YYYY",
        process: "MM.YYYY",
        instant: "dd DD/MM/YYYY"
      };
      
        
      if($scope.widget.emitters && $scope.widget.emitters.length &&
        $scope.widget.emitters.trim().length > 0){
          
        pageSubscriptions().removeListeners({
            receiver: $scope.widget.instanceName,
            signal: "timelineNavigate"
        });

        $scope.emitters = ($scope.widget.emitters) ? $scope.widget.emitters.split(",") : [];
          
        pageSubscriptions().addListeners(
          $scope.emitters.map((item) =>{
            return {
                emitter: item.trim(),
                receiver: $scope.widget.instanceName,
                signal: "timelineNavigate",
                slot: "timelineNavigate"
            }
          })
        );

      }else{

        pageSubscriptions().removeListeners({
            receiver: $scope.widget.instanceName,
            signal: "timelineNavigate"
        });

      }

    })
    
    .provide("timelineNavigate", (e,d) => {

      
      if(!d || !d.data){
        $scope.context = undefined;
      }else{

       
       var timeStamp = (d.data.type == "instant")
          ? i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.instant)
          : (d.data.type == "process")
            ? (i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.process) === i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.process)) 
              ? i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.instant)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.instant)
              : i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.process)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.process)
            : (i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.flow) === i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.flow))
              ? i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.process)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.process)
              : i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.flow)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.flow)
         
       // var timestamp = (d.data.type == "instant")
       //    ? i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.instant)
       //    : (d.data.type == "process")
       //      ? i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.process)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.process)
       //      : i18n.timeFormat(d.data.originalStart,$scope.widget.timeFormat.flow)+" - "+i18n.timeFormat(d.data.originalEnd,$scope.widget.timeFormat.flow)
         
        var tmp = d.dict.lookup(angular.copy(d.data.context));
        $scope.context = {
          // start : i18n.timeFormat(d.data.originalStart,"MMM YYYY"),
          // end : i18n.timeFormat(d.data.originalEnd,"MMM YYYY"),
          timestamp:timeStamp,
          type : d.data.type,
          context:{
            color: d.data.color,
            headline:d.tr.lookup(tmp.headline),
            text:d.tr.lookup(tmp.text),
            media: d.tr.lookup(tmp.media),
            url:(tmp.url)
                ? {
                    href : d.tr.lookup(tmp.url.href),
                    label : decodeURIComponent(d.tr.lookup(tmp.url.href))
                  }
                : undefined   
          }
        }
      }
    })
    
    .translate(()=>{
    })

   
    
})