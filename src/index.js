'use strict';

var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({
  imageMagick: true
});
var util = require('util');
var s3 = new AWS.S3();
var outer = require('./outer');

var sizes = [
  {width: 2000, name: 'xl'},
  // {width: 1500, name: 'lg'},
  // {width: 1000, name: 'md'},
  // {width: 500, name: 'sm'},
  // {width: 100, name: 'thumb'}
];
var bucket = 'i.plaaant.com';


// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     fileName
//     imageType
//     s3Object
//   item:
//     size:
//       width
//       name
//     index
//   buffer
function processImage(data, next) {
  var response = data.input.buffer;
  var item = data.item;
  var targetSize = item.size;
  var index = item.index;
  console.time('processImage');
  console.log('processImage', util.inspect(data));
  console.log('run ' + item.index + ' size: ' + targetSize.width + ' name: ' + targetSize.name);
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
        console.timeEnd('processImage');
        data.buffer = buffer;
        console.timeEnd('processImage');
        next(err2, data);
      });
  });
}

// #4
// data has:
//   input: (frozen)
//     bucketName
//     key
//     fileName
//     imageType
//     s3Object
//   item:
//     size:
//       width
//       name
//     index
//   buffer
function uploadImage(data, next) {
  console.time('uploadImage');
  var index = data.item.index;
  console.log('upload: ' + index);
  // TODO: Fix below
  var outKey = '/test/' + data.item.size.name + '/' + data.input.fileName;
  console.log('upload to path: ' + outKey);
  s3.putObject({
    Bucket: bucket,
    Key: outKey,
    Body: data.buffer,
    ContentType: 'JPG'
  }, next);
  console.timeEnd('uploadImage');
}

function innerPipeline(data, cb) {
  async.forEachOf(sizes, function(size, index, callback) {
    var data2 = {
      item: {
        size: size,
        index: index
      },
      input: data
    };

    async.waterfall([
      processImage.bind(null, data2), // #3
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
    var logData = util.inspect(data);
    if (err3) {
      console.error('----> Unable to resize due to an error', logData, err3);
    } else {
      console.log('----> Successfully resized ', logData);
    }
    return cb(err3);
  });
}

function handler(event, ctx) {
  console.log('Reading options from event:\n', util.inspect(event, {
    depth: 5
  }));

  outer.pipeline(event, function(err, data) {
    if(err) {
      return ctx.done(err);
    } else {
      innerPipeline(data, function(err2) {
        ctx.done(err2);
      });
    }
  });
}

module.exports = {
  handler: handler
};

