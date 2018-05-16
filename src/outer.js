

const async = require('async');

const { convertToJpg } = require('./outer-3-convert-to-jpg');
const { fixExif } = require('./outer-4-fix-exif');
const { getImageFromS3 } = require('./outer-2-get-image-from-s3');
const { getImageSize } = require('./outer-5-image-size');
const { extractFromEvent } = require('./outer-1-extract-from-event');
const { pipeline: innerPipeline } = require('./inner');
const { httpPost } = require('./write-to-server');

/**
 * pipeline does image pre-processing before we start resizing etc.
 * The output is a buffer/object/something that can then be sized etc. by
 * each of the different output sizes.
 * @param {object} req - request object with event and deps
 * @param {function} cb - callback to call once done
 * @returns {undefined}
 */
function pipeline(req, cb) {
  async.waterfall([
    extractFromEvent.bind(null, req),
    getImageFromS3,
    convertToJpg,
    fixExif,
    getImageSize,
    innerPipeline,
    httpPost,
  ], cb);
}

module.exports = {
  pipeline,
};
