

// var gm = require('gm').subClass({
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
function fixExif(req) {
  const { data, deps: { gm, logger } } = req;
  const method = '4. fixExif()';

  logger.trace({
    method,
  });

  return new Promise((resolve, reject) => {
    gm(data.buffer)
      .autoOrient()
      .toBuffer('JPG', (err, buffer) => {
        if (err) {
          logger.error({
            method,
            err,
          });
          return reject(err);
        }
        data.buffer = buffer;
        return resolve(req);
      });
  });
}

module.exports = fixExif;
