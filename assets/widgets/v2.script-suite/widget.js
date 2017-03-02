import angular from 'angular';
// import 'dictionary';
// import 'ngReact';
// import 'custom-react-directives';
// import 'ng-prettyjson';
import 'ng-ace';


let m = angular.module('app.widgets.v2.script-suite', [
    // 'app.dictionary',
    'app.dps',
    // 'ngFileUpload',
    // 'react',
    // 'custom-react-directives',
    // 'ngPrettyJson',
    "ng.ace"
])


m.controller('ScriptSuiteController', function(
    $scope, 
    APIProvider, 
    dialog, 
    app,
    i18n,
    $dps,
    EventEmitter,
    $error, 
    log,
    pageSubscriptions,
    $q
) {

    const eventEmitter = new EventEmitter($scope);
    
    $scope.notSaved = false;

    var __script;
    
    $scope.options = {
        mode:'dps', 
        theme:'tomorrow',
        onChange: function(e){
         __script = e[1].getSession().getValue();
         $scope.notSaved = true;
         $scope.collapsed = true;
         $scope.processed = false;
         $scope.successed = false;
         $scope.rejected = false;
         
         app.markModified()
        }
    }

    $scope.getEditorScript = function(){
        return __script;
    }

    $scope.keys = Object.keys;
    
    $scope.classed = function(index){
        if(!$scope.selected) return "row";
        return ($scope.keys($scope.widget.script)[index] == $scope.selected) ? "row selected": "row"
    }
    
    $scope.saveScript = () => {
        $scope.collapsed = true;
        $scope.widget.script[$scope.selected] = $scope.getEditorScript(); 
        $scope.notSaved = false;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
        app.markModified();
    }

    $scope.doDeleteScript = () => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        let index = $scope.keys($scope.widget.script).indexOf($scope.selected);
        $scope.select();
        let newSuite = {};
        let keys = $scope.keys($scope.widget.script);
        for(let i=0; i < keys.length; i++){
            if(keys[i] != keys[index]){
                newSuite[keys[i]] = $scope.widget.script[keys[i]]
            }
        }
       
        $scope.$evalAsync(function(){
            $scope.widget.script = newSuite; 
            index = (index > ($scope.keys($scope.widget.script).length-1))?$scope.keys($scope.widget.script).length-1 : index;
            $scope.select($scope.keys($scope.widget.script)[index])
        })

        app.markModified()
    }
    
    $scope.deleteScript = () => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        dialog({
            title:'Delete script "'+$scope.selected+'"?',
            form:{}
        })
        .then($scope.doDeleteScript)
    }
    $scope.doAddScript = (name, script) => {
        $scope.collapsed = true;
        $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
        $scope.widget.script[name] = (script)? script : ('// Write '+name+' script here')
        $scope.select(name);
        app.markModified();
    }

    $scope.addScript = () => {
        dialog({
            title:'Add script',
            fields:{
                name:{
                    title: 'Script name',
                    type:'text',
                    validate: function (form){return !$scope.widget.script[form.fields.name.value]}
                }
            }
        })
        .then((form) =>{
            $scope.doAddScript(form.fields.name.value)
        })
    }

    $scope.renameScript = () => {
        let temp = {
            script: $scope.widget.script[$scope.selected],
            name: $scope.selected
        }

        $scope.doDeleteScript();

        dialog({
            title:'Rename script',
            fields:{
                name:{
                    title: 'Script name',
                    type:'text',
                    value:temp.name,
                    validate: function (form){return !$scope.widget.script[form.fields.name.value]}
                }
            }
        })
        .then((form) =>{
            $scope.doAddScript(form.fields.name.value, temp.script)
        })
        .catch(() =>{
            $scope.doAddScript(temp.name, temp.script)
        })
    }

    $scope.select = (name) => {
        $scope.collapsed = true;
        // $scope.processed = false;
        $scope.successed = false;
        $scope.rejected = false;
       
            
        if($scope.selected) {
            $scope.saveScript()
        } else {
            $scope.collapsed = true;
        }    

        if(!name){
            $scope.selected = undefined;
            $scope.notSaved = false;
            return
        }

        $scope.script =  angular.copy($scope.widget.script[name]);
        $scope.selected = name;
        $scope.notSaved = false;
    }

    $scope.cancelProcess = () => {
        if($scope.canceler) $scope.canceler.resolve();
        $scope.canceled = true;
    }

    $scope.runScript = function() {
        $scope.canceled = false;
        if($scope.canceler) $scope.canceler.resolve();
        $scope.canceler = $q.defer();
        
        $scope.response = undefined;
        eventEmitter.emit('setData', undefined);
        $scope.saveScript(); 
        
        $scope.processed = true;
       
        
        $dps.post("/api/script", {
                "script": $scope.widget.script[$scope.selected],
                "locale": i18n.locale()
            },
            {timeout:$scope.canceler.promise})
            .then(function(response) {
                $scope.processed = false;
                response.data.key = response.data.type;
                if (response.data.key == 'error') {
                    $error(response.data.data)
                    $scope.response = {
                        key: "error",
                        data: response.data.data
                    }
                    $scope.rejected = true;
                    eventEmitter.emit('setData', $scope.response);
                } else {
                    $scope.successed = true;
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
            $scope.widget.script = $scope.widget.script || {}
            $scope.collapsed = ($scope.keys($scope.widget.script).length > 0)
            
            if($scope.keys($scope.widget.script).length > 0 && $scope.globalConfig.designMode){
                $scope.select($scope.keys($scope.widget.script)[0])
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
                    title: "DJ dps Suite settings",
                    fields: {
                        d_listeners: {
                            title: "Listeners",
                            type: "text",
                            value: $scope.widget.d_listeners,
                            required: false
                        }
                    }
                })
                .then(function(form) {
                    $scope.widget.d_listeners = form.fields.d_listeners.value;
                    })
        })

        .removal(() => {
            console.log('Script widget is destroyed');
        });
})
