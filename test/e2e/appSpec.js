describe("Webapp", () => {
  beforeEach(cb => {
    browser.driver.get(`${browser.baseUrl}/app/test/`);
    browser.driver.wait(() =>
      browser.driver.executeScript(() =>
        window.angular !== undefined &&
          window.angular.bootstrap !== undefined &&
          window.$ &&
          window.$.isReady
      ),
    10000).then(() => {
      browser.ignoreSynchronization = false;
      $('#designModeCheckbox').click();
      cb();
    });
  });

  afterEach(cb => {
    browser.executeScript(() => {
      window.localStorage.clear();
    });
    cb();
  });

  it('should have some content', () => {
    const text = $('html').getText();
    text.then(text => console.dir(text)); // log for debugging on Travis CI
  });

  it('should have home page title', () => {
    expect($('.page-title').getText()).toBeDefined();
  });

  it('should route to pages correctly', () => {
    $('[href="/app/test/dev-page"]').click();
    expect(browser.getLocationAbsUrl()).toBe('/app/test/dev-page');
  });

  describe('widget events', () => {
    it('should react to events', () => {
      browser.setLocation('/app/test/events-page');
      const inputs = $$('[ng-controller=SummatorWidgetController]').$$('input');
      expect(inputs.count()).toBe(4);
      inputs.get(0).sendKeys(protractor.Key.CONTROL, "a", protractor.Key.NULL, '123');
      inputs.get(1).sendKeys(protractor.Key.CONTROL, "a", protractor.Key.NULL, '321');
      expect(inputs.get(2).getAttribute('value')).toBe('444');
    });
  });

  describe('widget settings', () => {
    it('should update changed settings', () => {
      browser.setLocation('/app/test/dev-page');
      const summator = $('widget-holder[name=topleft]').$$('.widget').first();
      summator.$('.widget-config-btn').click();
      const reveal = $('.reveal-modal');
      reveal.element(by.linkText("Custom settings")).click();
      reveal.element(by.cssContainingText('option', 'true')).click();
      reveal.all(by.buttonText('Save')).last().click();
      expect(summator.$$('input').first().isEnabled()).toBeFalsy();
    });
  });
});
