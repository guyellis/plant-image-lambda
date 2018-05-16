

const util = require('util');
const outer = require('./outer');

function handlerDeps(deps, event, ctx) {
  console.log('Reading options from event:', util.inspect(event, {
    depth: 5,
  }));

  if (!deps) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const gm = require('gm').subClass({
      imageMagick: true,
    });
    const https = require('https');
    const http = require('http');
    deps = {
      s3, gm, https, http,
    };
  }

  const req = {
    event,
    deps,
  };

  outer.pipeline(req, (pipelineError) => {
    ctx.done(pipelineError);
  });
}

function handler(event, ctx) {
  handlerDeps(null, event, ctx);
}

module.exports = {
  handler,
  handlerDeps,
};
