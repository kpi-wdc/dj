import angular from 'angular';
import 'app-list/list';
import 'info'
import 'user'

const appList = angular.module('appList', ['app.user', 'appList.list', 'app.info']);

appList.controller('AppListController', function ($scope, $http, $window,
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
          alert.error(`Error while creating the app (${error}): ${data}`);
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
          alert.error(`Cannot parse this data as a valid json configuration file: ${data}`);
        } else {
          alert.error(`Error happened while importing app: ${status}`);
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
            alert.error(`Error while renaming the app (${error}): ${data}`);
          });
      });
    },

    deleteApp(appId, appName) {
      prompt('Type again name of the app to confirm deletion: ').then((confirmName) => {
        if (confirmName !== appName) {
          alert.error('Wrong name, app is not deleted!');
          return;
        }

        this.saveApps();
        this.apps.splice(this.apps.findIndex(app => appId === app.id), 1);
        $http.get(`/api/app/delete/${appId}`).error((data, error) => {
          this.restoreApps();
          alert.error(`Error while deleting the app (${error}): ${data}`);
        });
      });
    }
  });
});

angular.bootstrap(document, ['appList']);
