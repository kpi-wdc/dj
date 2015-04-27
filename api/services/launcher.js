var child_process = require('child_process');

/**
 * launcher Service
 *
 * Is capable of launching separate processes, listening for specific
 * events of that process and communicate with it via command line
 * arguments on launch or via messages while it works.
 */

module.exports = {
  instance: function(launchingFilePath, args) {
    var launcher = {};
    var child = child_process.fork(launchingFilePath, args, {silent: true});
    launcher.instanceDontTouchItNever = child;

    launcher.onStdOut = function(handle) {
      child.stdout.on('data', function (data) {
        handle(data);
      });
    };

    launcher.onStdErr = function(handle) {
      child.stderr.on('data', function(err) {
        handle(err);
      });
    };

    launcher.onTerminate = function(handle) {
      child.on('close', function(code) {
        handle(code);
      });
    };

    launcher.onMessage = function(handle) {
      child.on('message', function(message) {
        handle(message);
      });
    };

    launcher.send = function(message) {
      child.send(message);
    };

    return launcher;
  }
};
