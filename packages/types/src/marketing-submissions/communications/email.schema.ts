import z from "zod/v4";

export enum MarketingSubmissionsEmailDirection {
	INBOUND = "inbound",
	OUTBOUND = "outbound"
}

export enum MarketingSubmissionsEmailContentType {
	HTML = "html",
	TEXT = "text"
}

const marketingSubmissionsEmailBodySchema = z.object({
	contentType: z.enum(MarketingSubmissionsEmailContentType),
	content: z.string()
});

export const marketingSubmissionsEmailSchema = z.object({
	id: z.uuid(),
	subject: z.string(),
	contact_id: z.uuid().nullable().optional(),
	thread_id: z.uuid(),
	internet_message_id: z.string(),
	sent_to: z.array(z.email()),
	cc: z.array(z.email()).optional().nullable(),
	bcc: z.array(z.email()).optional().nullable(),
	sent_from: z.email(),
	sent_at: z.coerce.date(),
	received_at: z.coerce.date().nullable().optional(),
	direction: z.enum(MarketingSubmissionsEmailDirection),
});

export const submissionInboxSchema = marketingSubmissionsEmailSchema.extend({ body: marketingSubmissionsEmailBodySchema, uniqueBody: marketingSubmissionsEmailBodySchema })

export type SubmissionInboxResponse = z.infer<typeof submissionInboxSchema>

export const createMarketingSubmissionsEmailSchema =
	marketingSubmissionsEmailSchema.omit({
		id: true,
	});

export const sendMarketingSubmissionEmailDto = z.object({
	subject: z.string(),
	body: z.string()
})

export const sendMarketingSubmissionQueryDto = z.object({
	submission_id: z.int(),
	contact_ids: z.array(z.uuid()),
	file_id: z.uuid()
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
