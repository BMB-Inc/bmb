import { z } from "zod/v4";

export const imagerightFolderSchema = z.object({
  fileId: z.number(),
  parentFolderId: z.number(),
  folderTypeId: z.number(),
  folderTypeDescription: z.string(),
  hasNotes: z.boolean(),
  lastModified: z.string(),
  dateCreated: z.string(),
  folderTypeName: z.string(),
  id: z.number(),
  description: z.string(),
});

export type ImagerightFolder = z.infer<typeof imagerightFolderSchema>;
