var stream = require('stream');

function Cache(options) {
  stream.Transform.call(this, options);
  this._key = options.key;
  this._value = null;
  this.on('finish', function() {
    Cache.store[this._key] = this._value;
  });
}

Cache.store = {};
Cache.prototype = Object.create(stream.Transform.prototype);
Cache.prototype.constructor = stream.Transform;

Cache.prototype._transform = function(chunk, encoding, callback) {
  if (!this._value) {
    this._value = chunk;
  }
  else {
    this._value = Buffer.concat([this._value, chunk]);
  }
  this.push(chunk);
  callback();
};

module.exports = Cache;
