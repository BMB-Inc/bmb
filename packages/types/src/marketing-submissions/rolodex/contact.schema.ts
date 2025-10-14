import z from "zod/v4";

export const marketingSubmissionsContactSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	active: z.boolean().default(true),
	lob: z.array(z.string()),
	tags: z.array(z.string()).optional(),
	carrier_id: z.string()
});

export const createMarketingSubmissionsContactSchema =
	marketingSubmissionsContactSchema.omit({ id: true, carrier_id: true, active: true });
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

export const getMarketingSubmissionsContactsDto = marketingSubmissionsContactSchema.pick({ name: true, carrier_id: true, id: true, tags: true, lob: true }).partial()
export type GetMarketingSubmissionsContactsDto = z.infer<typeof getMarketingSubmissionsContactsDto>
