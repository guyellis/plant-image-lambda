
import path from 'path';
// eslint-disable-next-line import/no-unresolved
import { S3Event } from 'aws-lambda';
import { RequestDeps } from './types';

export interface BasicRequest {
  deps: RequestDeps;
  event: S3Event;
}

const imageTypes = ['jpg', 'gif', 'png', 'eps'] as const;
type ImageType = typeof imageTypes[number];

export interface ExtractFromEventData {
  bucketName: string;
  key: string;
  fileName: string;
  imageType: ImageType;
  outKeyRoot: string;
}

export interface ExtractFromEventResponse extends BasicRequest {
  data: ExtractFromEventData;
}

// #1
export const extractFromEvent = (req: BasicRequest): ExtractFromEventResponse => {
  const { event, deps: { logger } } = req;

  // Object key may have spaces or unicode non-ASCII characters.
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  // If there's one or more dots in the key then this next regex will return an array with
  // two items. The first element will be the last dot and following characters and the
  // second element will be the same without the dot.
  const typeMatch = key.match(/\.([^.]*)$/);
  if (!typeMatch) {
    const msg = `unable to infer image type for key ${key}`;
    const err = new Error(msg);
    logger.error({
      decodedKey: key,
      err,
      key: event.Records[0].s3.object.key,
      msg,
    });
    throw err;
  }

  const imageType = typeMatch[1].toLowerCase() as ImageType;

  if (!imageTypes.includes(imageType)) {
    const msg = `skipping non-image ${key}`;
    const err = new Error(msg);
    logger.error({
      msg, imageType, key, err,
    });
    throw err;
  }

  if (!key.includes('/orig/')) {
    // This should not happen because the filter on S3 has been setup to be:
    // test/orig/ for test and
    // up/orig/ for prod
    const msg = `Not processing ${key} because it is not an original image.`;
    const err = new Error(msg);
    logger.error({ msg, key, err });
    throw err;
  }

  // Compute root of key for output
  // The key either starts with one of:
  // test/orig/
  // up/orig/
  let outKeyRoot = key.split('/')[0];
  if (!['test', 'up'].includes(outKeyRoot)) {
    const msg = `key does not start with a recognized folder:${key}`;
    const err = new Error(msg);
    logger.error({ msg, key, err });
    throw err;
  }
  outKeyRoot += '/';

  return {
    ...req,
    data: {
      bucketName: event.Records[0].s3.bucket.name,
      key,
      fileName: path.basename(key),
      imageType,
      outKeyRoot,
    },
  };
};
