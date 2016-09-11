'use strict';

var assert = require('assert');
var helper = require('./helper');
var proxyquire = require('proxyquire');

var gm = {
  antialias: function() { return gm; },
  density: function() { return gm; }
};

var index = proxyquire('../src/outer', {
  'aws-sdk': {

  },
  gm: {
    subClass: function() {
      return function() {
        return gm;
      };
    }
  }
});

describe('buildFromEvent', function() {

  it.skip('should run outer end-to-end', function(end) {
    var ctx = {
      done: function(err) {
        assert(!err);
        end();
      }
    };

    index.handler(helper.fakeEvent, ctx);
  });
});
