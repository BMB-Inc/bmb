import { z } from 'zod/v4';

export const getPageByIdDto = z.object({
  version: z.coerce.number().default(-1),
});

export type GetPageByIdDto = z.infer<typeof getPageByIdDto>;
