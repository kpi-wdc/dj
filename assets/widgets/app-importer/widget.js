import angular from 'angular';

const appListWidget = angular.module('app.widgets.app-importer', []);

appListWidget.controller('AppImporterController', function ($scope, $http, $translate,
                                                           EventEmitter,
                                                           appUrls, prompt, alert, user) {
  const evtEmitter = new EventEmitter($scope);

  angular.extend($scope, {
    model: {
      newAppName: ""
    },
    setImportFile(file) {
      this.$apply(() => {
        this.importFile = file;
      });
    },

    importApp() {
      const fd = new FormData();
      // Take the first selected file
      fd.append('file', this.importFile, this.model.newAppName);
      $http.post(appUrls.api.import, fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      }).success(data => {
        const app = {
          name: data.name,
          owner: user,
          id: data.id
        };

        evtEmitter.emit('new-app-imported', app);
      }).error((data, status) => {
        if (status === 415) {
          alert.error($translate.instant('WIDGET.APP-IMPORTER.CANNOT_PARSE_DATA_AS_VALID_JSON', {data}));
        } else {
          alert.error($translate.instant('WIDGET.APP-IMPORTER.ERROR_IMPORTING_APP', {status}));
        }
      });
    }
  });
});
