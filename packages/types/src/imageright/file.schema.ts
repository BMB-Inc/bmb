import { imagerightAttributeSchema } from "./attribute.schema";
import { z } from "zod/v4";

export const imagerightFileSchema = z.object({
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
  fileNumberPart1: z.string(),
  fileNumberPart2: z.string(),
  fileNumberPart3: z.string(),
  isTemporary: z.boolean(),
  isDeleted: z.boolean(),
  dateLastOpened: z.string(),
  lastModified: z.string(),
  dateCreated: z.string(),
  attributes: z.array(imagerightAttributeSchema),
  effectivePermissions: z.number(),
  isFrozen: z.boolean(),
  locationName: z.string(),
});