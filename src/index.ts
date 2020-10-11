// eslint-disable-next-line import/no-unresolved
import { Context, S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
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
      event,
      msg: 'Reading options from event',
    });

    const deps: RequestDeps = {
      logger,
      s3: new AWS.S3(),
      sharp,
    };

    const req: BasicRequest = {
      deps,
      event,
    };

    await pipeline(req);
    ctx.done();
  } catch (err) {
    logger.error({
      err,
      msg: 'Error in pipeline',
    });
    ctx.done(err);
  }
}

export {
  handler,
};
