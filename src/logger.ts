/* eslint-disable no-console */
import Logger, { LevelType, LogFunction, TimeLogFunction } from 'lalog';

import env from './env';

process.env.LOGGLY_TOKEN = env.LOGGLY_TOKEN;

Logger.setLevel(env.LALOG_LEVEL as LevelType);

const laLogger = Logger.create({
  serviceName: 'plant-image-lambda',
  moduleName: 'handler',
  addTrackId: true,
});

const { presets } = laLogger;

const time = (label: string): void => {
  console.time(label);
  return laLogger.time(label);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const j = (obj: any): string => JSON.stringify(obj, null, 2);

const timeEnd: TimeLogFunction = (label, level, obj) => {
  console.timeEnd(label);
  if (obj) {
    console.log(j(obj));
  }
  return laLogger.timeEnd(label, level, obj);
};

const trace: LogFunction = (obj) => {
  console.trace(j(obj));
  return laLogger.trace(obj);
};

const info: LogFunction = (obj) => {
  console.info(j(obj));
  return laLogger.info(obj);
};

const error: LogFunction = (obj) => {
  console.error(j(obj));
  return laLogger.error(obj);
};

export type PlantImageLogger = Pick<Logger, 'timeEnd' | 'time' | 'trace' | 'info' | 'error' | 'presets'>;

export const logger: PlantImageLogger = {
  error,
  time,
  timeEnd,
  trace,
  info,
  presets,
};
