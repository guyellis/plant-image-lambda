

const convertToJpg = require('./outer-3-convert-to-jpg');
const fixExif = require('./outer-4-fix-exif');
const getImageFromS3 = require('./outer-2-get-image-from-s3');
const getImageSize = require('./outer-5-image-size');
const extractFromEvent = require('./outer-1-extract-from-event');
const innerPipeline = require('./inner');
const httpPost = require('./write-to-server');

/**
 * pipeline does image pre-processing before we start resizing etc.
 * The output is a buffer/object/something that can then be sized etc. by
 * each of the different output sizes.
 * @param {object} req - request object with event and deps
 * @param {function} cb - callback to call once done
 * @returns {undefined}
 */
async function pipeline(req) {
  const { deps: { logger } } = req;
  try {
    extractFromEvent(req);
    await getImageFromS3(req);
    await convertToJpg(req);
    await fixExif(req);
    await getImageSize(req);
    await innerPipeline(req);
    return await httpPost(req);
  } catch (err) {
    return logger.error({
      msg: 'Error in pipeline()',
      err,
    });
  }
}

module.exports = pipeline;
