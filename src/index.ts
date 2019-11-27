// eslint-disable-next-line import/no-unresolved
import { Context, S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import util from 'util';
import Logger from 'lalog';
import gm from 'gm';
import { pipeline } from './outer';

import env from './env';
import { BasicRequest } from './outer-1-extract-from-event';
import { RequestDeps } from './types';

/**
 * Entry point from Lambda call
 */
async function handler(event: S3Event, ctx: Context): Promise<void> {
  process.env.LOGGLY_TOKEN = env.LOGGLY_TOKEN;

  // @ts-ignore
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
    const deps: RequestDeps = {
      s3: new AWS.S3(),
      logger,
      gm: gm.subClass({
        imageMagick: true,
      }),
    };

    const req: BasicRequest = {
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

export {
  handler,
};
