import { z } from "zod/v4";

export const imagerightDocFolderSchema = z.object({
  __$sequencenumber: z.string(),
  __$datasource: z.string(),
  created: z.string().nullable(),
  description: z.string().nullable(),
  docfolderguid: z.string().nullable(),
  docfolderid: z.number().int(),
  fileid: z.number().int().nullable(),
  hasbeenevented: z.number().int().nullable(),
  isdeleted: z.number().int().nullable(),
  lastmodified: z.string().nullable(),
  parentid: z.number().int().nullable(),
  permissions: z.string().nullable(),
  previousparentid: z.number().int().nullable(),
  previoustypeid: z.number().int().nullable(),
});

export const imagerightDocFoldersSchema = z.array(imagerightDocFolderSchema);

export type ImagerightDocFolder = z.infer<typeof imagerightDocFolderSchema>;
export type ImagerightDocFolders = z.infer<typeof imagerightDocFoldersSchema>;
