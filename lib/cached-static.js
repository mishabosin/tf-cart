var fs = require('fs');
var path = require('path');

var Cache = require('./cache');
var HOME = process.cwd();

var keyName = 'index';
var cache = new Cache({ key: keyName });

var CacheServer = function(requestPath) {
  this.path = path.join(HOME, './public/', requestPath);
};

CacheServer.prototype.serve = function(req, res) {
  res.setHeader('Content-Type', 'document');
  res.statusCode = 200;

  var cached = Cache.store[keyName];
  if (cached) {
    // Need to stream this?
    console.log('serving from cache');
    res.end(cached);
    return;
  }

  console.log('serving "' + this.path + '" from the file system');
  fs.createReadStream(this.path)
    .on('error', function(e) {
      console.error(e);
      res.statusCode = 404;
      res.end('Not Found');
    })
    .pipe(cache)
    .pipe(res);
};

module.exports = CacheServer;
