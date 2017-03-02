import angular from 'angular';
import 'widgets/v2.data-selector/wizard';


const m = angular.module('app.widgets.v2.tag-selector', ["app.dps",
    'app.widgets.v2.data-selector-wizard'
]);


m.controller('TagSelectorCtrlV2', function(
    $scope,
    $http,
    $dps,
    APIProvider,
    EventEmitter,
    dialog) {

    $scope.emitter = new EventEmitter($scope);

    var Selector = function() {
        this.objects = $scope.selectorData;

        this.add = (key) => {
            let ff = this.objects.filter(item => item.key === key)
            if (ff.length == 0) {
                let res = {
                    key: key,
                    disabled: true
                }
                this.objects.push(res)
                return res
            }
            return ff[0]
        }

        this.selected = () => {
            return this.objects.filter(item => !item.disabled)
        }

        this.unselected = () => {
            return this.objects.filter(item => item.disabled)
        }

        this.selectOneObject = (objectKey) => {
            objectKey = objectKey.trim();
            this.objects.forEach((o) => {
                    if (o.key == objectKey) {
                        o.disabled = false;
                    } else {
                        o.disabled = true
                    }
                })
                // console.log("Emit selectObject1")
                // $scope.emitter.emit("selectObject",this.objects);  
        };

        this.inverseObjectSelection = () => {
            this.objects.forEach((o) => { o.disabled = !!!o.disabled })
        }

        this.clear = () => {
            this.objects.forEach((item) => { item.disabled = true; })
        }

        this.selectObject = (objectKey) => {

            let selectedObject = this.objects.filter((o) => o.key === objectKey)[0];
            selectedObject.disabled = !selectedObject.disabled;
            if (this.objects.filter((o) => !o.disabled).length == 0) {
                selectedObject.disabled = !selectedObject.disabled;
                this.inverseObjectSelection();
            }
            // console.log("Emit selectObject2")
            // $scope.emitter.emit("selectObject",this.objects);  
        }

        this.emit = function() {
            $scope.emitter.emit("selectObject", this.objects);
        }

    }

    $scope.$parent.getSelectorData = (list) => {


        $scope.selectorData = list;

        $scope.selector = new Selector();
        $scope.selected = [];
        $scope.unselected = $scope.selectorData.map(item => item);
    }

    $scope.$watch('selectorData', function(newList, oldList) {
        // console.log("selectorData changed")
        // if(newList == oldList) return;
        if (newList && newList.forEach) {
            $scope.selector = new Selector();
            $scope.selected = [];
            $scope.unselected = newList.map(item => item);
        }
    })

    $scope.select = (key) => {

        let item = $scope.selector.add(key);
        $scope.selector.selectObject(key)
        $scope.selected = $scope.selector.selected()
        $scope.unselected = $scope.selector.unselected()


        // let index = -1;

        // for (let i in $scope.unselected){
        //   if($scope.unselected[i].key == item.key){
        //     index = i;
        //     break;
        //   }
        // }

        // if(index == -1){
        //   $scope.unselected.push(item)
        //   index = $scope.unselected.length-1;  
        // } 

        // $scope.selected.push($scope.unselected[index])
        // $scope.unselected.splice(index,1);
        // $scope.selector.selectObject(key)
        // $scope.selectedObject = undefined;
    }

    $scope.unselect = (key) => {
        if ($scope.selected.length < 2) return;
        let index = -1;
        for (let i in $scope.selected) {
            if ($scope.selected[i].key == key) {
                index = i;
                break;
            }
        }

        $scope.unselected.push($scope.selected[index])
        $scope.selected.splice(index, 1)
        $scope.selector.selectObject(key)
            // $scope.lock = false;
    }

    $scope.keyFounded = (key) => {
        if (!key) return false;
        if (!$scope.unselected) return false;
        return $scope.unselected.filter(o => o.key == key)[0]
    }

    $scope.keydown = function(event) {
        // console.log(event.key)
        if (event.key == "Enter") {
            // console.log("add user tag ", $scope.inputKey)

            $scope.select($scope.inputKey)
                // $scope.lock = true;
        }
    }

    $scope.change = function(value) {
        $scope.inputKey = value;
        // console.log($scope.inputKey)
    }



    new APIProvider($scope)

    .config(() => {})

    .openCustomSettings(function() {
        dialog({
            title: "Tag selector settings",
            fields: {
                title: {
                    title: "Widget title",
                    type: "text",
                    value: $scope.widget.title,
                    required: false
                },
                view: {
                    title: "Widget view",
                    type: "select",
                    value: $scope.widget.view || 'Grid',
                    options: ['Select', "List", "Grid", "Typeahead"],
                    required: false
                },

                button: {
                    title: "Button label",
                    type: "text",
                    value: $scope.widget.button || "Go...",
                    required: false
                }
            }
        }).then(function(form) {
            $scope.widget.title = form.fields.title.value;
            $scope.widget.view = form.fields.view.value;
            $scope.widget.button = form.fields.button.value;
        })
    })

    .translate(() => {})

    .provide('updateWithData', (e, context) => {
        if (!context) return

        if (context.widget) {
            context.widget = (context.widget.forEach) ? context.widget : [context.widget]
        }

        if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {

            $scope.selectorData = context.data
        }

        if (context.options) {
            $scope.hidden = context.options.hidden;
            $scope.widget.decoration.title = (context.options.title) ? context.options.title : $scope.widget.decoration.title;
            $scope.widget.decoration.view = (context.options.view) ? context.options.view : $scope.widget.decoration.view; 
            $scope.widget.decoration.runnable = (context.options.view) ? context.options.runnable : $scope.widget.decoration.runnable; 
            $scope.widget.button = (context.options.button) ? context.options.button : $scope.widget.button; 
               
        }
    })

    .provide('updateWithOptions', (e, context) => {
        if (!context) return

        if (context.widget) {
            context.widget = (context.widget.forEach) ? context.widget : [context.widget]
        }

        if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {

            $scope.hidden = context.options.hidden;
            $scope.widget.decoration.title = (context.options.title) ? context.options.title : $scope.widget.decoration.title;
            $scope.widget.decoration.view = (context.options.view) ? context.options.view : $scope.widget.decoration.view; 
            $scope.widget.decoration.runnable = (context.options.view) ? context.options.runnable : $scope.widget.decoration.runnable; 
            $scope.widget.button = (context.options.button) ? context.options.button : $scope.widget.button; 
        }
    })
});
