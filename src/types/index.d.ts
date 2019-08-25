interface ImageSize {
  name: string;
  width: number;
}

interface LoggerPresets {
  trackId?: string;
}

interface Logger {
  error: Function;
  presets?: LoggerPresets;
  time: Function;
  timeEnd: Function;
  trace: Function;
}

interface RequestDeps {
  gm: object;
  logger: Logger;
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
