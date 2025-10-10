import z from "zod/v4";

export enum MarketingSubmissionsEmailCategory {
	SUBMISSION = "SUBMISSION",
	RESUBMISSION = "RESUBMISSION",
}

// TODO: Finish the marketing submissions email schema.

export enum MarketingSubmissionsEmailStatus {
	DRAFT = "DRAFT",
	SENT = "SENT",
	FAILED = "FAILED",
}

export const marketingSubmissionsEmailSchema = z.object({
	id: z.uuid(),
	content: z.string(),
	subject: z.string(),
	submission_type: z.enum(MarketingSubmissionsEmailCategory),
	contact_id: z.uuid(),
	thread_id: z.uuid(),
	internet_message_id: z.string(),
	sent_to: z.string().array(),
	sent_at: z.date(),
	delivery_status: z.enum(MarketingSubmissionsEmailStatus)
});

export const createMarketingSubmissionsEmailSchema =
	marketingSubmissionsEmailSchema.omit({
		id: true,
	});

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
