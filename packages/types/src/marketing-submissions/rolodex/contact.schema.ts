import z from "zod/v4";

export const marketingSubmissionsContactSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	active: z.boolean().default(true),
	lob: z.string(),
	carriers_id: z.string()
});

export const createMarketingSubmissionsContactSchema =
	marketingSubmissionsContactSchema.omit({ id: true, carriers_id: true, active: true });
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

export const getContactsDto = marketingSubmissionsContactSchema.pick({ name: true, carriers_id: true, id: true })
export type GetContactsDto = z.infer<typeof getContactsDto>
