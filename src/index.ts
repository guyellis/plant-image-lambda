// eslint-disable-next-line import/no-unresolved
import { Context, S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import util from 'util';
import sharp from 'sharp';
import { pipeline } from './outer';

import { BasicRequest } from './outer-1-extract-from-event';
import { RequestDeps } from './types';
import { logger } from './logger';

/**
 * Entry point from Lambda call
 */
async function handler(event: S3Event, ctx: Context): Promise<void> {
  try {
    logger.info({
      msg: 'Reading options from event',
      event,
    });

    const deps: RequestDeps = {
      s3: new AWS.S3(),
      logger,
      sharp,
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
