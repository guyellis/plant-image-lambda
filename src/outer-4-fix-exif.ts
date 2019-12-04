/*
import { ConvertToJpgResponse, ConvertToJpgData } from './outer-3-convert-to-jpg';

export const fixExif = async (
  req: Readonly<ConvertToJpgResponse>): Promise<Readonly<ConvertToJpgResponse>> => {
  const { data, deps: { sharp, logger } } = req;
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
*/
