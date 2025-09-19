import env from './env';
import { ImageSizeResponse } from './outer-5-image-size';
import { ImageCompleteBody } from './types/image-lambda-types';

export const writeToServer = async (
  req: Readonly<ImageSizeResponse>,
): Promise<Readonly<Response | null>> => {
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

  logger.trace({ env, msg: 'writeToServer(): Started', sizes });
  const { presets } = logger;
  const { trackId = '' } = presets ?? {};

  const putData: ImageCompleteBody = {
    metadata,
    sizes,
    trackId, // Allows receiver to use same trackId for logging
  } as ImageCompleteBody; // TODO: Remove this cast

  logger.info({ msg: 'writeToServer(): putData', putData });

  const port = parseInt(PLANT_IMAGE_PORT, 10);
  const protocol = port === 443 ? 'https' : 'http';

  // When we're testing we are going to be setting the port to an arbitrary
  // high value that will map back to where our test server is running.
  // In this case we'll want to append :<port> to the host.
  const portSuffix = port !== 443 && port !== 80 ? `:${port}` : '';

  const url = `${protocol}://${PLANT_IMAGE_HOST}${portSuffix}/api/image-complete?token=${PLANT_IMAGE_COMPLETE}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const options: RequestInit = {
    body: JSON.stringify(putData),
    headers,
    method: 'PUT',
  };
  let response: Response | null = null;

  logger.trace({ msg: 'writeToServer(): About to call fetch()', options, url });

  try {
    response = await fetch(url, options);
    const logData = {
      env,
      msg: 'Image sizing metadata update sent and received',
      options,
      putData,
      status: response.status,
      url,
    };
    if (response.status === 200) {
      logger.info(logData);
    } else {
      logger.error({
        ...logData,
        msg: `Unexpected response status ${response.status} in PUT call`,
      });
    }
  } catch {
    logger.error({
      env,
      msg: 'Error sending image sizing metadata',
      options,
      putData,
      url,
    });
  }

  return response;
};
