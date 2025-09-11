import z from "zod/v4";

export enum MarketingSubmissionsEmailCategory {
  SUBMISSION = "SUBMISSION",
  RESUBMISSION = "RESUBMISSION",
}

// TODO: Finish the marketing submissions email schema.

export const marketingSubmissionsEmailSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  subject: z.string(),
  submission_type: z.enum(MarketingSubmissionsEmailCategory),
  date_sent: z.date().default(new Date()),
  contact_id: z.uuid(),
  carrier_id: z.uuid(),
  attachment_ids: z.uuid().array(),
  thread_id: z.uuid(),
});

export const createMarketingSubmissionsEmailSchema =
  marketingSubmissionsEmailSchema.omit({
    id: true,
  });

export const updateMarketingSubmissionsEmailSchema =
  createMarketingSubmissionsEmailSchema.partial();

export type MarketingSubmissionsEmailSchema = z.infer<
  typeof marketingSubmissionsEmailSchema
>;
export type CreateMarketingSubmissionsEmailSchema = z.infer<
  typeof createMarketingSubmissionsEmailSchema
>;
export type UpdateMarketingSubmissionsEmailSchema = z.infer<
  typeof updateMarketingSubmissionsEmailSchema
>;
