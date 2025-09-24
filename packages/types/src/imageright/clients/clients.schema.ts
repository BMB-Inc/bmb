import { z } from "zod/v4";

// Schema for client attributes
export const imagerightClientAttributeSchema = z.object({
  displayName: z.string(),
  name: z.string(),
  value: z.string(),
  attributeType: z.number(),
});

export const imagerightClientSchema = z.object({
  id: z.number(),
  fileTypeId: z.number(),
  fileTypeName: z.string(),
  fileTypeDescription: z.string(),
  drawerId: z.number(),
  drawerName: z.string(),
  drawerDescription: z.string(),
  hasNotes: z.null().or(z.boolean()),
  notesId: z.number(),
  description: z.string(),
  fileNumberPart1: z.string(),
  fileNumberPart2: z.string(),
  fileNumberPart3: z.string(),
  isTemporary: z.boolean(),
  isDeleted: z.boolean(),
  dateLastOpened: z.string(),
  lastModified: z.string(),
  dateCreated: z.string(),
  attributes: z.array(imagerightClientAttributeSchema),
  effectivePermissions: z.number(),
  isFrozen: z.boolean(),
  locationName: z.null().or(z.string()),
});

export type ImagerightClientAttribute = z.infer<
  typeof imagerightClientAttributeSchema
>;
export type ImagerightClient = z.infer<typeof imagerightClientSchema>;
