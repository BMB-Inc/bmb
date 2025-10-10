import z from "zod/v4";

export const marketingSubmissionsFileVersionSchema = z.object({
	id: z.uuid(),
	minio_object_key: z.string(),
	minio_version_id: z.string(),
	uploaded_by_user: z.uuid(),
	uploaded_at: z.date(),
	file_id: z.uuid(),
})

export const createMarketingSubmissionsFileVersionSchema = marketingSubmissionsFileVersionSchema.omit({
	id: true,
	uploaded_by_user: true,
})

export const updateMarketingSubmissionsFileVersionSchema = createMarketingSubmissionsFileVersionSchema.partial()

export type MarketingSubmissionsFileVersion = z.infer<typeof marketingSubmissionsFileVersionSchema>
export type CreateMarketingSubmissionsFileVersion = z.infer<typeof createMarketingSubmissionsFileVersionSchema>
export type UpdateMarketingSubmissionsFileVersion = z.infer<typeof updateMarketingSubmissionsFileVersionSchema>
