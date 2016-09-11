'use strict';

var async = require('async');

var convertToJpg = require('./outer-3-convert-to-jpg').convertToJpg;
var fixExif = require('./outer-4-fix-exif').fixExif;
var getImageFromS3 = require('./outer-2-get-image-from-s3').getImageFromS3;
var getImageSize = require('./outer-5-image-size').getImageSize;
var extractFromEvent = require('./outer-1-extract-from-event').extractFromEvent;

/**
 * pipeline does image pre-processing before we start resizing etc.
 * The output is a buffer/object/something that can then be sized etc. by
 * each of the different output sizes.
 * @param {object} event - event that call the lambda function
 * @param {function} cb - callback to call once done
 * @returns {undefined}
 */
function pipeline(event, cb) {

  async.waterfall([
    extractFromEvent.bind(null, event),
    getImageFromS3,
    convertToJpg,
    fixExif,
    getImageSize
  ], cb);

}

module.exports = {
  pipeline: pipeline
};
