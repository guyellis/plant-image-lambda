import util from 'util';
import { PutObjectOutput } from 'aws-sdk/clients/s3';

import { RequestDeps } from './types';
import { ImageSizeResponse, ImageSizeData } from './outer-5-image-size';
import { NoteImageSize } from './types/image-lambda-types';
import { getError } from './utils';

const bucket = 'i.plaaant.com';

interface ProcessImageReqOptions {
  item: {
    size: NoteImageSize;
    index: number;
  };
  input: ImageSizeData;
  deps: RequestDeps;
  step: number;
}

interface UploadImageReqOptions {
  step: number;
  deps: RequestDeps;
  item: {
    size: NoteImageSize;
    index: number;
  };
  input: ImageSizeData;
  buffer: Buffer;
}

const processImage = async (
  req: Readonly<ProcessImageReqOptions>,
): Promise<Readonly<UploadImageReqOptions>> => {
  const step = req.step + 1;
  const {
    deps: { logger }, item, input: { jpeg },
  } = req;
  const { size: targetSize } = item;
  logger.time('processImage');
  const size = req.input.imageSize;

  const getResponse = (buffer: Buffer): UploadImageReqOptions => {
    const res: UploadImageReqOptions = {
      buffer,
      deps: req.deps,
      input: req.input,
      item: req.item,
      step,
    };
    return res;
  };

  try {
    let buffer: Buffer;
    let msg: string;
    if (size.width === targetSize.width) {
      msg = 'width in size and targetSize already matched';
      buffer = await jpeg.toBuffer();
    } else {
      msg = `Image resized to width: ${targetSize.width}`;
      buffer = await jpeg.resize(targetSize.width).toBuffer();
    }
    logger.timeEnd('processImage', 'info', {
      item, msg, size, step, targetSize,
    });

    return getResponse(buffer);
  } catch (error) {
    const err = getError(error);
    logger.timeEnd('processImage', 'error', {
      err,
      item,
      msg: 'Error in scale.resize()',
      size,
      step,
      targetSize,
    });
    throw err;
  }
};

const uploadImage = async (
  req: Readonly<UploadImageReqOptions>,
): Promise<Readonly<PutObjectOutput>> => {
  const step = req.step + 1;
  const {
    deps: { s3, logger },
  } = req;

  logger.time('uploadImage');

  const outKey = `${req.input.outKeyRoot + req.item.size.name}/${req.input.fileName}`;

  try {
    const result: PutObjectOutput = await s3.putObject({
      Body: req.buffer,
      Bucket: bucket,
      ContentType: 'JPG',
      Key: outKey,
    }).promise();
    logger.timeEnd('uploadImage', 'info', {
      bucket, outKey, step,
    });
    return result;
  } catch (error) {
    const err = getError(error);
    const errObj = {
      bucket, err, msg: 'Error in s3.putObject()', outKey, step,
    };
    logger.timeEnd('uploadImage', 'error', errObj);
    throw err;
  }
};

export const innerPipeline = async (req: Readonly<ImageSizeResponse>): Promise<void> => {
  Object.freeze(req.data);
  const { sizes } = req.data;
  const { deps: { logger } } = req;

  let index = 0;
  let innerReq: ProcessImageReqOptions | null = null;
  try {
    logger.trace({
      msg: 'About to start for...of loop to resize and write images',
      sizes,
    });

    for (const size of sizes) {
      innerReq = {
        deps: req.deps,
        input: req.data,
        item: {
          index,
          size,
        },
        step: 0,
      };

      const processImageResponse = await processImage(innerReq); // #3
      await uploadImage(processImageResponse); // #4

      index += 1;
    }

    logger.trace({
      msg: 'Just finished for...of loop for resize and write images',
    });

    // const logData = util.inspect(req.data);
    // logger.trace({
    //   msg: 'Successfully resized',
    //   logData,
    // });
  } catch (error) {
    const err = getError(error);
    const logData = util.inspect(req.data);
    logger.error({
      err,
      innerReq,
      logData,
      msg: 'Unable to processImage() or uploadImage() due to an error',
    });
    throw err;
  }
};
