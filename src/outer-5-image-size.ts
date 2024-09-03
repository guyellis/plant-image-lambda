import { Metadata } from 'sharp';

import { calcSizes } from './image-sizes';
import { ConvertToJpgResponse, ConvertToJpgData } from './outer-3-convert-to-jpg';
import { PlantImageLogger } from './logger';
import { NoteImageSize } from './types/image-lambda-types';
import { getError } from './utils';

export interface ImageSizeData extends ConvertToJpgData {
  imageSize: NoteImageSize;
  sizes: NoteImageSize[];
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
    channels,
    chromaSubsampling,
    density,
    depth,
    format,
    hasAlpha,
    hasProfile,
    height,
    isProgressive,
    size,
    space,
    width,
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
  req: Readonly<ConvertToJpgResponse>,
): Promise<Readonly<ImageSizeResponse>> => {
  const { data, deps: { logger } } = req;
  const method = '5. getImageSize()';

  try {
    logger.trace({
      method,
    });

    const { jpeg } = data;
    const metadata = await jpeg.metadata();

    traceLogMetadata(metadata, logger);

    const { width } = metadata;
    if (!width) {
      throw new Error(`No width ${width} in metadata`);
    }

    const imageSize: NoteImageSize = {
      name: 'orig',
      width,
    };

    // const nextData: ImageSizeData = {
      const nextData = {
        ...data,
      imageSize,
      // metadata: {
      //   // TODO: Fix all of these
      //   id: '',
      //   noteid: '',
      //   originalname: '',
      //   userid: '',
      // },
      sizes: calcSizes(imageSize.width),
    };

    const response: ImageSizeResponse = {
      ...req,
      data: nextData,
    } as ImageSizeResponse; // TODO: Get rid of this cast

    logger.trace({
      imageSize,
      msg: '5. getImageSize got size',
      sizes: nextData.sizes,
    });

    return response;
  } catch (error) {
    const err = getError(error);
    logger.error({
      err,
      method,
    });
    throw err;
  }
};
