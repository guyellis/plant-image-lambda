
import { calcSizes } from './image-sizes';

// #5
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
function getImageSize(req: PlantRequest) {
  const { data, deps: { gm, logger } } = req;
  const method = '5. getImageSize()';

  logger.trace({
    method,
  });

  return new Promise((resolve, reject) => {
    gm(data.buffer).size((err: any, size: any) => {
      if (err) {
        logger.error({
          method,
          err,
        });
        return reject(err);
      }
      data.imageSize = size;
      data.sizes = calcSizes(size.width);
      logger.trace({
        msg: '5. getImageSize got size',
        size,
        sizes: data.sizes,
      });
      return resolve(req);
    });
  });
}

module.exports = getImageSize;
