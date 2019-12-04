import S3 from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import { PlantImageLogger } from '../logger';

export interface ImageSize {
  height?: number;
  name: string;
  width: number;
}

export type sharpMethod = (input?: string | Buffer, options?: sharp.SharpOptions) => sharp.Sharp;

export interface RequestDeps {
  sharp: sharpMethod;
  logger: PlantImageLogger;
  s3: S3;
}
