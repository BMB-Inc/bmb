import { z } from "zod/v4";

export const findDocFoldersDto = z.object({
  description: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  drawerId: z.coerce.number().int().optional(),
  cursor: z.coerce.number().int().optional(),
});

export type FindDocFoldersDto = z.infer<typeof findDocFoldersDto>;
