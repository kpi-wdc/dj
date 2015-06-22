import angular from 'angular';

const pageListWidget = angular.module('app.widgets.page-list', []);

pageListWidget.factory('addNewPageInModal', function (app, $modal) {
  return () => {
    $modal.open({
      templateUrl: '/widgets/page-list/new-page-modal-config.html',
      controller: 'AddNewPageModalController',
      backdrop: 'static',
      resolve: {
        templateTypes(templateTypesPromise) {
          return templateTypesPromise;
        }
      }
    }).result.then(() => app.markModified(true));
  }
})

pageListWidget.factory('openPageConfig', function (app, $modal) {
  return page => {
    const thisPage = app.pageConfig().href === page.href;
    $modal.open({
      templateUrl: '/widgets/page-list/page-modal-config.html',
      controller: 'PageSettingsModalController',
      backdrop: 'static',
      resolve: {
        page: () => page
      }
    }).result
      .then(() => {
        app.markModified(true);
        if (thisPage) {
          $state.go('page', {href: page.href}, {reload: true});
        }
      });
}});

pageListWidget.controller('PageListController', function ($scope, $translate, $modal, $state,
                                                app, appName, config,
                                                globalConfig, confirm,
                                                addNewPageInModal, openPageConfig) {
  // TODO: synchronize css styles on active link after clicking
  angular.extend($scope, {
    appName,
    config,

    addNewPageInModal,

    openPageConfig,

    deletePageWithConfirmation(page) {
      $translate('WIDGET.PAGE-LIST.ARE_YOU_SURE_DELETE_PAGE')
        .then(confirm)
        .then((/*ok*/) => app.deletePage(page))
    }
  });
});
