import { z } from 'zod/v4';

export const getCombinedDocumentDto = z.object({
  documentId: z.coerce.number(),
  pageIds: z
    .union([
      z.coerce.number(),
      z
        .array(z.coerce.number())
        .min(1, { message: 'At least one pageId must be provided when pageIds is an array.' }),
    ])
    .optional()
    .transform((value) => {
      if (typeof value === 'undefined') {
        return undefined;
      }

      if (Array.isArray(value)) {
        return value;
      }

      return [value];
    }),
});

export type GetCombinedDocumentDto = z.infer<typeof getCombinedDocumentDto>;
