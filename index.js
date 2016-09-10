// Original idea and code from:
// http://jice.lavocat.name/blog/2015/image-conversion-using-amazon-lambda-and-s3-in-node.js/
'use strict';

var async = require('async');
var path = require('path');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({
  imageMagick: true
});
var util = require('util');
var s3 = new AWS.S3();

var sizes = [
  {width: 2000, name: 'xl'},
  {width: 1500, name: 'lg'},
  {width: 1000, name: 'md'},
  {width: 500, name: 'sm'},
  {width: 100, name: 'thumb'}
];
var bucket = 'i.plaaant.com';

function extractFromEvent(event) {
  // Object key may have spaces or unicode non-ASCII characters.
  var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  // Infer the image type.
  var typeMatch = key.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.error('unable to infer image type for key ' + key);
    return false;
  }
  var imageType = typeMatch[1].toLowerCase();

  if (['jpg', 'gif', 'png', 'eps'].indexOf(imageType) === -1) {
    console.log('skipping non-image ' + key);
    return false;
  }

  return {
    bucketName: event.Records[0].s3.bucket.name,
    key: key,
    fileName: path.basename(key),
    imageType: imageType
  };
}

// #1
// data has: bucketName, key, fileName, imageType
function getImageFromS3(data, cb) {
  console.time('downloadImage');
  console.log('getImageFromS3');
  // Download the image from S3 into a buffer.
  // sadly it downloads the image several times, but we couldn't place it outside
  // the variable was not recognized
  s3.getObject({
    Bucket: data.bucketName,
    Key: data.key
  }, function(err, s3Object) {
    data.s3Object = s3Object;
    Object.freeze(data);
    console.timeEnd('downloadImage');
    return cb(err, data);
  });
}

// #2
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
function convertToJpg(data, next) {
  // convert eps images to png
  console.time('convertToJpg');
  var response = data.input.s3Object;
  console.log('Reponse content type: ' + response.ContentType);
  console.log('Conversion');
  gm(response.Body)
    .antialias(true)
    .density(300)
    .toBuffer('JPG', function(err, buffer) {
      data.buffer = buffer;
      console.timeEnd('convertToJpg');
      next(err, data);
    });
}

// #3
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
  var response = data.buffer;
  var item = data.item;
  var targetSize = item.size;
  var index = item.index;
  console.time('processImage');
  console.log('processImage');
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


function handler(event, ctx) {
  // Read options from the event.
  console.log('Reading options from event:\n', util.inspect(event, {
    depth: 5
  }));

  var parsedEvent = extractFromEvent(event);

  getImageFromS3(parsedEvent, function(err, data) { // #1
    if(data.key.indexOf('/orig/') === -1) {
      console.log('Not processing ' + data.key + ' because it is not an original image.');
      return ctx.done();
    }
    async.forEachOf(sizes, function(size, index, callback) {
      var data2 = {
        item: {
          size: size,
          index: index
        },
        input: data
      };

      async.waterfall([
        convertToJpg.bind(null, data2), // #2
        processImage, // #3
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
      ctx.done();
    });
  });
}

module.exports = {
  extractFromEvent: extractFromEvent,
  handler: handler
};

