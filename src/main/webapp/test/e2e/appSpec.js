describe("Home page", function () {
    beforeEach(function () {
        browser.get('/');
    });

    it('Home page test', function() {
        $('body').getText().then(function (text) {
            console.dir(text);
        });
        expect($('.page-title').getText()).toBe("Home page");
    });
});
