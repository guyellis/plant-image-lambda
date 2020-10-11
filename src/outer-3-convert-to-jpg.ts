import { Sharp } from 'sharp';
import { GetImageFromS3Response, GetImageFromS3Data } from './outer-2-get-image-from-s3';

const logTimeName = 'convertToJpg';

export interface ConvertToJpgData extends GetImageFromS3Data {
  jpeg: Sharp;
}

export interface ConvertToJpgResponse extends Omit<GetImageFromS3Response, 'data'> {
  data: ConvertToJpgData;
}

export const convertToJpg = async (
  req: Readonly<GetImageFromS3Response>,
): Promise<Readonly<ConvertToJpgResponse>> => {
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
    const jpeg = await sharp(Body as Buffer)
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

    logger.timeEnd(logTimeName);
    return response;
  } catch (err) {
    logger.timeEnd(logTimeName, 'error', {
      err,
      method: 'convertToJpg()',
      msg: 'convertToJpg error in toBuffer',
    });
    throw err;
  }
};
