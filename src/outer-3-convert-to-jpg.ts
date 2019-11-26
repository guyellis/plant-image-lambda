import { GetImageFromS3Response, GetImageFromS3Data } from './outer-2-get-image-from-s3';

// #3
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object


export interface ConvertToJpgData extends GetImageFromS3Data {
  buffer: Buffer;
}

export interface ConvertToJpgResponse extends Omit<GetImageFromS3Response, 'data'> {
  data: ConvertToJpgData;
}

export const convertToJpg = async (
  req: GetImageFromS3Response): Promise<ConvertToJpgResponse> => {
  const { data, deps: { gm, logger } } = req;
  const {
    s3Object: {
      ContentType,
      Body,
    },
  } = data;

  logger.time('convertToJpg');
  logger.trace({
    msg: `Response content type: ${ContentType}`,
    method: '3. convertToJpg()',
  });
  return new Promise((resolve, reject) => {
    gm(Body as string)
      .antialias(true)
      .density(300, 300)
      .toBuffer('JPG', (err: Error|null, buffer: Buffer) => {
        if (err) {
          logger.error({
            msg: 'convertToJpg error in toBuffer',
            method: 'convertToJpg()',
            err,
          });
          return reject(err);
        }
        const nextData: ConvertToJpgData = {
          ...data,
          buffer,
        };
        const response: ConvertToJpgResponse = {
          ...req,
          data: nextData,
        };

        logger.time('convertToJpg');
        return resolve(response);
      });
  });
};
