import z from "zod/v4";

export const marketingSubmissionsCarrierSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	created_at: z.coerce.date().default(new Date())
});

export const createMarketingSubmissionsCarrierSchema = marketingSubmissionsCarrierSchema.omit({ id: true, created_at: true });

export const updateMarketingSubmissionsCarrierSchema = createMarketingSubmissionsCarrierSchema.partial();

export type MarketingSubmissionsCarrierSchema = z.infer<typeof marketingSubmissionsCarrierSchema>;
export type CreateMarketingSubmissionsCarrierSchema = z.infer<typeof createMarketingSubmissionsCarrierSchema>;
export type UpdateMarketingSubmissionsCarrierSchema = z.infer<typeof updateMarketingSubmissionsCarrierSchema>;

export const getMarketingSubmissionsCarriersDto = marketingSubmissionsCarrierSchema.pick({ id: true, name: true }).partial()

export type GetMarketingSubmissionsCarriersDto = z.infer<typeof getMarketingSubmissionsCarriersDto>
