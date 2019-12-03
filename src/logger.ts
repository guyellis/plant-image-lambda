import Logger, { LevelType } from 'lalog';

import env from './env';

process.env.LOGGLY_TOKEN = env.LOGGLY_TOKEN;

Logger.setLevel(env.LALOG_LEVEL as LevelType);

export const logger = Logger.create({
  serviceName: 'plant-image-lambda',
  moduleName: 'handler',
  addTrackId: true,
});
