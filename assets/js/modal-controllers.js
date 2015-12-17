import angular from 'angular';
import 'angular-foundation';
import 'angular-oclazyload';
import 'sceditor';
import 'template-cached-pages';

const modals = angular.module('app.modals', []);

modals.controller('WidgetModalSettingsController', function ($scope, $modalInstance, $timeout,
                                                          widgetScope, widgetConfig, widgetType,
                                                          app) {
  let data = angular.copy(widgetConfig);

  // split widgetConfig into basicProperties (not available in json-editor)
  // and data - everything else, modifiable in json-editor
  delete data.instanceName;
  delete data.type;
  delete data.icon;

  angular.extend($scope, {
    widgetScope,
    widgetType,
    widgetConfig: data,

    basicProperties: {
      type: widgetConfig.type,
      instanceName: widgetConfig.instanceName,
      icon: widgetConfig.icon
    },

    ok() {
      // Use $timeout as a fix for android
      // On mobile devices (at least android) `data` is updated AFTER `ng-click` event happens if
      // submit button is pressed while input fields are still focused.
      // this is probably related to touch vs mouse behaviour and underlying json-editor implementation.
      $timeout(() => {
        $modalInstance.close(angular.extend(data, $scope.basicProperties));
        app.markModified(true);
      }, 100);
    },

    cancel() {
      $modalInstance.dismiss();
    },

    updateData(value) {
      data = value;
    }
  });
});

