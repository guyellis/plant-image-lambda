const AWS = require('aws-sdk');
const util = require('util');
const Logger = require('lalog');
const gm = require('gm');

const pipeline = require('./outer');

async function handler(event, ctx) {
  const logger = Logger.create({
    serviceName: 'plant-image-lambda',
    moduleName: 'n/a',
    addTrackId: true,
  });

  logger.trace({
    msg: 'Reading options from event',
    event: util.inspect(event, { depth: 5 }),
  });

  const deps = {
    s3: new AWS.S3(),
    logger,
    gm: gm.subClass({
      imageMagick: true,
    }),
  };

  const req = {
    event,
    deps,
  };

  try {
    await pipeline(req);
    ctx.done();
  } catch (err) {
    logger.error({
      msg: 'Error in pipeline',
      event: util.inspect(event, { depth: 5 }),
      err,
    });
    ctx.done(err);
  }
}

module.exports = {
  handler,
};
