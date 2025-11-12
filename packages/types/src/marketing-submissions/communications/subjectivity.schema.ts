import z from 'zod/v4';

export const subjectivityFlagsSchema = z.object({
  redline_applications: z.boolean(),
  coverage_confirmation: z.boolean(),
  redline_cois: z.boolean(),
  baf: z.boolean(),
  blue_folder_items_received: z.boolean(),
  redlines_completed_before_renewal: z.boolean(),
  cois_issued: z.boolean().nullable().optional(),
  auto_ids_issued: z.boolean().nullable().optional(),
  notify_loss_control: z.boolean(),
});

export const marketingSubmissionsSubjectivitySchema = z.object({
  id: z.uuid(),
  submission_id: z.number().int(),
  thread_id: z.uuid().nullable().optional(),
  subjectivities: subjectivityFlagsSchema,
  completed_comments: z.string().nullable().optional(),
  uncompleted_comments: z.string().nullable().optional(),
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

export type SubjectivityFlags = z.infer<typeof subjectivityFlagsSchema>;
export type MarketingSubmissionsSubjectivitySchema = z.infer<
  typeof marketingSubmissionsSubjectivitySchema
>;
export type CreateMarketingSubmissionsSubjectivitySchema = z.infer<
  typeof createMarketingSubmissionsSubjectivitySchema
>;
export type UpdateMarketingSubmissionsSubjectivitySchema = z.infer<
  typeof updateMarketingSubmissionsSubjectivitySchema
>;
