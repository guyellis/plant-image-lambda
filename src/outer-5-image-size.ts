import { Metadata } from 'sharp';

import { calcSizes } from './image-sizes';
import { ConvertToJpgResponse, ConvertToJpgData } from './outer-3-convert-to-jpg';
import { ImageSize } from './types';
import { PlantImageLogger } from './logger';

export interface ImageSizeData extends ConvertToJpgData {
  imageSize: ImageSize;
  sizes: ImageSize[];
}

export interface ImageSizeResponse extends Omit<ConvertToJpgResponse, 'data'> {
  data: ImageSizeData;
}

const traceLogMetadata = (metadata: Metadata, logger: PlantImageLogger): void => {
  const {
    format,
    size,
    width,
    height,
    space,
    channels,
    depth,
    density,
    chromaSubsampling,
    isProgressive,
    hasProfile,
    hasAlpha,
  } = metadata;
  logger.trace({
    format,
    size,
    width,
    height,
    space,
    channels,
    depth,
    density,
    chromaSubsampling,
    isProgressive,
    hasProfile,
    hasAlpha,
  });
};

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
  const { data, deps: { logger } } = req;
  const method = '5. getImageSize()';

  try {
    logger.trace({
      method,
    });

    const { jpeg } = data;
    const metadata = await jpeg.metadata();

    traceLogMetadata(metadata, logger);

    const { width, height } = metadata;
    if (!width) {
      throw new Error(`No width ${width} in metadata`);
    }

    const imageSize: ImageSize = {
      width,
      height,
      name: 'original',
    };

    const nextData: ImageSizeData = {
      ...data,
      imageSize,
      sizes: calcSizes(imageSize.width),
    };

    const response: ImageSizeResponse = {
      ...req,
      data: nextData,
    };

    logger.trace({
      msg: '5. getImageSize got size',
      imageSize,
      sizes: nextData.sizes,
    });

    return response;
  } catch (err) {
    logger.error({
      method,
      err,
    });
    throw err;
  }
};
