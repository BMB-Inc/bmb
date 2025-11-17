import z from 'zod/v4';

export const boardSubmissionsQuerySchema = z.object({
  id: z.number().int().min(1).optional().describe('Filter to a specific submission.'),
  client_id: z.number().int().min(1).optional().describe('Filter rows by CRM id.'),
  client_code: z.string().min(1).optional().describe('Filter rows by short client code.'),
  client_name: z.string().min(1).optional().describe('Case-insensitive client name search.'),
  account_type: z
    .string()
    .min(1)
    .optional()
    .describe('Case-insensitive search by AccountType (risk type).'),
  coordinator: z.string().min(1).optional().describe('Case-insensitive coordinator name search.'),
  location: z
    .string()
    .min(1)
    .optional()
    .describe('Case-insensitive search by Location (state or region).'),
  window: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Forward-looking time window for ExpDate (expiration date) such as '30d', '7d', or '1mo'; scopes to submissions expiring within the next N days. Defaults to '30d' when omitted.",
    ),
  limit: z.number().int().min(1).optional().describe('Page size for the board grid.'),
  page: z.number().int().min(0).optional().describe('Zero-based page index for pagination.'),
  completed: z
    .boolean()
    .optional()
    .describe('True filters to completed submissions, false to in-flight work.'),
});

export type BoardSubmissionsQuerySchema = z.infer<typeof boardSubmissionsQuerySchema>;
