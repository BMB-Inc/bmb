import z from "zod/v4";

export const marketingSubmissionsEmailDraftAttachmentsSchema = z.object({
	id: z.uuid(),
	submission_id: z.number(),
	contact_id: z.string(),
	message_id: z.string(),
	file_id: z.uuid(),
	sent_file_version: z.number()
});

export const createMarketingSubmissionsEmailDraftAttachmentSchema = marketingSubmissionsEmailDraftAttachmentsSchema.omit({
	id: true
});

export const updateMarketingSubmissionsEmailDraftAttachmentSchema = createMarketingSubmissionsEmailDraftAttachmentSchema.partial();

export type MarketingSubmissionsEmailDraftAttachmentsSchema = z.infer<typeof marketingSubmissionsEmailDraftAttachmentsSchema>
export type CreateMarketingSubmissionsEmailDraftAttachmentSchema = z.infer<typeof createMarketingSubmissionsEmailDraftAttachmentSchema>
export type UpdateMarketingSubmissionsEmailDraftAttachmentSchema = z.infer<typeof updateMarketingSubmissionsEmailDraftAttachmentSchema>
