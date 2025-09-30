import z from "zod/v4";

export const marketingSubmissionsFileSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	type: z.string(),
	size: z.int(),
	graph_attachment_id: z.uuid(),
	imageright_id: z.int(),
	submission_id: z.int()
});

export const createMarketingSubmissionsFileSchema =
	marketingSubmissionsFileSchema.omit({ id: true });
export const updateMarketingSubmissionsFileSchema =
	createMarketingSubmissionsFileSchema.partial();

export type MarketingSubmissionsFileSchema = z.infer<
	typeof marketingSubmissionsFileSchema
>;
export type CreateMarketingSubmissionsFileSchema = z.infer<
	typeof createMarketingSubmissionsFileSchema
>;
export type UpdateMarketingSubmissionsFileSchema = z.infer<
	typeof updateMarketingSubmissionsFileSchema
>;
