'use strict';

var async = require('async');
var util = require('util');

var bucket = 'i.plaaant.com';

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
  console.log('i-' + ++req.step + ' processImage:', req);
  var gm = req.deps.gm;
  var response = req.input.buffer;
  var item = req.item;
  var targetSize = item.size;
  console.time('processImage');
  // Transform the image buffer in memory.
  var size = req.input.imageSize;

  if(size.width === targetSize.width) {
    req.buffer = response;
    console.timeEnd('processImage');
    return next(null, req);
  }

  var scalingFactor = Math.min(targetSize.width / size.width, targetSize.width / size.height);
  console.log('scalingFactor:', scalingFactor);
  var width = scalingFactor * size.width;
  var height = scalingFactor * size.height;
  gm(response).resize(width, height)
    .toBuffer('JPG', function(err2, buffer) {
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
  console.log('i-' + ++req.step + ' uploadImage:', req);
  console.time('uploadImage');
  var s3 = req.deps.s3;
  var outKey = req.input.outKeyRoot + req.item.size.name + '/' + req.input.fileName;
  console.log('upload to path: ' + outKey);
  s3.putObject({
    Bucket: bucket,
    Key: outKey,
    Body: req.buffer,
    ContentType: 'JPG'
  }, function(err, result) {
    console.timeEnd('uploadImage');
    next(err, result);
  });
}

function pipeline(req, cb) {
  Object.freeze(req.data);
  var sizes = req.data.sizes;
  async.eachOfSeries(sizes, function(size, index, callback) {
    var newReq = {
      item: {
        size: size,
        index: index
      },
      input: req.data,
      deps: req.deps,
      step: 0
    };

    async.waterfall([
      processImage.bind(null, newReq), // #3
      uploadImage, // #4
    ], function(err2) {
      if (err2) {
        console.error('Waterfall error on step ' + index, err2);
      } else {
        console.log('End of step ' + index);
      }
      return callback(err2);
    });
  }, function(eachOfSeriesError) {
    var logData = util.inspect(req.data);
    if (eachOfSeriesError) {
      console.error('----> Unable to resize due to an error', logData, eachOfSeriesError);
    } else {
      console.log('----> Successfully resized ', logData);
    }
    return cb(eachOfSeriesError);
  });
}

module.exports = {
  pipeline: pipeline
};
