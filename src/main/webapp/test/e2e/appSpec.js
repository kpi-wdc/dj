describe("Webapp", function () {
    beforeEach(function () {
        browser.get('/');
    });

    it('should have some content', function () {
        $('html').getText().then(function (text) {
            console.dir(text); // log for debugging on Travis CI
        });
    });

    it('should have home page title', function() {
        expect($('.page-title').getText()).toBe("Home page");
    });
});
