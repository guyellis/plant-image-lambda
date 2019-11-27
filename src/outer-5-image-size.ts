import { Dimensions } from 'gm';

import { calcSizes } from './image-sizes';
import { ConvertToJpgResponse, ConvertToJpgData } from './outer-3-convert-to-jpg';
import { ImageSize } from './types';

export interface ImageSizeData extends ConvertToJpgData {
  imageSize: Dimensions;
  sizes: ImageSize[];
}

export interface ImageSizeResponse extends Omit<ConvertToJpgResponse, 'data'> {
  data: ImageSizeData;
}

// #5
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
export const getImageSize = async (
  req: Readonly<ConvertToJpgResponse>): Promise<Readonly<ImageSizeResponse>> => {
  const { data, deps: { gm, logger } } = req;
  const method = '5. getImageSize()';

  logger.trace({
    method,
  });

  return new Promise((resolve, reject) => {
    gm(data.buffer).size((err: Error|null, size: Dimensions) => {
      if (err) {
        logger.error({
          method,
          err,
        });
        return reject(err);
      }

      const nextData: ImageSizeData = {
        ...data,
        imageSize: size,
        sizes: calcSizes(size.width),
      };

      const response: ImageSizeResponse = {
        ...req,
        data: nextData,
      };

      logger.trace({
        msg: '5. getImageSize got size',
        size,
        sizes: nextData.sizes,
      });
      return resolve(response);
    });
  });
};
