import { z } from "zod/v4";

export const findDocFoldersDto = z.object({
  description: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  drawerId: z.coerce.number().int().optional(),
  fileId: z.coerce.number().int().optional(),
  parentId: z.coerce.number().int().optional(),
});

export type FindDocFoldersDto = z.infer<typeof findDocFoldersDto>;
