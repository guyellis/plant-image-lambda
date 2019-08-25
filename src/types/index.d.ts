interface ImageSize {
  width: number;
  name: string;
}

interface Logger {
  time: Function;
  timeEnd: Function;
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
  step: number;
  event: any;
  deps: RequestDeps;
  item: RequestItem;
  input: RequestInput;
  buffer: any;
}
