import util from 'util';

const bucket = 'i.plaaant.com';

// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     fileName
//     imageType
//     s3Object
//     buffer
//   item:
//     size:
//       width
//       name
//     index
/**
 * processImage
 * @param {Request} req
 */
function processImage(req: any) {
  req.step += 1;
  const {
    deps: { gm, logger }, step, item, input: { buffer: response },
  } = req;
  const { size: targetSize } = item;
  logger.time('processImage');
  const size = req.input.imageSize;

  if (size.width === targetSize.width) {
    req.buffer = response;
    (logger.timeEnd as TimeEndLoggerFunc)('processImage', {
      msg: 'width in size and targetSize already matched',
      step,
      item,
      size,
      targetSize,
    });
    return Promise.resolve(req);
  }

  const scalingFactor = targetSize.width / size.width;
  const height = scalingFactor * size.height;
  return new Promise((resolve, reject) => {
    gm(response).resize(targetSize.width, height)
      .toBuffer('JPG', (err: any, buffer: any) => {
        if (err) {
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
        req.buffer = buffer;
        (logger.timeEnd as TimeEndLoggerFunc)('processImage', {
          step, item, size, targetSize, scalingFactor,
        });
        return resolve(req);
      });
  });
}

// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     outKeyRoot
//     fileName
//     imageType
//     s3Object
//   item:
//     size:
//       width
//       name
//     index
//   buffer
function uploadImage(req: any) {
  req.step += 1;
  const {
    deps: { s3, logger }, step,
  } = req;

  logger.time('uploadImage');

  const outKey = `${req.input.outKeyRoot + req.item.size.name}/${req.input.fileName}`;

  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: bucket,
      Key: outKey,
      Body: req.buffer,
      ContentType: 'JPG',
    }, (err: any, result: any) => {
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

async function pipeline(req: PlantRequest) {
  Object.freeze(req.data);
  const { sizes } = req.data;
  const { deps: { logger } } = req;

  let index = 0;
  let innerReq;
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
      await processImage(innerReq); // #3
      // eslint-disable-next-line no-await-in-loop
      await uploadImage(innerReq); // #4

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
}

module.exports = pipeline;
