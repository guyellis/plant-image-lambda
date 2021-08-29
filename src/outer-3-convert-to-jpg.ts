import { Sharp } from 'sharp';
import { GetImageFromS3Response, GetImageFromS3Data } from './outer-2-get-image-from-s3';
import { getError } from './utils';

const logTimeName = 'convertToJpg';

export interface ConvertToJpgData extends GetImageFromS3Data {
  jpeg: Sharp;
}

export interface ConvertToJpgResponse extends Omit<GetImageFromS3Response, 'data'> {
  data: ConvertToJpgData;
}

export const convertToJpg = (
  req: Readonly<GetImageFromS3Response>,
): Readonly<ConvertToJpgResponse> => {
  const { data, deps: { sharp, logger } } = req;
  const {
    s3Object: {
      ContentType,
      Body,
    },
  } = data;

  logger.time(logTimeName);
  logger.trace({
    method: '3. convertToJpg()',
    msg: `Response content type: ${ContentType}`,
  });
  try {
    const jpeg = sharp(Body as Buffer)
      .jpeg({
        quality: 100,
      });
    const nextData: ConvertToJpgData = {
      ...data,
      jpeg,
    };
    const response: ConvertToJpgResponse = {
      ...req,
      data: nextData,
    };

    logger.timeEnd(logTimeName, 'info');
    return response;
  } catch (error) {
    const err = getError(error);
    logger.timeEnd(logTimeName, 'error', {
      err,
      method: 'convertToJpg()',
      msg: 'convertToJpg error in toBuffer',
    });
    throw err;
  }
};
