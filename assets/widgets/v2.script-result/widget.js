import angular from 'angular';
import 'ng-ace';
import "pretty-data";

console.log("pretty-data", pd)
let m = angular.module('app.widgets.v2.script-result', ['ng.ace'])


// var rx = {
//     entities: /((&)|(<)|(>))/g,
//     json: /"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|(null))\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
// };
// // mapping of chars to entities
// var entities = ['&amp;','&lt;','&gt;'];
// // lookup of positional regex matches in rx.json to CSS classes
// var classes = ['number','string','key','boolean','null'];
// var reverseCoalesce = function reverseCoalesce() {
//     var i = arguments.length - 2;
//     do {
//       i--;
//     } while (!arguments[i]);
//     return i;
//   };

// var markup = function markup(match) {
//     var idx;
//       // the final two arguments are the length, and the entire string itself;
//       // we don't care about those.
//       if (arguments.length < 7) {
//         throw new Error('markup() must be called from String.prototype.replace()');
//       }
//       idx = reverseCoalesce.apply(null, arguments);
//       return match;
//     };

// var makeEntities = function makeEntities() {
//     var idx;
//     if (arguments.length < 5) {
//       throw new Error('makeEntities() must be called from String.prototype.replace()');
//     }
//     idx = reverseCoalesce.apply(null, arguments);
//     return entities[idx - 2];
//   };
        
var prettify = function(context){
    if(['html','xml'].indexOf(context.key) >=0 ){
        return pd.xml(context.data)
    }
    if(angular.isString(context.data)){
        return context.data
    }
    return pd.json(context.data)
}




m.controller('ScriptResultController', 
    function($scope, APIProvider) {
    
    $scope.settings = {
        options:{
            mode: 'text',
            theme: 'tomorrow'
        },
        type: 'text',
        data: 'Script Result Viewer\n Supported types: text, xml, html, csv, javascript, json, dps'
    }

    var supportedMode = {
        text:           "text", 
        string:         "text", 
        xml:            "xml", 
        csv:            "csv", 
        javascript:     "javascript", 
        json:           "json",
        object:         "json",
        "function":     "json", 
        dps:            "dps",
        dataset:        "json",
    }

    var extention = {
        help:           "json",
        html:           "html", 
        json:           "json", 
        table:          "json",
        error:          "json",
        bar:            "json",
        hbar:           "json",
        line:           "json",
        area:           "json",
        scatter:        "json",
        radar:          "json",
        deps:           "json",
        pie:            "json"    
    }

    
    new APIProvider($scope)
        .config(() => {
            console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        })
        .provide('setData', (e, context) => {
            if (!context) {
                $scope.hidden = true;
                return
            }
            
            var mode = supportedMode[context.key];
            
            if($scope.widget.extention){
                mode = mode || extention[context.key]
            }

            if(mode){
                $scope.hidden = false;
                $scope.settings = {
                    options:{
                        mode: mode,
                        theme: "tomorrow"
                    },
                    type: context.key,
                    data: prettify(context)
                }
            }else{
                $scope.hidden = true;
            }
    
        })
        .removal(() => {
            console.log('Result Script widget is destroyed');
        });
})
