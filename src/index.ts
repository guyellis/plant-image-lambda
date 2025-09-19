// eslint-disable-next-line import/no-unresolved
import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import { pipeline } from './outer';

import { BasicRequest } from './outer-1-extract-from-event';
import { RequestDeps } from './types';
import { logger } from './logger';
import { getError } from './utils';

/**
 * Entry point from Lambda call
 */
async function handler(event: S3Event): Promise<void> {
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
    return Promise.resolve();
  } catch (error) {
    const err = getError(error);
    logger.error({
      err,
      msg: 'Error in pipeline',
    });
    return Promise.reject(error);
  }
}

export {
  handler,
};
