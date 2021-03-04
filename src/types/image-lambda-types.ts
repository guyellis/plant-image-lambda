/*
  This file comes from the plant-image-lambda project.

  This file is designed to be shared with other projects that will be receiving
  REST calls from the plant-image-lambda function. It defines the schema of the
  data that will be PUT to the corresponding endpoint.

  At some point in the future this module might be published to Npm to make these
  types available through the regular dependency system. For now it's a copy/paste
  to the project that will be using these types.
*/
import * as t from 'runtypes';

const imageSizeNameSchema = t.Union(
  t.Literal('orig'),
  t.Literal('xl'),
  t.Literal('lg'),
  t.Literal('md'),
  t.Literal('sm'),
  t.Literal('thumb'),
);
export type ImageSizeName = t.Static<typeof imageSizeNameSchema>;

const noteImageSizeSchema = t.Record({
  /**
   * name of the size, e.g. thumb, sm, md, lg, xl
   */
  name: imageSizeNameSchema,
  /**
   *  how many pixels wide, e.g. 100, 500, 1000, 1500, 2000
   */
  width: t.Number,
});
export type NoteImageSize = t.Static<typeof noteImageSizeSchema>;

const imageCompleteMetadataSchema = t.Record({
  /**
   * ImageId
   */
  id: t.String,
  noteid: t.String,
  originalname: t.String,
  userid: t.String,
});
export type ImageCompleteMetadata = t.Static<typeof imageCompleteMetadataSchema>;

export const imageCompleteBodySchema = t.Record({
  metadata: imageCompleteMetadataSchema,
  sizes: t.Array(noteImageSizeSchema),
  trackId: t.String,
});
export type ImageCompleteBody = t.Static<typeof imageCompleteBodySchema>;
