import S3 from 'aws-sdk/clients/s3';
import Logger from 'lalog';
import { SubClass } from 'gm';

export interface ImageSize {
  height?: number;
  name: string;
  width: number;
}

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
