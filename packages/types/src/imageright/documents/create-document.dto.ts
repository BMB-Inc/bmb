import { z } from 'zod/v4';

export const createDocumentAttributeDto = z.object({
  displayName: z.string(),
  name: z.string(),
});

export const createDocumentDto = z.object({
  parentId: z.coerce.number(),
  documentTypeId: z.coerce.number(),
  description: z.string(),
  documentDate: z.string(),
  receivedDate: z.string().optional().nullable(),
  attributes: z.array(createDocumentAttributeDto).optional().nullable(),
});

export type CreateDocumentDto = z.infer<typeof createDocumentDto>;
export type CreateDocumentAttributeDto = z.infer<typeof createDocumentAttributeDto>;
