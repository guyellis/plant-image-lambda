'use strict';

var util = require('util');
var outer = require('./outer');
var inner = require('./inner');

function handlerDeps(deps, event, ctx) {
  console.log('Reading options from event:', util.inspect(event, {
    depth: 5
  }));

  if(!deps) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();
    var gm = require('gm').subClass({
      imageMagick: true
    });
    deps = {s3: s3, gm: gm};
  }

  var req = {
    event: event,
    deps: deps
  };

  outer.pipeline(req, function(err) {
    if(err) {
      return ctx.done(err);
    } else {
      Object.freeze(req.data);
      inner.pipeline(req, function(innerPipelineError) {
        ctx.done(innerPipelineError);
      });
    }
  });
}

function handler(event, ctx) {
  handlerDeps(null, event, ctx);
}

module.exports = {
  handler: handler,
  handlerDeps: handlerDeps
};
