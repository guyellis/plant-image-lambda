import { ConvertToJpgResponse, ConvertToJpgData } from './outer-3-convert-to-jpg';

// var gm = import('gm').subClass({
//   imageMagick: true
// });

// #4
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
export const fixExif = async (
  req: Readonly<ConvertToJpgResponse>): Promise<ConvertToJpgResponse> => {
  const { data, deps: { gm, logger } } = req;
  const method = '4. fixExif()';

  logger.trace({
    method,
  });

  return new Promise((resolve, reject) => {
    gm(data.buffer)
      .autoOrient()
      .toBuffer('JPG', (err: Error | null, buffer: Buffer) => {
        if (err) {
          logger.error({
            method,
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

        return resolve(response);
      });
  });
};
