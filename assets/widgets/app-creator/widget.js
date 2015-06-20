import angular from 'angular';

const appListWidget = angular.module('app.widgets.app-creator', []);

appListWidget.controller('AppCreatorController', function ($scope, $http, $translate,
                                                           EventEmitter,
                                                           appUrls, prompt, alert, user) {
  const evtEmitter = new EventEmitter($scope);

  angular.extend($scope, {
    createApp() {
      const app = {
        name: this.model.newAppName,
        owner: user
      };

      $http.get(appUrls.api.createApp(app.name))
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
