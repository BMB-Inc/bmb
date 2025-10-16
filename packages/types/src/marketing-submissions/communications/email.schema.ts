import z from "zod/v4";

export enum MarketingSubmissionsEmailDirection {
	INBOUND = "inbound",
	OUTBOUND = "outbound"
}

export const marketingSubmissionsEmailSchema = z.object({
	id: z.uuid(),
	subject: z.string(),
	contact_id: z.uuid().nullable().optional(),
	thread_id: z.uuid(),
	internet_message_id: z.string(),
	sent_to: z.email(),
	sent_from: z.email(),
	sent_at: z.date(),
	received_at: z.date().nullable().optional(),
	direction: z.enum(MarketingSubmissionsEmailDirection)
});

export const createMarketingSubmissionsEmailSchema =
	marketingSubmissionsEmailSchema.omit({
		id: true
	});

export const sendMarketingSubmissionEmailDto = z.object({
	subject: z.string(),
	body: z.string()
})

export const sendMarketingSubmissionQueryDto = z.object({
	submission_id: z.int(),
	contact_ids: z.array(z.uuid()),
	document_id: z.int()
})

export type SendMarketingSubmissionQueryDto = z.infer<typeof sendMarketingSubmissionQueryDto>

export type SendMarketingSubmissionEmailDto = z.infer<typeof sendMarketingSubmissionEmailDto>

export const updateMarketingSubmissionsEmailSchema =
	createMarketingSubmissionsEmailSchema.partial();

export type MarketingSubmissionsEmailSchema = z.infer<
	typeof marketingSubmissionsEmailSchema
>;
export type CreateMarketingSubmissionsEmailSchema = z.infer<
	typeof createMarketingSubmissionsEmailSchema
>;
export type UpdateMarketingSubmissionsEmailSchema = z.infer<
	typeof updateMarketingSubmissionsEmailSchema
>;
