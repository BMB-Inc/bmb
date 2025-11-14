import z from "zod/v4";

export const boardSubmissionsQuerySchema = z.object({
	id: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe("Filter to a specific submission."),
	client_id: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe("Filter rows by CRM id."),
	client_code: z
		.string()
		.min(1)
		.optional()
		.describe("Filter rows by short client code."),
	client_name: z
		.string()
		.min(1)
		.optional()
		.describe("Case-insensitive client name search."),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe("Page size for the board grid."),
	page: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe("Zero-based page index for pagination."),
	completed: z
		.boolean()
		.optional()
		.describe(
			"True filters to completed submissions, false to in-flight work.",
		),
});

export type BoardSubmissionsQuerySchema = z.infer<
	typeof boardSubmissionsQuerySchema
>;

