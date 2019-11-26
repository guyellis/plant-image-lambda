import { getImageSize } from './outer-5-image-size';

const convertToJpg = require('./outer-3-convert-to-jpg');
const fixExif = require('./outer-4-fix-exif');
const getImageFromS3 = require('./outer-2-get-image-from-s3');
const extractFromEvent = require('./outer-1-extract-from-event');
const innerPipeline = require('./inner');
const httpPost = require('./write-to-server');

/**
 * pipeline does image pre-processing before we start resizing etc.
 * The output is a buffer/object/something that can then be sized etc. by
 * each of the different output sizes.
 * @param {object} req - request object with event and deps
 * @returns {Promise}
 */
async function pipeline(req: PlantRequest) {
  extractFromEvent(req);
  await getImageFromS3(req);
  await convertToJpg(req);
  await fixExif(req);
  await getImageSize(req);
  await innerPipeline(req);
  return httpPost(req);
}

module.exports = pipeline;
