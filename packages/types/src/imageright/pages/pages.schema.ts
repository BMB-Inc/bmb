import { z } from "zod/v4";

const imageMetadataSchema = z.object({
  id: z.number(),
  imageType: z.number(),
  contentType: z.number(),
  version: z.number(),
  size: z.number(),
  extension: z.string({ error: "Extension is required" }),
  imageData: z.string({ error: "Image data is required" }),
});

const latestImagesSchema = z.object({
  rotation: z.number(),
  preRotation: z.number(),
  imageMetadata: z.array(imageMetadataSchema),
});

const marksSchema = z.object({
  binaryData: z.string(),
  color: z.number(),
  description: z.string(),
  fileTypeId: z.number(),
  markId: z.number(),
  programmaticId: z.number(),
  hasIcon: z.boolean(),
});

export const imagerightPageSchema = z.object({
  documentId: z.number(),
  id: z.number(),
  description: z.string(),
  pagenumber: z.number(),
  version: z.number(),
  deleted: z.boolean(),
  deleteOpType: z.number(),
  latestImages: latestImagesSchema,
  marks: z.array(marksSchema), // Array of marks - structure unknown from sample
  importedFrom: z.string(),
  createdById: z.number(),
  firstVersionCreated: z.string(), // ISO date string
  latestVersionCreated: z.string(), // ISO date string
  pageSize: z.number(),
  imagerightUrl: z.string(),
});

export const imagerightPagesSchema = z.array(imagerightPageSchema);

export type ImagerightPage = z.infer<typeof imagerightPageSchema>;
export type ImagerightPages = z.infer<typeof imagerightPagesSchema>;
export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export type LatestImages = z.infer<typeof latestImagesSchema>;

export const imagerightPageParamsSchema = z.object({
  documentId: z.number().optional(),
});

export type ImagerightPageParams = z.infer<typeof imagerightPageParamsSchema>;
