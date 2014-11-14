describe("End-to-end tests", function () {
    it('Home page test', function() {
        browser.get('/');
        $('body').getText().then(function (text) {
            console.dir(text);
        });
        expect($('.page-title').getText()).toBe("Home page");
    });
});
