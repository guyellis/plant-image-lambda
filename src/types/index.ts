import S3 from 'aws-sdk/clients/s3';
import Logger from 'lalog';
import { SubClass } from 'gm';

interface ImageSize {
  height?: number;
  name: string;
  width: number;
}

// interface LoggerPresets {
//   trackId?: string;
// }

export type TimeEndLoggerFunc = (timerName: string, logData?: object) => void;

export interface TimeEndLogger {
  (timerName: string, logData?: object): void;
  error: TimeEndLoggerFunc;
}

type LoggerFunc = (logData: object) => void;

// interface Logger {
//   info: LoggerFunc;
//   warn: LoggerFunc;
//   fatal: LoggerFunc;
//   security: LoggerFunc;
//   error: LoggerFunc;
//   presets?: LoggerPresets;
//   time: (timerName: string) => void;
//   timeEnd: TimeEndLogger | TimeEndLoggerFunc;
//   trace: LoggerFunc;
// }

export interface RequestDeps {
  gm: SubClass;
  logger: Logger;
  s3: S3;
}

interface RequestItem {
  size: ImageSize;
}

interface RequestInput {
  bucketName: string;
  buffer: any;
  fileName: string;
  imageSize: ImageSize;
  imageType: string;
  key: string;
  outKeyRoot: string;
  s3Object: object;
}

export interface PlantRequest {
  buffer: any;
  data: any;
  deps: RequestDeps;
  event: any;
  input: RequestInput;
  item: RequestItem;
  step: number;
}
