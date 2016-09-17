'use strict';

var util = require('util');
var outer = require('./outer');

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
    var https = require('https');
    var http = require('http');
    deps = {s3: s3, gm: gm, https: https, http: http};
  }

  var req = {
    event: event,
    deps: deps
  };

  outer.pipeline(req, function(pipelineError) {
    ctx.done(pipelineError);
  });
}

function handler(event, ctx) {
  handlerDeps(null, event, ctx);
}

module.exports = {
  handler: handler,
  handlerDeps: handlerDeps
};
