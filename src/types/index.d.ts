interface ImageSize {
  width: number;
  name: string;
}

interface LambdaEvent {

}

interface Context {
  done: Function;
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

interface Request {
  step: number;
  deps: RequestDeps;
  item: RequestItem;
  input: RequestInput;
  buffer: any;
}