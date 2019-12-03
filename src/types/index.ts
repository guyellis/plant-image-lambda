import S3 from 'aws-sdk/clients/s3';
import Logger from 'lalog';
import sharp from 'sharp';

export interface ImageSize {
  height?: number;
  name: string;
  width: number;
}

export type sharpMethod = (input?: string | Buffer, options?: sharp.SharpOptions) => sharp.Sharp;

export interface RequestDeps {
  sharp: sharpMethod;
  logger: Logger;
  s3: S3;
}
