import { z } from 'zod/v4';

export const createFolderAttributeDto = z.object({
  displayName: z.string(),
  name: z.string(),
});

export const createFolderDto = z.object({
  folderTypeId: z.coerce.number(),
  parentId: z.coerce.number(),
  description: z.string(),
  attributes: z.array(createFolderAttributeDto).optional().nullable(),
});

export type CreateFolderDto = z.infer<typeof createFolderDto>;
export type CreateFolderAttributeDto = z.infer<typeof createFolderAttributeDto>;
