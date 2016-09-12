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
  var index = item.index;
  console.time('processImage');
  // Transform the image buffer in memory.
  gm(response).size(function(err, size) {
    // Infer the scaling factor to avoid stretching the image unnaturally.
    if(err) {
      console.log('Error in gm(response):', err);
      console.timeEnd('processImage');
      return next(err);
    }

    var scalingFactor = Math.min(targetSize.width / size.width, targetSize.width / size.height);
    console.log('run ' + index + ' scalingFactor : ' + scalingFactor);
    var width = scalingFactor * size.width;
    var height = scalingFactor * size.height;
    console.log('run ' + index + ' width : ' + width);
    console.log('run ' + index + ' height : ' + height);
    this.resize(width, height)
      .toBuffer('JPG', function(err2, buffer) {
        req.buffer = buffer;
        console.timeEnd('processImage');
        next(err2, req);
      });
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
  }, function(err3) {
    var logData = util.inspect(req.data);
    if (err3) {
      console.error('----> Unable to resize due to an error', logData, err3);
    } else {
      console.log('----> Successfully resized ', logData);
    }
    return cb(err3);
  });
}

module.exports = {
  pipeline: pipeline
};
