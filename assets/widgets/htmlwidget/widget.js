import angular from 'angular';
angular.module('app.widgets.htmlwidget', [])
    .controller('HtmlWidgetController', function(
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
        $sce
        ) {


        const eventEmitter = new EventEmitter($scope);
        const apiProvider = new APIProvider($scope);

        
        $scope.$api = $scope.api = $scope.Api = $scope.API = {


            widget: function(widgetName) {
                return instanceNameToScope.get(widgetName)
            },

            config: () => config,
            user: () => user,
            app: () => app,
            logIn: () => logIn,

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

        $scope.update = function(data){
            let container = ($scope.globalConfig.designMode)
                        ? $scope.container.getElement().find('div')[2]
                        : $scope.container.getElement().find('div')[1];

            container.innerHTML = '';
            let content = angular.element('<div>'+data+'</div>')[0];
            
            angular.element(container).append(content)                                
            angular.element(container)
                    .injector()
                    .invoke(function($compile) {
                          var scope = angular.element(content).scope();
                          $compile(content)(scope);
                    });
        }

        apiProvider
            .config(() => {
                $scope.update($scope.widget.text)
                // $scope.test = "TEST";
                // $scope.API = $scope.API;
                // $scope.text = $sce.trustAsHtml($scope.widget.text);
            })

            .provide('updateWithData', (e, context) => {
                if (!context) return

                if (context.widget) {
                    context.widget = (context.widget.forEach) ? context.widget : [context.widget]
                }

                if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {
                     $scope.update(context.data)
                    

                    if (context.options){
                        $scope.hidden = context.options.hidden;
                    }
                }


            })

            .provide('updateWithOptions', (e, context) => {
                if (!context) return

                if (context.widget) {
                    context.widget = (context.widget.forEach) ? context.widget : [context.widget]
                }

                if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {

                    $scope.hidden = context.options.hidden;
                }
            })

            .provide('setData', (e, context) => {
                if (!context) {
                    $scope.text = ""
                        // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                    $scope.hidden = true;
                    return
                }
                if (context.key == "html") {
                    $scope.update(context.data)
                    // $scope.text = $sce.trustAsHtml(context.data)
                        // $scope.container.getElement()[0].children[0].children[0].innerHTML = context.data;
                    $scope.hidden = false;
                } else {
                    $scope.hidden = true;
                    $scope.text = ""
                        // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                }
            })

    });
