const AWS = require('aws-sdk');
const util = require('util');
const Logger = require('lalog');
const gm = require('gm');

const env = require('./env.json');
const pipeline = require('./outer');

/**
 * Entry point from Lambda call
 * @param {LambdaEvent} event
 * @param {Context} ctx
 */
async function handler(event, ctx) {
  process.env.LOGGLY_TOKEN = env.LOGGLY_TOKEN;
  Logger.setLevel(process.env.LALOG_LEVEL);

  const logger = Logger.create({
    serviceName: 'plant-image-lambda',
    moduleName: 'n/a',
    addTrackId: true,
  });

  logger.trace({
    msg: 'Reading options from event',
    event: util.inspect(event, { depth: 5 }),
  });

  try {
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
