import angular from 'angular';
import 'app-list/list';
import 'l10n';
import 'info';
import 'user';

const appList = angular.module('appList', [
  'ngCookies',
  'app.user', 'app.info', 'app.l10n',
  'appList.list']);

appList.controller('AppListController', function ($scope, $http, $translate,
                                                  appList, prompt, alert,
                                                  user) {
  angular.extend($scope, {
    user,
    apps: appList,
    oldApps: appList,
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

      $http.get(`/api/app/create/${app.name}`)
        .success(function (data) {
          app.id = data.id;
        })
        .error((data, error) => {
          this.restoreApps();
          alert.error($translate.instant('ERROR_CREATING_APP', {data, error}));
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
      $http.post(`/api/app/import`, fd, {
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
          alert.error($translate.instant('CANNOT_PARSE_DATA_AS_VALID_JSON', {data}));
        } else {
          alert.error($translate.instant('ERROR_IMPORTING_APP', {status}));
        }
      });
    },

    renameApp(appId) {
      prompt('New name:').then((newAppName) => {
        this.saveApps();
        this.apps[this.apps.findIndex(app => appId === app.id)].name = newAppName;
        $http.get(`/api/app/rename/${appId}/${newAppName}/`)
          .error((data, error) => {
            this.restoreApps();
            alert.error($translate.instant('ERROR_RENAMING_APP', {error, data}));
          });
      });
    },

    deleteApp(appId, appName) {
      prompt($translate.instant('TYPE_APP_NAME_TO_CONFIRM_DELETION')).then((confirmName) => {
        if (confirmName !== appName) {
          alert.error($translate.instant('WRONG_NAME_APP_NOT_DELETED'));
          return;
        }

        this.saveApps();
        this.apps.splice(this.apps.findIndex(app => appId === app.id), 1);
        $http.get(`/api/app/destroy/${appId}`).error((data, error) => {
          this.restoreApps();
          alert.error($translate.instant('ERROR_DELETING_APP'));
        });
      });
    }
  });
});

angular.bootstrap(document, ['appList']);
