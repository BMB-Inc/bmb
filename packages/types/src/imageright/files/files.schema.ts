import { z } from "zod/v4";

const fileAttributeSchema = z.object({
  displayName: z.string(),
  name: z.string(),
  value: z.string(),
  attributeType: z.number(),
});

const attributeSchema = z.object({
  DisplayName: z.string(),
  Name: z.string(),
  Id: z.number(),
});

export const filesSchema = z.object({
  id: z.number(),
  fileTypeId: z.number(),
  fileTypeName: z.string(),
  fileTypeDescription: z.string(),
  drawerId: z.number(),
  drawerName: z.string(),
  drawerDescription: z.string(),
  hasNotes: z.boolean().nullable(),
  notesId: z.number(),
  description: z.string(),
  fileNumberPart1: z.string().meta({
    description: 'Client Code'
  }),
  fileNumberPart2: z.string(),
  fileNumberPart3: z.string(),
  isTemporary: z.boolean(),
  isDeleted: z.boolean(),
  dateLastOpened: z.date(),
  lastModified: z.date(),
  dateCreated: z.date(),
  attributes: z.array(fileAttributeSchema),
  effectivePermissions: z.number(),
  isFrozen: z.boolean(),
  locationName: z.string().nullable(),
});

export type Files = z.infer<typeof filesSchema>;

export const fileSearchSchema = z.object({
  FileNumberPart1: z.string(),
  FileNumberPart2: z.string(),
  FileNumberPart3: z.string(),
  FileName: z.string(),
  IsTemporary: z.boolean(),
  IsDeleted: z.boolean(),
  ParentId: z.number(),
  FileTypeIds: z.array(z.number()),
  MarkIds: z.array(z.number()),
  Attributes: z.array(attributeSchema),
});

export type FileSearch = z.infer<typeof fileSearchSchema>;