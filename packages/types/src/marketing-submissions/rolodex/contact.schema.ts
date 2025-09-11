import z from "zod/v4";

export const marketingSubmissionsContactSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  active: z.boolean(),
  role: z.string(),
});

export const createMarketingSubmissionsContactSchema =
  marketingSubmissionsContactSchema.omit({ id: true });
export const updateMarketingSubmissionsContactSchema =
  createMarketingSubmissionsContactSchema.partial();

export type MarketingSubmissionsContactSchema = z.infer<
  typeof marketingSubmissionsContactSchema
>;
export type CreateMarketingSubmissionsContactSchema = z.infer<
  typeof createMarketingSubmissionsContactSchema
>;
export type UpdateMarketingSubmissionsContactSchema = z.infer<
  typeof updateMarketingSubmissionsContactSchema
>;
