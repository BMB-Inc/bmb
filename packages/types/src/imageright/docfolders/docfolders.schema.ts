import { z } from "zod/v4";

import { imagerightClientSchema } from "../clients";
import { imagerightFolderSchema } from "../folders";

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

export const imagerightDocFolderWithRelationsSchema = imagerightDocFolderSchema.extend({
  file: imagerightClientSchema.nullable(),
  folder: z.array(imagerightFolderSchema),
  imagerightUrl: z.string(),
});

export const imagerightDocFoldersWithRelationsSchema = z.array(
  imagerightDocFolderWithRelationsSchema,
);

export type ImagerightDocFolderWithRelations = z.infer<
  typeof imagerightDocFolderWithRelationsSchema
>;
export type ImagerightDocFoldersWithRelations = z.infer<
  typeof imagerightDocFoldersWithRelationsSchema
>;
