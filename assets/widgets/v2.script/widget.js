import angular from 'angular';
// import 'dictionary';
// import 'ngReact';
// import 'custom-react-directives';
// import 'ng-prettyjson';
import 'ng-ace';


let m = angular.module('app.widgets.v2.script', [
    // 'app.dictionary',
    'app.dps',
    // 'ngFileUpload',
    // 'react',
    // 'custom-react-directives',
    // 'ngPrettyJson',
    "ng.ace"
])


m.controller('ScriptController', function($scope, $http, $dps, EventEmitter,
    APIProvider, pageSubscriptions, $lookup, $translate, $modal,
    user, i18n, $scroll, clipboard, dialog, $error, log) {

    const eventEmitter = new EventEmitter($scope);
    
    var __script;
    
    $scope.options = {
        mode:'dps', 
        theme:'tomorrow',
        onChange: function(e){
         __script = e[1].getSession().getValue();
        }
    }

    $scope.getEditorScript = function(){
        return __script;
    }    

    $scope.examples = [{
            title: "DJ DPS version",
            url: "./widgets/v2.script/scripts/version.dps"
        }, {
            title: "DJ DPS help",
            url: "./widgets/v2.script/scripts/help.dps"
        }, {
            title: "Working with metadata",
            url: "./widgets/v2.script/scripts/metadata.dps"
        }, {
            title: "Find data",
            url: "./widgets/v2.script/scripts/find_datasets.dps"
        }, {
            title: "Extend and translate",
            url: "./widgets/v2.script/scripts/translate.dps"
        }, {
            title: "Get info from metadata",
            url: "./widgets/v2.script/scripts/custom-info.dps"
        }, {
            title: "Data Cube Projection",
            url: "./widgets/v2.script/scripts/projection.dps"
        }, {
            title: "Table Postprocessing",
            url: "./widgets/v2.script/scripts/postprocess.dps"
        }, {
            title: "Table Analitics",
            url: "./widgets/v2.script/scripts/analitics.dps"
        }, {
            title: "Data Normalization",
            url: "./widgets/v2.script/scripts/normalization.dps"
        }, {
            title: "Join tables",
            url: "./widgets/v2.script/scripts/join.dps"
        }, {
            title: "Correlation matrix",
            url: "./widgets/v2.script/scripts/corr.dps"
        }, {
            title: "Clusters",
            url: "./widgets/v2.script/scripts/clusters.dps"
        }, {
            title: "PCA (Scores)",
            url: "./widgets/v2.script/scripts/scores.dps"
        }, {
            title: "PCA (Eigen Values)",
            url: "./widgets/v2.script/scripts/ev.dps"
        }, {
            title: "Data Visualization. Vertical Bar Chart",
            url: "./widgets/v2.script/scripts/bar.dps"
        }, {
            title: "Data Visualization. Horizontal Bar Chart",
            url: "./widgets/v2.script/scripts/hbar.dps"
        }, {
            title: "Data Visualization. Radar Chart",
            url: "./widgets/v2.script/scripts/radar.dps"
        }, {
            title: "Data Visualization. Line Chart",
            url: "./widgets/v2.script/scripts/sample1.dps"
        }, {
            title: "Data Visualization. Area Chart",
            url: "./widgets/v2.script/scripts/area.dps"
        }, {
            title: "Data Visualization. Scatter Chart",
            url: "./widgets/v2.script/scripts/scatter.dps"
        }, {
            title: "Data Visualization. Dependency Exploration",
            url: "./widgets/v2.script/scripts/deps.dps"
        }, {
            title: "Export xlsx",
            url: "./widgets/v2.script/scripts/export-source.dps"
        }, {
            title: "Export csv",
            url: "./widgets/v2.script/scripts/export-table.dps"
        }

    ]


    $scope.getScript = function(s) {
        var e = $scope.examples.filter(item => item.title == s)[0]
        if (e) {
            if (e.script) {
                $scope.script = e.script
                $scope.settings = {
                    options: $scope.options,
                    data: $scope.script
                }
            } else {
                $http
                    .get(e.url)
                    .then(function(resp) {
                        e.script = resp.data;
                        $scope.script = e.script
                        $scope.settings = {
                            options: $scope.options,
                            data: $scope.script
                        }
                    })
            }
        }

    }

    $scope.selectedExample;

    $scope.$watch('selectedExample', (newValue, oldValue) => {
        // if (newValue !== oldValue) {
            $scope.getScript(newValue)
        // }
    });

        
    

    
    $scope.runScript = function() {
        $scope.response = undefined;
        eventEmitter.emit('setData', undefined);
        
        var s = ($scope.widget.editor) 
                    ? $scope.getEditorScript()
                    : $scope.script;
        
        $dps.post("/api/script", {
                "script": s,
                "key": $scope.key,
                "locale": i18n.locale()
            })
            .then(function(response) {
                response.data.key = response.data.type;
                if (response.data.key == 'error') {
                    $error(response.data.data)
                    $scope.response = {
                        key: "error",
                        data: response.data.data
                    }
                    eventEmitter.emit('setData', $scope.response);
                } else {
                    if (response.data.key == "url") {
                        $scope.response = {
                            data: {
                                success: $dps.getUrl() + response.data.data.url
                            },
                            key: "json"
                        }
                        window.open($dps.getUrl() + response.data.data.url, '_blank')
                    } else {
                        if(response.data.key == "log"){
                            log({ title: "", messages: response.data.data});
                            $scope.response = response.data 
                        }else{
                            $scope.response = response.data    
                        }
                    }
                    eventEmitter.emit('setData', $scope.response);
                }
            })
    }
    
    
    new APIProvider($scope)
        .config(() => {
            
            $scope.script = $scope.widget.script
            


            if (($scope.widget.examples)) {
                $scope.selectedExample = $scope.examples[0].title;
                $scope.getScript($scope.selectedExample)
            }

            $scope.examplesEnable = $scope.widget.examples;

            $scope.settings = {
                options: $scope.options,
                data: $scope.script
            }

            $scope.d_listeners = ($scope.widget.d_listeners) ? $scope.widget.d_listeners.split(",") : [];
            pageSubscriptions().removeListeners({
                emitter: $scope.widget.instanceName,
                signal: "setData"
            })

            $scope.response = {
                message: "Write script and execute it"
            };

            pageSubscriptions().addListeners(
                $scope.d_listeners.map((item) => {
                    return {
                        emitter: $scope.widget.instanceName,
                        receiver: item.trim(),
                        signal: "setData",
                        slot: "setData"
                    }
                })
            );

            eventEmitter.emit('setData', undefined);
        })

    .openCustomSettings(function() {
        return dialog({
                title: "DJ DP Script settings",
                fields: {
                    title: {
                        title: "Title",
                        type: "text",
                        value: $scope.widget.title,
                        required: false
                    },
                    examples: {
                        title: "Enable Examples",
                        type: "checkbox",
                        value: $scope.widget.examples
                    },
                    editor: {
                        title: "Enable Editor",
                        type: "checkbox",
                        value: $scope.widget.editor
                    },
                    runnable: {
                        title: "Enable Run",
                        type: "checkbox",
                        value: $scope.widget.runnable
                    },
                    hidden: {
                        title: "Hidden in presentation mode",
                        type: "checkbox",
                        value: $scope.widget.hidden || false
                    },
                    height: {
                        title: "Editor height in (em)",
                        type: "number",
                        min: 5,
                        value: $scope.widget.height || 20
                    },

                    // script: {
                    //     title: "DP Script",
                    //     type: "textarea",
                    //     value: $scope.script,
                    //     required: false
                    // },

                    d_listeners: {
                        title: "Listeners",
                        type: "text",
                        value: $scope.widget.d_listeners,
                        required: false
                    }
                }
            })
            .then(function(form) {
                $scope.widget.title = form.fields.title.value;
                $scope.widget.height = form.fields.height.value;
                $scope.widget.examples = form.fields.examples.value;
                $scope.widget.editor = form.fields.editor.value;
                $scope.widget.d_listeners = form.fields.d_listeners.value;
                $scope.widget.runnable = form.fields.runnable.value;
                $scope.widget.hidden = form.fields.hidden.value;
                $scope.widget.script = $scope.getEditorScript();//$scope.session.getValue();
                //$scope.script = $scope.widget.script; // = form.fields.script.value;
            })
    })

    .removal(() => {
        console.log('Script widget is destroyed');
    });
})
