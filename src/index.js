const AWS = require('aws-sdk');
const util = require('util');
const Logger = require('lalog');
const pipeline = require('./outer');

async function handlerDeps(deps, event, ctx) {
  const logger = Logger.create({
    serviceName: 'plant-image-lambda',
    moduleName: 'n/a',
    addTrackId: true,
  });

  logger.trace({
    msg: 'Reading options from event',
    event: util.inspect(event, { depth: 5 }),
  });

  if (!deps) {
    /* eslint-disable global-require */
    const gm = require('gm').subClass({
      imageMagick: true,
    });
    const https = require('https');
    const http = require('http');
    /* eslint-enable global-require */
    // eslint-disable-next-line no-param-reassign
    deps = {
      gm, https, http,
    };
  }

  // eslint-disable-next-line no-param-reassign
  deps.s3 = new AWS.S3();
  // eslint-disable-next-line no-param-reassign
  deps.logger = logger;

  const req = {
    event,
    deps,
  };

  try {
    await pipeline(req);
    ctx.done();
  } catch (err) {
    ctx.done(err);
  }
}

function handler(event, ctx) {
  handlerDeps(null, event, ctx);
}

module.exports = {
  handler,
  handlerDeps,
};
