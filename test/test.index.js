'use strict';

var assert = require('assert');
var helper = require('./helper');
var index = require('../src');

function GM() {
  var _this = this;
  return function() {
    return _this;
  };
}

GM.prototype.antialias = function() {
  return this;
};

GM.prototype.autoOrient = function() {
  return this;
};

GM.prototype.density = function() {
  return this;
};

GM.prototype.resize = function() {
  return this;
};

GM.prototype.toBuffer = function(type, cb) {
  cb(null, 'Fake Buffer');
};

GM.prototype.size = function(cb) {
  cb.call(this, null, {width: 3000, height: 2000});
};

var gm = new GM();

var s3 = {
  getObject: function(obj, cb) {
    cb(null, helper.fakeS3Object);
  },
  putObject: function(obj, cb) {
    cb();
  }
};

var https = {
  request: function(options, cb) {
    cb();
    return {
      end: function() {},
      on: function() {},
      write: function() {}
    };
  }
};

var deps = {
  s3: s3,
  gm: gm,
  https: https
};

describe('buildFromEvent', function() {

  it('should run end-to-end', function(end) {
    var ctx = {
      done: function(err) {
        assert(!err);
        end();
      }
    };

    index.handlerDeps(deps, helper.fakeEvent, ctx);
  });
});
