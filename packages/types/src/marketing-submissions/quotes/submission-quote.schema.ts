import z from 'zod/v4';

export const marketingSubmissionsQuoteSchema = z.object({
  id: z.uuid(),
  submission_id: z.number().int(),
  thread_id: z.string().uuid().nullable().optional(),
  email_id: z.uuid().nullable().optional(),
  carrier_id: z.uuid(),
  graph_message_id: z
    .string()
    .min(1)
    .nullable()
    .optional(),
  graph_attachment_id: z
    .string()
    .min(1)
    .nullable()
    .optional(),
  file_id: z.uuid(),
  file_version: z.number().int().positive(),
  imported_by_user: z.uuid(),
  imported_at: z.coerce.date(),
  deleted: z.boolean().default(false),
});

export const createMarketingSubmissionsQuoteSchema = marketingSubmissionsQuoteSchema.omit({
  id: true,
  imported_at: true,
  deleted: true,
});

export const updateMarketingSubmissionsQuoteSchema = marketingSubmissionsQuoteSchema
  .omit({
    id: true,
    imported_at: true,
  })
  .partial();

export type MarketingSubmissionsQuoteSchema = z.infer<typeof marketingSubmissionsQuoteSchema>;
export type CreateMarketingSubmissionsQuoteSchema = z.infer<
  typeof createMarketingSubmissionsQuoteSchema
>;
export type UpdateMarketingSubmissionsQuoteSchema = z.infer<
  typeof updateMarketingSubmissionsQuoteSchema
>;