modals.controller('WidgetModalAddNewController', function ($scope, $modalInstance, $log,
                                                        $timeout, $translate,
                                                        holder, appUrls,
                                                        widgetTypes) {
  // create array instead of map (easy filtering)
  const widgetTypesArr = [];

  for (let type in widgetTypes.data) {
    const currentWidget = {
      type
    };

    const translationId = `WIDGET.${type.toUpperCase()}.DESCRIPTION`;
    $translate(translationId).then(translation => {
      if (translation === translationId) {
        currentWidget.description = $translate.instant('WIDGET_HAS_NO_DESCRIPTION');
      } else {
        currentWidget.description = translation;
      }
    });

    // add path to icon of a widget
    if (widgetTypes.data[type].noicon) {
      currentWidget.icon = appUrls.defaultWidgetIcon;
    } else {
      currentWidget.icon = appUrls.widgetIcon(currentWidget.type);
    }
    widgetTypesArr.push(currentWidget);
  }

  angular.extend($scope, {
    widgetTypes: widgetTypesArr,
    chooseWidget(widget) {
      $scope.chosenWidget = widget;
      // no error as a widget was chosen
      $scope.widgetErr = {};
    },

    add(widget) {
      // checks whether chosen template belongs to the current filter criteria
      $scope.chosenWidget = widget;
      
      $modalInstance.close($scope.chosenWidget);
    },

    isSelected(widget) {
      $scope.chosenWidget === widget
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

modals.controller('AddNewPageModalController', function ($scope, $state, $modalInstance,
                                                      $translate, alert,
                                                      app, templateTypes, appUrls) {
  // TODO: Rewrite this piece of SH*T!

  // array of all template types
  const templateTypesArr = [];

  // create templateTypesArr out of templateTypes map
  for (let type in templateTypes.data) {
    const currentTemplate = {
      type,
      description: templateTypes.data[type].description,
      holders: templateTypes.data[type].holders,
      icon: appUrls.templateIcon(type)
    };

    templateTypesArr.push(currentTemplate);
  }

  $scope.settings = {

    href: "",

    // check whether shortTitle is correct (isn't empty for now)
    checkShortTitle() {
      $scope.titleErr = {};
      if (!$scope.settings.shortTitle) {
        $scope.titleErr.message = $translate.instant('FIELD_MUSTNT_BE_EMPTY');
        $scope.titleErr.class = 'red';
        return false;
      }
      return true;
    },

    templateTypes: templateTypesArr,

    // add button action
    add() {
      if (!$scope.settings.checkShortTitle()) {
        return;
      }

       //if chosen template isn't in the current filter then show an error
      if (!$scope.settings.chosenTemplate) {
        $scope.chosenTemplate = {};
        $scope.templateErr = {};
        $scope.templateErr.message = $translate.instant('CHOOSE_A_TEMPLATE');
        $scope.templateErr.class = 'red';
        return;
      }

      const page = {
        shortTitle: $scope.settings.shortTitle,
        href: $scope.settings.href,
        template: $scope.settings.chosenTemplate.type,
        holders: {}
      };

      for (let holderName of $scope.settings.chosenTemplate.holders) {
        page.holders[holderName] = {
          widgets: []
        };
      }

      app.addNewPage(page);

      // redirect to the new page
      $state.go('page', {href: $scope.settings.href}, {reload: true});
      $modalInstance.close();
    },

    chooseTemplate(template) {
      $scope.settings.chosenTemplate = template;
      // don't show any error message
      $scope.templateErr = {};
    },

    cancel() {
      $modalInstance.dismiss();
    },

    isSelected(template) {
      return $scope.settings.chosenTemplate === template;
    }
  };
});

modals.controller('PageSettingsModalController', function ($scope, $state, $modalInstance,
                                                           $translate, alert,
                                                           app, page) {
  $scope.settings = {
    href: page.href,
    shortTitle: page.shortTitle
  };

  angular.extend($scope, {
    // check whether shortTitle is correct (isn't empty for now)
    checkShortTitle() {
      this.titleErr = {};
      if (!this.settings.shortTitle) {
        this.titleErr = true;
        this.titleErr.message = $translate.instant('FIELD_MUSTNT_BE_EMPTY');
        this.titleErr.class = 'red';
        return false;
      }
      return true;
    },

    // add button action
    save() {
      if (!this.checkShortTitle()) {
        return;
      }

      // if nothing changes - emulate pressing cancel button.
      for (let prop in this.settings) {
        if (this.settings[prop] !== page[prop]) {
          angular.extend(page, $scope.settings);
          $modalInstance.close();
          return;
        }
      }
      this.cancel();
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

modals.controller('ShareSettingsModalController', function ($scope, $modalInstance, $http, author, appUrls, config) {
  angular.extend($scope, {
    author,
    collaborations: angular.copy(config.collaborations) || [], // TODO: change to collaborations

    getUsers(filterValue) {
      // todo: add support for filterValue
      return $http.get(appUrls.usersList).then(result =>
          /* Hack: filters do not work in angular-foundation's typeahead view for some reason */
          result.data
            .filter(user => !this.userIsCollaborator(user))
            .filter(user =>
            user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            user.email.toLowerCase().includes(filterValue.toLowerCase())
          )
            .slice(0, 8)
      );
    },

    addCollaboration() {
      this.collaborations.push({
        user: {
          id: this.selectedUser.id,
          name: this.selectedUser.name,
          email: this.selectedUser.email
        },
        access: undefined // todo: add support for edit/view access rights
      });
    },

    deleteCollaboration(userId) {
      this.collaborations.splice(this.collaborations.findIndex(user => user.id === userId), 1);
    },

    userIsCollaborator(user) {
      const isOwner = user.id === (author || {}).id;
      return isOwner || this.collaborations.find(c => c.user.id === user.id);
    },

    ok() {
      $modalInstance.close(this.collaborations);
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

modals.controller('AppSettingsModalController', function ($scope, $modalInstance,
                                                          appName, appSkins, config) {
  angular.extend($scope, {
    settings: {
      isPublished: config.isPublished,
      name: config.name,
      skinName: config.skinName,
      keywords: config.keywords.join(", "),
      title: config.title,
      description: config.description,
      icon:config.icon
    },
    skins: appSkins,

    ok() {
      this.settings.keywords = this.settings.keywords.split(",");
      
      for(let i in this.settings.keywords){
        this.settings.keywords[i] = this.settings.keywords[i].trim();  
      }

      // this.settings.keywords.forEach((item) => {item = item.trim()})
      $modalInstance.close(this.settings);
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

modals.controller('ResourceManagerController', function (  $scope, $http, $upload, appName,
                                                            dialog, clipboard, $modalInstance) {
    
  
    $scope.appName = appName;
    $scope.upload_process = true;
        

    
    $scope.copyToClipboard = function(text){
      clipboard.copyText(text);
    }

    $scope.load = function(){
      $http.get("./api/resource")
      .success(function(data){
        $scope.upload_process = false;
        $scope.resources = data;
      })
    }
      var formatDate = function(date){
      var locale = $translate.use() || "en";
      date = new Date(date);
      date = date.toLocaleString(locale,
        { year: 'numeric',  
          month: 'long',  
          day: 'numeric', 
          hour: 'numeric',  
          minute: 'numeric',
          second: 'numeric'
        })
      return date;
    }

     $scope.formatDate = formatDate;

     $scope.upload = function (file) {
        $scope.upload_process = true;
        $upload.upload({
          url: './api/resource/update',
          method: 'POST',
          headers: {
            'my-header' : 'my-header-value'
          },
          fields:{app:appName},
          file: file,
        })
        .then(function() {
           $scope.load();
        });
     }

     $scope.fileSelected = function(f,e){
      var files = f;
      
      $scope.formUpload = false;
      if (files != null) {
          $scope.commits = undefined;
          for (var i = 0; i < files.length; i++) {
            $scope.errorMsg = null;
            (function(file) {
                $scope.upload(file);
            })(files[i]);
          }
      }
    };

    $scope.deleteResource = function(resource){
      $scope.upload_process = true;
      $http.get("./api/resource/delete/"+resource.path)
        .success(function(){
          $scope.upload_process = false;
          $scope.load();
        })
    }

    $scope.close= function(){
       $modalInstance.close();
    }

    $scope.renameResource = function(resource){
      dialog({
          title:"Enter new resource name",
          fields:{
            oldName:{title:"Old name",value:resource.path},
            newName:{title:"New name",value:resource.path,editable:true,required:true}
          } 
      }).then(function(form){
        $scope.upload_process = true;
        $http.post("./api/resource/rename",
          { app:$scope.appName,
            oldPath:form.fields.oldName.value,
            newPath:form.fields.newName.value
          })
          .success(function(){
            $scope.load();    
          })
      })
    } 

        $scope.upload_process = true;
        $scope.load();

  });
