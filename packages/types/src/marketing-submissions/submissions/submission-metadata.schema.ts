import z from "zod/v4";

export const submissionMetadataSchema = z.object({
	id: z.string().uuid(),
	submission_id: z.number().int(),
	ready_for_export: z.boolean(),
	marked_ready_at: z.date().nullable(),
	marked_ready_by_user_id: z.string().uuid().nullable(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type MarketingSubmissionsSubmissionMetadataSchema = z.infer<
	typeof submissionMetadataSchema
>;
