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
