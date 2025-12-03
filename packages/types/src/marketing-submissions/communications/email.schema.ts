import z from 'zod/v4';

export enum MarketingSubmissionsEmailDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

const marketingSubmissionsEmailBodySchema = z.object({
  contentType: z.string(),
  content: z.string().nullable().optional(),
});

const emailDirectionValues: [
  MarketingSubmissionsEmailDirection,
  ...MarketingSubmissionsEmailDirection[],
] = [MarketingSubmissionsEmailDirection.INBOUND, MarketingSubmissionsEmailDirection.OUTBOUND];

export const marketingSubmissionsEmailSchema = z.object({
  id: z.uuid(),
  subject: z.string(),
  contact_id: z.uuid().nullable().optional(),
  thread_id: z.uuid(),
  internet_message_id: z.string(),
  graph_message_id: z.string().nullable().optional(),
  sent_to: z.array(z.email()),
  cc: z.array(z.email()).nullable().optional(),
  bcc: z.array(z.email()).nullable().optional(),
  sent_from: z.email().or(z.string()),
  sent_at: z.coerce.date(),
  received_at: z.coerce.date().nullable().optional(),
  direction: z.enum(emailDirectionValues),
  body: z.string().nullable().optional(),
});

export const submissionInboxSchema = marketingSubmissionsEmailSchema.extend({
  uniqueBody: marketingSubmissionsEmailBodySchema,
  hasIncompleteEmailHistory: z.boolean().optional(),
});

export type SubmissionInboxResponse = z.infer<typeof submissionInboxSchema>;

export const createMarketingSubmissionsEmailSchema = marketingSubmissionsEmailSchema.omit({
  id: true,
});

export const sendMarketingSubmissionEmailDto = z.object({
  subject: z.string().min(1, { message: 'Subject is required.' }),
  body: z.string().min(1, { message: 'Body is required.' }),
});

export const sendMarketingSubmissionQueryDto = z.object({
  submission_id: z.number().int(),
  contact_ids: z.array(z.uuid()).min(1),
  file_ids: z.array(z.uuid()).min(1),
  cc_contact_ids: z.array(z.uuid()).optional(),
  submission_house_contact_ids: z.array(z.uuid()).optional(),
  includeSubmissionHouse: z.boolean().optional(),
});

export type SendMarketingSubmissionQueryDto = z.infer<typeof sendMarketingSubmissionQueryDto>;

export type SendMarketingSubmissionEmailDto = z.infer<typeof sendMarketingSubmissionEmailDto>;

export const marketingSubmissionsDraftResponseSchema = z.object({
  contact_id: z.string().uuid().optional(),
  submission_id: z.number().int(),
  message_id: z.string(),
  subject: z.string(),
  to: z.string().email(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  body: z.string().nullable().optional(),
  contentType: z.string().optional(),
});

export type MarketingSubmissionsDraftResponse = z.infer<
  typeof marketingSubmissionsDraftResponseSchema
>;

export const updateMarketingSubmissionsEmailSchema =
  createMarketingSubmissionsEmailSchema.partial();

export type MarketingSubmissionsEmailSchema = z.infer<typeof marketingSubmissionsEmailSchema>;
export type CreateMarketingSubmissionsEmailSchema = z.infer<
  typeof createMarketingSubmissionsEmailSchema
>;
export type UpdateMarketingSubmissionsEmailSchema = z.infer<
  typeof updateMarketingSubmissionsEmailSchema
>;
