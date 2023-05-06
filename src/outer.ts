import { getImageSize } from './outer-5-image-size';
// import { fixExif } from './outer-4-fix-exif';

import { convertToJpg } from './outer-3-convert-to-jpg';
import { getImageFromS3 } from './outer-2-get-image-from-s3';
import { extractFromEvent, BasicRequest } from './outer-1-extract-from-event';
import { writeToServer as httpPost } from './write-to-server';

import { innerPipeline } from './inner';

/**
 * pipeline does image pre-processing before we start resizing etc.
 * The output is a buffer/object/something that can then be sized etc. by
 * each of the different output sizes.
 * @param req - request object with event and deps
 */
export const pipeline = async (req: Readonly<BasicRequest>): Promise<Readonly<Response | null>> => {
  const extractedRequest = extractFromEvent(req);
  const imageFromS3 = await getImageFromS3(extractedRequest);
  const jpgResponse = convertToJpg(imageFromS3);
  // const exifResponse = await fixExif(jpgResponse);
  const imageSizeResponse = await getImageSize(jpgResponse);
  await innerPipeline(imageSizeResponse);
  return httpPost(imageSizeResponse);
};
