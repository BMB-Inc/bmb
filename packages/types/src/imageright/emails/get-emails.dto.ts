import { z } from 'zod/v4';

export const getEmailsDto = z.object({
  documentId: z.coerce.number(),
  pageId: z.coerce.number().optional(),
});

export type GetEmailsDto = z.infer<typeof getEmailsDto>;
