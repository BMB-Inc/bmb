import z from "zod/v4";

export const marketingSubmissionsContactSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.email(),
	active: z.boolean().default(true),
	lob: z.array(z.string()),
	carrier_id: z.string(),
	submission_house_email: z.email().optional().nullable(),
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

export const getMarketingSubmissionsContactsDto = marketingSubmissionsContactSchema.pick({ name: true, carrier_id: true, id: true, lob: true }).extend({ tags: z.array(z.string()) }).partial()
export type GetMarketingSubmissionsContactsDto = z.infer<typeof getMarketingSubmissionsContactsDto>

export const marketingSubmissionsContactTagsSchema = z.object({
	id: z.uuid(),
	contacts_id: z.uuid(),
	tag: z.string()
})

export const createMarketingSubmissionsContactTagsSchema = marketingSubmissionsContactTagsSchema.omit({ id: true })
export const updateMarketingSubmissionsContactTagsSchema = createMarketingSubmissionsContactSchema.partial()

export type MarketingSubmissionsContactTagsSchema = z.infer<typeof marketingSubmissionsContactTagsSchema>;
export type CreateMarketingSubmissionsContactTagsSchema = z.infer<typeof createMarketingSubmissionsContactTagsSchema>;
export type UpdateMarketingSubmissionsContactTagsSchema = z.infer<typeof updateMarketingSubmissionsContactTagsSchema>;
