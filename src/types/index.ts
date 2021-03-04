import S3 from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import { PlantImageLogger } from '../logger';

// Added on 2020-12-14 when typescript-eslint/parse@4.10.0 upgraded.
// TODO: Might be a false positive. Try removing this in the future.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type sharpMethod = (input?: string | Buffer, options?: sharp.SharpOptions) => sharp.Sharp;

export interface RequestDeps {
  sharp: sharpMethod;
  logger: PlantImageLogger;
  s3: S3;
}
