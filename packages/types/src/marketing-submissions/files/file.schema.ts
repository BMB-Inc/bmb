import z from 'zod/v4';

export const marketingSubmissionsFileTypeValues = [
  'quote',
  'submission',
  'supporting',
  'other',
] as const;

export const marketingSubmissionsFileTypeSchema = z.enum(
  marketingSubmissionsFileTypeValues,
);

export type MarketingSubmissionsFileType = z.infer<
  typeof marketingSubmissionsFileTypeSchema
>;

export const marketingSubmissionsFileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.string(),
  size: z.int(),
  submission_id: z.int(),
  latest_version: z.int(),
  deleted: z.boolean().default(false),
  file_type: marketingSubmissionsFileTypeSchema.default('submission'),
  imageright_document_id: z.number().int().nullable(),
});

export const createMarketingSubmissionsFileSchema = marketingSubmissionsFileSchema
  .omit({ id: true })
  .extend({
    imageright_document_id:
      marketingSubmissionsFileSchema.shape.imageright_document_id.optional(),
  });
export const updateMarketingSubmissionsFileSchema =
  createMarketingSubmissionsFileSchema.partial();

export type MarketingSubmissionsFileSchema = z.infer<
  typeof marketingSubmissionsFileSchema
>;
export type CreateMarketingSubmissionsFileSchema = z.infer<
  typeof createMarketingSubmissionsFileSchema
>;
export type UpdateMarketingSubmissionsFileSchema = z.infer<
  typeof updateMarketingSubmissionsFileSchema
>;
