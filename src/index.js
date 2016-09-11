'use strict';

var util = require('util');
var outer = require('./outer');
var inner = require('./inner');

function handler(event, ctx) {
  console.log('Reading options from event:\n', util.inspect(event, {
    depth: 5
  }));

  outer.pipeline(event, function(err, data) {
    if(err) {
      return ctx.done(err);
    } else {
      inner.pipeline(Object.freeze(data), function(err2) {
        ctx.done(err2);
      });
    }
  });
}

module.exports = {
  handler: handler
};
