interface ImageSize {
  height?: number;
  name: string;
  width: number;
}

interface LoggerPresets {
  trackId?: string;
}

type TimeEndLoggerFunc = (timerName: string, logData?: object) => void;

interface TimeEndLogger {
  error: TimeEndLoggerFunc;
}

type LoggerFunc = (logData: object) => void;

interface Logger {
  error: LoggerFunc;
  presets?: LoggerPresets;
  time: (timerName: string) => void;
  timeEnd: TimeEndLogger | TimeEndLoggerFunc;
  trace: LoggerFunc;
}

interface RequestDeps {
  gm: Function;
  logger: Logger;
  s3: any;
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

interface PlantRequest {
  buffer: any;
  data: any;
  deps: RequestDeps;
  event: any;
  input: RequestInput;
  item: RequestItem;
  step: number;
}
