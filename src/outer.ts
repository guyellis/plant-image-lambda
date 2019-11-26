import { getImageSize } from './outer-5-image-size';
import { fixExif } from './outer-4-fix-exif';

import { convertToJpg } from './outer-3-convert-to-jpg';
import { getImageFromS3 } from './outer-2-get-image-from-s3';
import { extractFromEvent } from './outer-1-extract-from-event';
import { writeToServer as httpPost } from './write-to-server';

import { innerPipeline } from './inner';

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
