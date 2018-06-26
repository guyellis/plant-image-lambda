
// #3
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
function convertToJpg(req) {
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
    gm(Body)
      .antialias(true)
      .density(300)
      .toBuffer('JPG', (err, buffer) => {
        if (err) {
          logger.error({
            msg: 'convertToJpg error in toBuffer',
            method: 'convertToJpg()',
            err,
          });
          return reject(err);
        }
        data.buffer = buffer;
        logger.time('convertToJpg');
        return resolve(req);
      });
  });
}

module.exports = convertToJpg;
