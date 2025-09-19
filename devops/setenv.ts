import fs from 'fs';
import path from 'path';

const {
  LALOG_LEVEL,
  LOGGLY_TOKEN,
  PLANT_IMAGE_COMPLETE,
  PLANT_IMAGE_HOST,
  PLANT_IMAGE_PORT,
} = process.env;

if (
  !LALOG_LEVEL
  || !LOGGLY_TOKEN
  || !PLANT_IMAGE_COMPLETE
  || !PLANT_IMAGE_HOST
  || !PLANT_IMAGE_PORT
) {
  // eslint-disable-next-line no-console
  console.error(`Missing env value(s):
    LALOG_LEVEL: '${LALOG_LEVEL}',
    LOGGLY_TOKEN: '${LOGGLY_TOKEN}',
    PLANT_IMAGE_COMPLETE: '${PLANT_IMAGE_COMPLETE}',
    PLANT_IMAGE_HOST: '${PLANT_IMAGE_HOST}',
    PLANT_IMAGE_PORT: '${PLANT_IMAGE_PORT}',
  `);
  process.exit(1);
}

const envTs = `
export default {
  LALOG_LEVEL: '${LALOG_LEVEL}',
  LOGGLY_TOKEN: '${LOGGLY_TOKEN}',
  PLANT_IMAGE_COMPLETE: '${PLANT_IMAGE_COMPLETE}',
  PLANT_IMAGE_HOST: '${PLANT_IMAGE_HOST}',
  PLANT_IMAGE_PORT: '${PLANT_IMAGE_PORT}',
};
`;

fs.writeFileSync(path.join(__dirname, 'env.ts'), envTs);
