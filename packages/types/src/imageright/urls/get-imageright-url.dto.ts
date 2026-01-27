import { z } from 'zod/v4';

export const getImagerightUrlDto = z
  .object({
    documentId: z.coerce.number().int().optional(),
    pageId: z.coerce.number().int().optional(),
  })
  .refine((value) => value.documentId !== undefined || value.pageId !== undefined, {
    message: 'Either documentId or pageId must be provided.',
  })
  .refine((value) => !(value.documentId && value.pageId), {
    message: 'Provide only one of documentId or pageId.',
  });

export type GetImagerightUrlDto = z.infer<typeof getImagerightUrlDto>;
