import fetch from 'node-fetch';
import env from './env';
import { PlantRequest } from './types';

export const writeToServer = async (req: PlantRequest): Promise<PlantRequest> => {
  const {
    PLANT_IMAGE_COMPLETE,
    PLANT_IMAGE_HOST,
    PLANT_IMAGE_PORT,
  } = env;

  const {
    deps: {
      logger,
    },
    data: {
      s3Object: {
        Metadata: metadata,
      },
      sizes,
    },
  } = req;
  const { presets } = logger;
  const { trackId } = presets ?? {};

  const putData = JSON.stringify({
    metadata,
    sizes,
    trackId, // Allows receiver to use same trackId for logging
  });

  const port = parseInt(PLANT_IMAGE_PORT, 10);
  const protocol = port === 443 ? 'https' : 'http';

  const url = `${protocol}://${PLANT_IMAGE_HOST}/api/image-complete?token=${PLANT_IMAGE_COMPLETE}`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData),
    },
  };

  try {
    // @ts-ignore TODO Fix this
    const response = await fetch(url, options);
    const logData = {
      env,
      msg: 'Image sizing metadata update sent',
      options,
      putData,
      status: response.status,
      url,
    };
    if (response.status === 200) {
      logger.trace(logData);
    } else {
      logger.error({
        ...logData,
        msg: `Unexpected response status ${response.status} in PUT call`,
      });
    }
  } catch (err) {
    logger.error({
      env,
      msg: 'Error sending image sizing metadata',
      options,
      putData,
      url,
    });
  }

  return req;
};
