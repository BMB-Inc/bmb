import z from 'zod/v4';

export const marketingSubmissionsSubjectivitySchema = z.object({
  id: z.uuid(),
  submission_id: z.number().int(),
  thread_id: z.uuid().nullable().optional(),
  term: z.string(),
  completed: z.boolean(),
  notes: z.string().nullable().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createMarketingSubmissionsSubjectivitySchema =
  marketingSubmissionsSubjectivitySchema.omit({
    id: true,
    submission_id: true,
    thread_id: true,
    created_at: true,
    updated_at: true,
  });

export const updateMarketingSubmissionsSubjectivitySchema = marketingSubmissionsSubjectivitySchema
  .omit({
    id: true,
    submission_id: true,
    thread_id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export type MarketingSubmissionsSubjectivitySchema = z.infer<
  typeof marketingSubmissionsSubjectivitySchema
>;
export type CreateMarketingSubmissionsSubjectivitySchema = z.infer<
  typeof createMarketingSubmissionsSubjectivitySchema
>;
export type UpdateMarketingSubmissionsSubjectivitySchema = z.infer<
  typeof updateMarketingSubmissionsSubjectivitySchema
>;
