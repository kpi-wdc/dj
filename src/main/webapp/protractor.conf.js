exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8080',
    specs: ['build/test/e2e/**/*Spec.js'],
    allScriptsTimeout: 10000,
    onPrepare: function() {
        // implicit and page load timeouts
        browser.manage().timeouts().pageLoadTimeout(40000);
        browser.manage().timeouts().implicitlyWait(25000);

        // for non-angular page
        browser.ignoreSynchronization = true;
    }
};
