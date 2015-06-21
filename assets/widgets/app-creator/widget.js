import angular from 'angular';

const appListWidget = angular.module('app.widgets.app-creator', []);

appListWidget.controller('AppCreatorController', function ($scope, $http, $translate,
                                                           EventEmitter,
                                                           appSkins,
                                                           appUrls, prompt, alert, user) {
  const evtEmitter = new EventEmitter($scope);

  angular.extend($scope, {
    model: {
      newAppName: "",
      skinName: "default"
    },
    skins: appSkins,
    createApp() {
      const app = {
        name: this.model.newAppName,
        skin: this.model.skinName,
        owner: user
      };

      $http.get(appUrls.api.createApp(app.name, app.skin))
        .success(data => {
          app.id = data.id;
          evtEmitter.emit('new-app-created', app);
        })
        .error((data, error) => {
          alert.error($translate.instant('WIDGET.APP-CREATOR.ERROR_CREATING_APP', {data, error}));
        });
    }
  });
});
