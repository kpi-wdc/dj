/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.session.html
 */

module.exports.session = {

  /***************************************************************************
  *                                                                          *
  * Session secret is automatically generated when your new app is created   *
  * Replace at your own risk in production-- you will invalidate the cookies *
  * of your users, forcing them to log in again.                             *
  *                                                                          *
  ***************************************************************************/
  secret: 'e688e140c0015f013980520c82d480db',


  /***************************************************************************
  *                                                                          *
  * Set the session cookie expire time The maxAge is set by milliseconds.    *
  *                                                                          *
  ***************************************************************************/

  cookie: {
     maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  },

  /***************************************************************************
  *                                                                          *
  * In production, uncomment the following lines to set up a shared redis    *
  * session store that can be shared across multiple Sails.js servers        *
  ***************************************************************************/

  // adapter: 'redis',

  /***************************************************************************
  *                                                                          *
  * The following values are optional, if no options are set a redis         *
  * instance running on localhost is expected. Read more about options at:   *
  * https://github.com/visionmedia/connect-redis                             *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/

  // host: 'localhost',
  // port: 6379,
  // ttl: <redis session TTL in seconds>,
  // db: 0,
  // pass: <redis auth password>
  // prefix: 'sess:'


  /***************************************************************************
  *                                                                          *
  * Uncomment the following lines to use your Mongo adapter as a session     *
  * store                                                                    *
  *                                                                          *
  ***************************************************************************/

  adapter: 'mongo',
  host: process.env.DB_PORT_27017_TCP_ADDR || '127.0.0.1',
  port: process.env.DB_PORT_27017_TCP_PORT || 27017,
  db: 'wdc-session',
  collection: 'sessions',
  url: process.env.MONGOLAB_URI || process.env.MONGODB_URL

  /***************************************************************************
  *                                                                          *
  * Optional Values:                                                         *
  *                                                                          *
  * # Note: url will override other connection settings url:                 *
  * 'mongodb://user:pass@host:port/database/collection',                     *
  *                                                                          *
  ***************************************************************************/

  // username: '',
  // password: '',
  // auto_reconnect: false,
  // ssl: false,
  // stringify: true

};
