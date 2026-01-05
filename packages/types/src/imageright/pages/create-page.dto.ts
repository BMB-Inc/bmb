import { z } from 'zod/v4';

export const createPageDto = z.object({
  docId: z.coerce.number(),
  batchId: z.coerce.number().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreatePageDto = z.infer<typeof createPageDto>;
