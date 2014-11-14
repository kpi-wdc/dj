describe("End-to-end tests", function () {
    it('Home page test', function() {
        browser.get('/');
        expect($('.page-title').getText()).toBe("Home page");
    });
});
