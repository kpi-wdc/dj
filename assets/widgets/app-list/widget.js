import angular from 'angular';

const appListWidget = angular.module('app.widgets.app-list', []);

appListWidget.controller('AppListController', function ($scope, $http, $translate,
                                                        appUrls,
                                                        prompt, alert, user) {
  $http.get(appUrls.appList).success(apps => {
    $scope.apps = apps;
    $scope.oldApps = apps;
  });

  angular.extend($scope, {
    apps: undefined,
    oldApps: undefined,
    isOwner(app) {
      if (!user.id) {
        return false;
      }
      if (!app.owner) {
        return true;
      }
      return app.owner.id === user.id;
    },
    isCollaborator(app) {
      if (!user.id) {
        return false;
      }
      if (!app.collaborations) {
        return false;
      }
      return angular.isUndefined(app.collaborations.find(c => c.user.id === user.id));
    },
    saveApps() {
      this.oldApps = angular.copy(this.apps);
    },
    restoreApps() {
      this.apps = this.oldApps;
    },
    createApp() {
      this.saveApps();

      const app = {
        name: this.model.newAppName,
        owner: user
      };

      this.apps.push(app);

      $http.get(appUrls.api.createApp(app.name))
        .success(data => app.id = data.id)
        .error((data, error) => {
          this.restoreApps();
          alert.error($translate.instant('WIDGET.APP-LIST.ERROR_CREATING_APP', {data, error}));
        });
    },

    setImportFile(file) {
      this.$apply(() => {
        this.importFile = file;
      });
    },

    importApp() {
      var fd = new FormData();
      //Take the first selected file
      fd.append('file', this.importFile);
      $http.post(appUrls.api.import, fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      }).success((data, status) => {
        const app = {
          name: data.name,
          owner: user
        };

        this.apps.push(app);
      }).error((data, status) => {
        if (status === 415) {
          alert.error($translate.instant('WIDGET.APP-LIST.CANNOT_PARSE_DATA_AS_VALID_JSON', {data}));
        } else {
          alert.error($translate.instant('WIDGET.APP-LIST.ERROR_IMPORTING_APP', {status}));
        }
      });
    },

    renameApp(appId) {
      prompt(`${$translate.instant('WIDGET.APP-LIST.NEW_NAME')}:`).then(newAppName => {
        this.saveApps();
        this.apps[this.apps.findIndex(app => appId === app.id)].name = newAppName;
        $http.get(appUrls.api.rename(appId, newAppName))
          .error((data, error) => {
            this.restoreApps();
            alert.error($translate.instant('WIDGET.APP-LIST.ERROR_RENAMING_APP', {error, data}));
          });
      });
    },

    deleteApp(appId, appName) {
      prompt($translate.instant('WIDGET.APP-LIST.TYPE_APP_NAME_TO_CONFIRM_DELETION')).then(confirmName => {
        if (confirmName !== appName) {
          alert.error($translate.instant('WIDGET.APP-LIST.WRONG_NAME_APP_NOT_DELETED'));
          return;
        }

        this.saveApps();
        this.apps.splice(this.apps.findIndex(app => appId === app.id), 1);
        $http.get(appUrls.api.destroy(appId)).error((data, error) => {
          this.restoreApps();
          alert.error($translate.instant('WIDGET.APP-LIST.ERROR_DELETING_APP'));
        });
      });
    }
  });
});
