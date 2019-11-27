import util from 'util';
import { PutObjectOutput } from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk';
import { TimeEndLoggerFunc, ImageSize, RequestDeps } from './types';
import { ImageSizeResponse, ImageSizeData } from './outer-5-image-size';

const bucket = 'i.plaaant.com';

interface ProcessImageReqOptions {
  item: {
    size: ImageSize;
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
    size: ImageSize;
    index: number;
  };
  input: ImageSizeData;
  buffer: Buffer;
}

function processImage(req: Readonly<ProcessImageReqOptions>): Promise<UploadImageReqOptions> {
  const step = req.step + 1;
  const {
    deps: { gm, logger }, item, input: { buffer: response },
  } = req;
  const { size: targetSize } = item;
  logger.time('processImage');
  const size = req.input.imageSize;

  const getResponse = (buffer: Buffer) => {
    const res: UploadImageReqOptions = {
      buffer,
      deps: req.deps,
      input: req.input,
      item: req.item,
      step,
    };
    return res;
  };

  if (size.width === targetSize.width) {
    (logger.timeEnd as TimeEndLoggerFunc)('processImage', {
      msg: 'width in size and targetSize already matched',
      step,
      item,
      size,
      targetSize,
    });
    return Promise.resolve(getResponse(response));
  }

  const scalingFactor = targetSize.width / size.width;
  const height = scalingFactor * size.height;
  return new Promise((resolve, reject) => {
    gm(response).resize(targetSize.width, height)
      .toBuffer('JPG', (err: Error|null, buffer: Buffer) => {
        if (err) {
          // @ts-ignore
          logger.timeEnd.error('processImage', {
            msg: 'Error in gm(response).resize()',
            err,
            step,
            item,
            size,
            targetSize,
            scalingFactor,
          });
          return reject(err);
        }
        (logger.timeEnd as TimeEndLoggerFunc)('processImage', {
          step, item, size, targetSize, scalingFactor,
        });
        return resolve(getResponse(buffer));
      });
  });
}

function uploadImage(req: Readonly<UploadImageReqOptions>): Promise<Readonly<PutObjectOutput>> {
  const step = req.step + 1;
  const {
    deps: { s3, logger },
  } = req;

  logger.time('uploadImage');

  const outKey = `${req.input.outKeyRoot + req.item.size.name}/${req.input.fileName}`;

  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: bucket,
      Key: outKey,
      Body: req.buffer,
      ContentType: 'JPG',
    }, (err: AWSError, result: PutObjectOutput) => {
      if (err) {
        const errObj = {
          msg: 'Error in s3.putObject()', err, bucket, outKey, step,
        };
        (logger.timeEnd.error as TimeEndLoggerFunc)('uploadImage', errObj);
        return reject(err);
      }
      (logger.timeEnd as TimeEndLoggerFunc)('uploadImage', {
        bucket, outKey, step,
      });
      return resolve(result);
    });
  });
}

export const innerPipeline = async (req: Readonly<ImageSizeResponse>): Promise<void> => {
  Object.freeze(req.data);
  const { sizes } = req.data;
  const { deps: { logger } } = req;

  let index = 0;
  let innerReq: ProcessImageReqOptions | null = null;
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const size of sizes) {
      innerReq = {
        item: {
          size,
          index,
        },
        input: req.data,
        deps: req.deps,
        step: 0,
      };

      // eslint-disable-next-line no-await-in-loop
      const processImageResponse = await processImage(innerReq); // #3
      // eslint-disable-next-line no-await-in-loop
      await uploadImage(processImageResponse); // #4

      index += 1;
    }

    const logData = util.inspect(req.data);
    logger.trace({
      msg: 'Successfully resized',
      logData,
    });
  } catch (err) {
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
