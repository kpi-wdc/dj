describe("Webapp", function () {
  beforeEach(function (cb) {
    browser.driver.get(browser.baseUrl + '/');
    browser.driver.wait(function () {
      return browser.driver.executeScript(function () {
        return window.angular !== undefined &&
          window.angular.bootstrap !== undefined &&
          window.$ &&
          window.$.isReady;
      });
    }, 3000).then(function () {
      browser.ignoreSynchronization = false;
      $('#logInButton').click();
      $('#designModeCheckbox').click();
      cb();
    });
  });

  afterEach(function (cb) {
    browser.executeScript(function () {
      window.localStorage.clear();
    });
    cb();
  });

  it('should have some content', function () {
    var text = $('html').getText();
    text.then(function (text) {
      console.dir(text); // log for debugging on Travis CI
    });
  });

  it('should have home page title', function () {
    expect($('.page-title').getText()).toBeDefined();
  });

  it('should route to 404 page correctly', function () {
    $('[href="/data-representation"]').click();
    expect(browser.getLocationAbsUrl()).toBe('/data-representation');
  });

  describe("delete button", function () {
    it('should have non-clickable delete button on home page', function () {
      expect($('#deletePageBtn').isEnabled()).toBeFalsy();
    });

    it('should have non-clickable delete button on home page', function () {
      browser.setLocation('404');
      expect($('#deletePageBtn').isEnabled()).toBeFalsy();
    });

    it('should have clickable delete button on other pages', function () {
      browser.setLocation('dev-page');
      expect($('#deletePageBtn').isEnabled()).toBeTruthy();
    });
  });
});
