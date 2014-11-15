exports.config = {
    baseUrl: 'http://localhost:8080',
    specs: ['build/test/e2e/**/*Spec.js'],
    allScriptsTimeout: 10000,

    capabilities: {
        'browserName': 'firefox'
    },

    framework: 'jasmine',

    //sauceUser: process.env.SAUCE_USERNAME,

    //sauceKey: process.env.SAUCE_ACCESS_KEY,

    onPrepare: function() {
        // implicit and page load timeouts
        browser.manage().timeouts().pageLoadTimeout(40000);
        browser.manage().timeouts().implicitlyWait(25000);

        // for non-angular page
        browser.ignoreSynchronization = true;
    }
};
