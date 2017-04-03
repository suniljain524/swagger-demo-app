'use strict';

const redis = require('redis');
const Promise = require('bluebird');
const _ = require('lodash');

Promise.promisifyAll(redis.RedisClient.prototype);

module.exports = Cache;

function Cache(config) {
  if (!(this instanceof Cache)) {
    return new Cache(config);
  }
  this.config = config
}

Cache.connect = function connect(config, cb) {
  if (arguments.length == 1) {
    cb = options;
    options = {};
  }
  var cache = new Cache(config);
  cache.connect(cb);
};

Cache.prototype.connect = function connect(cb) {
  var self = this;
  if (!this._redis) {
    this._redis = redis.createClient(self.config.port, self.config.host);
  }
  this._redis.on('connect', function () {
    return cb(null, self);
  });
  this._redis.on('error', function (e) {
    return cb(e);
  });
};

Cache.prototype.disconnect = function disconnect(cb) {
  this._redis.once('end', cb);
  this._redis.quit();
};

Cache.prototype.set = function(key, val, cb) {
  let self = this
  this._redis.setAsync(key, self.serialize(val))
    .then(() => {
      return self.expireAsync(key);
    })
    .then(() => {
      return cb()
    })
    .catch((e) => {
      console.log("catch=", e);
      return cb(e)
    })
};

Cache.prototype.get = function(key, cb) {
  let self = this;
  return self._redis.getAsync(key)
    .then((res) => {
      return self.expireAsync(key)
        .then(() => {
          return cb(null, self.deserialize(res));
      })
    })
    .catch((e) => {
      return cb(e);
    })
}

Cache.prototype.hmset = function(key, obj, cb) {
  let self = this
  this._redis.hmsetAsync(key, self.serializeObject(obj))
    .then(() => {
      return self.expireAsync(key);
    })
    .then(() => {
      return cb();
    })
    .catch((e) => {
      return cb(e);
    })
};

Cache.prototype.hgetAll = function(key, cb) {
  let self = this
  self._redis.hgetallAsync(key)
    .then((res) => {
      return self.expireAsync(key)
        .then(() => {
          return cb(null, self.deserializeObject(res))
        })
    })
    .catch((e) => {
      return cb(e);
    })
};

Cache.prototype.serialize = function (data) {
  return JSON.stringify(data);
};

Cache.prototype.deserialize = function (data) {
  return JSON.parse(data);
}

Cache.prototype.serializeObject = function (obj) {
  var self = this;
  return _.reduce(obj, function (acc, val, key) {
    acc[key] = self.serialize(val);
    return acc;
  }, {});
};

Cache.prototype.deserializeObject = function (obj) {
  var self = this;
  return _.reduce(obj, function (acc, val, key) {
    acc[key] = self.deserialize(val);
    return acc;
  }, {});
};

Cache.prototype.expire = function(key, cb) {
  this._redis.expireAsync(key, this.config.expiry);
  return cb()
};

Promise.promisifyAll(Cache.prototype);

Promise.promisifyAll(Cache);
