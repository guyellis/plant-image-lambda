'use strict';

const async = require('async');
const util = require('util');

const bucket = 'i.plaaant.com';

// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     fileName
//     imageType
//     s3Object
//     buffer
//   item:
//     size:
//       width
//       name
//     index
function processImage(req, next) {
  console.log(`i-${++req.step} processImage:`, req);
  const gm = req.deps.gm;
  const response = req.input.buffer;
  const item = req.item;
  const targetSize = item.size;
  console.time('processImage');
  const size = req.input.imageSize;

  if (size.width === targetSize.width) {
    req.buffer = response;
    console.timeEnd('processImage');
    return next(null, req);
  }

  const scalingFactor = targetSize.width / size.width;
  console.log('scalingFactor:', scalingFactor);
  const height = scalingFactor * size.height;
  gm(response).resize(targetSize.width, height)
    .toBuffer('JPG', (err2, buffer) => {
      req.buffer = buffer;
      console.timeEnd('processImage');
      next(err2, req);
    });
}

// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     outKeyRoot
//     fileName
//     imageType
//     s3Object
//   item:
//     size:
//       width
//       name
//     index
//   buffer
function uploadImage(req, next) {
  console.log(`i-${++req.step} uploadImage:`, req);
  console.time('uploadImage');
  const s3 = req.deps.s3;
  const outKey = `${req.input.outKeyRoot + req.item.size.name}/${req.input.fileName}`;
  console.log(`upload to path: ${outKey}`);
  s3.putObject({
    Bucket: bucket,
    Key: outKey,
    Body: req.buffer,
    ContentType: 'JPG',
  }, (err, result) => {
    console.timeEnd('uploadImage');
    next(err, result);
  });
}

function pipeline(req, cb) {
  Object.freeze(req.data);
  const sizes = req.data.sizes;
  async.eachOfSeries(sizes, (size, index, callback) => {
    const innerReq = {
      item: {
        size,
        index,
      },
      input: req.data,
      deps: req.deps,
      step: 0,
    };

    async.waterfall([
      processImage.bind(null, innerReq), // #3
      uploadImage, // #4
    ], (err2) => {
      if (err2) {
        console.error(`Waterfall error on step ${index}`, err2);
      } else {
        console.log(`End of step ${index}`);
      }
      return callback(err2);
    });
  }, (eachOfSeriesError) => {
    const logData = util.inspect(req.data);
    if (eachOfSeriesError) {
      console.error('----> Unable to resize due to an error', logData, eachOfSeriesError);
    } else {
      console.log('----> Successfully resized ', logData);
    }
    return cb(eachOfSeriesError, req);
  });
}

module.exports = {
  pipeline,
};
