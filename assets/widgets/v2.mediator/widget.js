import angular from 'angular';
import 'ng-ace';


let m = angular.module('app.widgets.v2.mediator', [
    'app.dps',
    "ng.ace"
])


m.controller('MediatorController', function(
    $scope,
    $http,
    $dps,
    EventEmitter,
    APIProvider,
    pageSubscriptions,
    $lookup,
    $translate,
    $modal,
    user,
    i18n,
    $scroll,
    clipboard,
    dialog,
    $error,
    log,
    instanceNameToScope,
    config,
    $info,
    app,
    logIn,
    splash) {

    const eventEmitter = new EventEmitter($scope);
    const apiProvider = new APIProvider($scope);

    var __script;

    // $scope.options = {
    //     mode:'dps', 
    //     theme:'tomorrow',
    //     onChange: function(e){
    //      __script = e[1].getSession().getValue();
    //     }
    // }

    $scope.options = {
        mode: 'javascript',
        theme: 'tomorrow',
        onChange: function(e) {
            __script = e[1].getSession().getValue();
        }
    }

    $scope.getEditorScript = function() {
        return __script;
    }

    $scope._api = {

        widget: function(widgetName) {
            return instanceNameToScope.get(widgetName)
        },

        config: () => config,
        user: () => user,
        app: () => app,
        logIn: logIn,

        provide: function(params) {
            let event = params.event;
            let widgets = params.widgets;
            let callback = params.callback;
            widgets = widgets || [];
            widgets = (widgets.forEach) ? widgets : [widgets]

            apiProvider.provide(event, callback)

            widgets.forEach((w) => {

                pageSubscriptions().removeListeners({
                    emitter: w,
                    receiver: $scope.widget.instanceName,
                    signal: event,
                    slot: event
                })

                pageSubscriptions().addListener({
                    emitter: w,
                    receiver: $scope.widget.instanceName,
                    signal: event,
                    slot: event
                })
            })
        },

        addListeners: function(params) {
            let event = params.event;
            let widgets = params.widgets;
            widgets = widgets || [];
            widgets = (widgets.forEach) ? widgets : [widgets]
            widgets.forEach((w) => {

                pageSubscriptions().removeListeners({
                    emitter: $scope.widget.instanceName,
                    receiver: w,
                    signal: event,
                    slot: event
                })

                pageSubscriptions().addListener({
                    emitter: $scope.widget.instanceName,
                    receiver: w,
                    signal: event,
                    slot: event
                })
            })
        },

        emit: function(event, data) {
            eventEmitter.emit(event, data)
        },

        error: function(...args){
            let messages = 
                args.map((item) =>{
                    if(item.toString && item.toString().indexOf("[") !== 0){
                        return item.toString()
                    }
                    if(angular.isString(item)) return item;
                    return JSON.stringify(item)
                }).join("\n");
            $error({
                name:'Mediator script "'+ $scope.widget.instanceName+'" error',
                message: messages
            })
        },

        info: function(message){
            $info(message)
        },

        splash: function(message){
            splash(message)
        },

        dialog: function(form){
            return dialog(form)
        },

        runDPS: function(params){
        
            let script = params.script;
            let storage = params.state;
            
            let state = {
                storage: storage,
                locale: i18n.locale()
            }

            return $dps.post("/api/script", {
                        "script": script,
                        "state": state
                    })
                    .then(function(response) {
                        return {
                            type: response.data.type,
                            data: response.data.data
                        }
                    })    
        }

    }

    $scope.run = function() {
        try{
            pageSubscriptions().removeListeners({
                emitter: $scope.widget.instanceName
            })

            pageSubscriptions().removeListeners({
                receiver: $scope.widget.instanceName
            })
            
            $scope.$eval(eval("(function($scope){ "
                                +"return (function(API, api, Api, $api){" 
                                    + $scope.widget.script 
                                + "})($scope._api, $scope._api, $scope._api, $scope._api)"
                                +"})"
            ))
        } catch(e) {
           $error({
                name:"Mediator script "+ $scope.widget.instanceName+' error',
                message: e.toString()
            }) 
        }    
    }

    $scope.runScript = function(){
        app.markModified();
        $scope.widget.script = $scope.getEditorScript();
        $scope.run();
    }

    apiProvider
        .config(() => {
            if(!$scope.globalConfig.designMode)
                $scope.run()
        })
        // .openCustomSettings(function() {
        //     return dialog({
        //             title: "Mediator Script settings",
        //             fields: {
        //                 listeners: {
        //                     title: "Listeners",
        //                     type: "text",
        //                     value: $scope.widget.listeners,
        //                     required: false
        //                 }
        //             }
        //         })
        //         .then(function(form) {
        //             $scope.widget.listeners = form.fields.listeners.value;
        //             $scope.widget.script = $scope.getEditorScript();
        //         })
        // })

    .removal(() => {
        console.log('Mediator widget is destroyed');
    });
})
