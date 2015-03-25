var crypto   = require('crypto')
  , fs       = require('fs');

/**
 * filecrypto Service
 *
 * Used to find cryptography (i.e. md5 hash) values of files data
 */

module.exports = {
  getMd5: function (filename, onReady) {
    var md5Algo = 'md5';

    var shasum = crypto.createHash(md5Algo);
    var s = fs.ReadStream(filename);
    s.on('data', function(data) {
      shasum.update(data);
    });

    s.on('end', function() {
      onReady(shasum.digest('hex'));
    });
  }
};


