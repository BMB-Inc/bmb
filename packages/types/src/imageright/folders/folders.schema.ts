import { z } from "zod/v4";
import { imagerightAttributeSchema } from "../attribute.schema";

export const imagerightFolderSchema = z.object({
  id: z.number(),
  description: z.string(),
  effectivePermissions: z.number(),
  fileId: z.number().nullable(),
  parentFolderId: z.number().nullable(),
  folderTypeId: z.number(),
  folderTypeDescription: z.string(),
  hasNotes: z.boolean().nullable(),
  isDeleted: z.boolean(),
  lastModified: z.string(),
  dateCreated: z.string(),
  attributes: z.array(imagerightAttributeSchema),
  folderTypeName: z.string(),
});

export const imagerightFoldersSchema = z.array(imagerightFolderSchema);

export type ImagerightFolder = z.infer<typeof imagerightFolderSchema>;
export type ImagerightFolders = z.infer<typeof imagerightFoldersSchema>;
