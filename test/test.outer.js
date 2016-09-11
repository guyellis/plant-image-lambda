'use strict';

var assert = require('assert');
var helper = require('./helper');
var index = require('../src/outer');

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
