import z from "zod/v4";

export const marketingSubmissionsEmailAttachmentsSchema = z.object({
	id: z.uuid(),
	file_id: z.uuid(),
	sent_file_version: z.number(),
	email_id: z.string()
})

export const createMarketingSubmissionsEmailAttachmentSchema = marketingSubmissionsEmailAttachmentsSchema.omit({
	id: true
})

export const updateMarketingSubmissionsEmailAttachmentSchema = createMarketingSubmissionsEmailAttachmentSchema.partial()

export type MarketingSubmissionsEmailAttachmentsSchema = z.infer<typeof marketingSubmissionsEmailAttachmentsSchema>
export type CreateMarketingSubmissionsEmailAttachmentsSchema = z.infer<typeof createMarketingSubmissionsEmailAttachmentSchema>
export type UpdateMarketingSubmissionsEmailAttachmentsSchema = z.infer<typeof updateMarketingSubmissionsEmailAttachmentSchema>
