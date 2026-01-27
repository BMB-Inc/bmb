import { z } from "zod/v4";

export const findDocFoldersDto = z.object({
  description: z.string().min(1),
});

export type FindDocFoldersDto = z.infer<typeof findDocFoldersDto>;
