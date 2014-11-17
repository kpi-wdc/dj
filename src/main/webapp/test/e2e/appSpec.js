describe("Webapp", function () {
    beforeEach(function () {
        browser.get('/');
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

});
