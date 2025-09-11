import z from "zod/v4";

export enum MarketingSubmissionsThreadStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

export const marketingSubmissionsThreadSchema = z.object({
  id: z.uuid(),
  submission_id: z.int(),
  carrier_id: z.uuid(),
  subject: z.string(),
  status: z.enum(MarketingSubmissionsThreadStatus),
  created_at: z.date().default(new Date()),
  updated_at: z.date().optional(),
});

export const createMarketingSubmissionsThreadSchema =
  marketingSubmissionsThreadSchema.omit({ id: true, created_at: true });

export const updateMarketingSubmissionsThreadSchema =
  createMarketingSubmissionsThreadSchema.partial();

export type MarketingSubmissionsThreadSchema = z.infer<
  typeof marketingSubmissionsThreadSchema
>;
export type CreateMarketingSubmissionsThreadSchema = z.infer<
  typeof createMarketingSubmissionsThreadSchema
>;
export type UpdateMarketingSubmissionsThreadSchema = z.infer<
  typeof updateMarketingSubmissionsThreadSchema
>;
