'use strict';

var assert = require('assert');
var helper = require('./helper');
var proxyquire = require('proxyquire');

var gm = {
  antialias: function() { return gm; },
  density: function() { return gm; }
};

var index = proxyquire('..', {
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
  it('should build an object', function(done) {
    var event = helper.fakeEvent;
    var expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg'
    };

    index.extractFromEvent(event, function(err, actual){
      assert(!err);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it.only('should run end-to-end', function(end) {
    var ctx = {
      done: function(err) {
        assert(!err);
        end();
      }
    };

    index.handler(helper.fakeEvent, ctx);
  });
});
