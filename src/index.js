

const util = require('util');
const outer = require('./outer');
const Logger = require('lalog');
const uuid = require('uuid');

function handlerDeps(deps, event, ctx) {
  console.log('Reading options from event:', util.inspect(event, {
    depth: 5,
  }));

  if (!deps) {
    /* eslint-disable global-require */
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const gm = require('gm').subClass({
      imageMagick: true,
    });
    const https = require('https');
    const http = require('http');
    /* eslint-enable global-require */
    // eslint-disable-next-line no-param-reassign
    deps = {
      s3, gm, https, http,
    };
  }

  // eslint-disable-next-line no-param-reassign
  deps.logger = Logger.create({
    serviceName: 'plant-image-lambda',
    moduleName: 'n/a',
    presets: {
      trackId: uuid.v4(),
    },
  });

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
