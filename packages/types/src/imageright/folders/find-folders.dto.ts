import { z } from 'zod/v4';

const folderAttributeFilterSchema = z.object({
  DisplayName: z.string().optional(),
  Name: z.string().optional(),
  Value: z.union([z.string(), z.number(), z.boolean()]).optional().nullable(),
  Id: z.coerce.number().optional(),
});

export const findFoldersBodyDto = z.object({
  Description: z.string().optional().nullable(),
  IsDeleted: z.boolean().optional(),
  FileId: z.coerce.number().optional().nullable(),
  ParentId: z.coerce.number().optional().nullable(),
  FolderTypeIds: z.array(z.coerce.number()).optional(),
  Attributes: z.array(folderAttributeFilterSchema).optional(),
});

export type FindFoldersBodyDto = z.infer<typeof findFoldersBodyDto>;
