describe("Webapp", function () {
    beforeEach(function (cb) {
        browser.driver.get(browser.baseUrl + '/');
        browser.driver.wait(function () {
            return browser.driver.executeScript(function () {
                return window.angular !== undefined &&
                    window.angular.bootstrap !== undefined;
            });
        }, 3000).then(function () {
            browser.ignoreSynchronization = false;
            cb();
        });
    });

    it('should have some content', function () {
        var text = $('html').getText();
        text.then(function (text) {
            console.dir(text); // log for debugging on Travis CI
        });
        expect(text).toContain('Home page');
    });

    it('should have home page title', function () {
        expect($('.page-title').getText()).toBe("Home page");
    });

    it('should route to 404 page correctly', function () {
        var errPageBtn = $$('[href="/404"]').first();
        errPageBtn.isPresent().then(function (present) {
            if (present) {
                errPageBtn.click();
                expect(browser.getLocationAbsUrl()).toBe('/404');
            }
        });
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

    describe('widget events', function () {
        it('should react to events', function () {
            browser.setLocation('/events-page');
            var inputs = $$('[ng-controller=SummatorWidgetController]').$$('input');
            expect(inputs.count()).toBe(4);
            inputs.get(0).sendKeys(protractor.Key.CONTROL, "a", protractor.Key.NULL, '123');
            inputs.get(1).sendKeys(protractor.Key.CONTROL, "a", protractor.Key.NULL, '321');
            expect(inputs.get(2).getAttribute('value')).toBe('444');
        });
    });

    describe('widget settings', function () {
        it('should update changed settings', function () {
            browser.setLocation('/dev-page');
            var summator = $('widget-holder[name=topleft]').$$('.widget').first();
            summator.$('.widget-config-btn').click();
            var reveal = $('.reveal-modal');
            reveal.element(by.linkText("Custom settings")).click();
            reveal.element(by.cssContainingText('option', 'true')).click();
            reveal.all(by.buttonText('Save')).last().click();
            expect(summator.$$('input').first().isEnabled()).toBeFalsy();
        });
    });
});
