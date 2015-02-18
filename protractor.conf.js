exports.config = {
  baseUrl: 'http://localhost:8080',
  specs: ['.tmp/test/e2e/**/*Spec.js'],
  allScriptsTimeout: 20000,

  capabilities: {
    'browserName': 'firefox'
  },

  framework: 'jasmine',

  resultJsonOutputFile: 'protractor.log',

  onPrepare: function () {
    // implicit and page load timeouts
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.manage().timeouts().implicitlyWait(25000);

    browser.ignoreSynchronization = true;
  }
};
