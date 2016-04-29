/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
  //local: {
  //  strategy: require('passport-local').Strategy
  //},

  //twitter: {
  //  name: 'Twitter',
  //  protocol: 'oauth',
  //  strategy: require('passport-twitter').Strategy,
  //  options: {
  //    consumerKey: 'your-consumer-key',
  //    consumerSecret: 'your-consumer-secret'
  //  }
  //},
  //
  //github: {
  //  name: 'GitHub',
  //  protocol: 'oauth2',
  //  strategy: require('passport-github').Strategy,
  //  options: {
  //    clientID: 'your-client-id',
  //    clientSecret: 'your-client-secret'
  //  }
  //},
  //
  //facebook: {
  //  name: 'Facebook',
  //  protocol: 'oauth2',
  //  strategy: require('passport-facebook').Strategy,
  //  options: {
  //    clientID: 'your-client-id',
  //    clientSecret: 'your-client-secret'
  //  }
  //},

  google: {
    name: 'Google',
    protocol: 'oauth2',
    strategy: require('passport-google-oauth').OAuth2Strategy,
    options: {
      clientID:'499881078147-tbaaep999mov3fiijokgi1mc64rbb87d.apps.googleusercontent.com',
      // clientID: '960870298438-lfqlduvqbrm00of086eehokrbe4m6doi.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || 'QXEhKyF3uuOl1UNA2ZieVI6l',
      // clientSecret: process.env.GOOGLE_OAUTH_SECRET || 'dR75FkBz43la12g5xJi_hw3d',

      scope: "openid profile email"
    }
  }
};
