import z from 'zod/v4';

export const marketingSubmissionsImagerightExportScopeSchema = z.enum(['bound', 'non-bound']);
export type MarketingSubmissionsImagerightExportScope = z.infer<
  typeof marketingSubmissionsImagerightExportScopeSchema
>;

export const marketingSubmissionsImagerightExportItemTypeSchema = z.enum([
  'file',
  'correspondence',
]);
export type MarketingSubmissionsImagerightExportItemType = z.infer<
  typeof marketingSubmissionsImagerightExportItemTypeSchema
>;

export const marketingSubmissionsImagerightExportFailureSchema = z.object({
  submission_id: z.number().int(),
  item_type: marketingSubmissionsImagerightExportItemTypeSchema,
  item_id: z.string(),
  filename: z.string().nullable(),
  error_message: z.string(),
});

export type MarketingSubmissionsImagerightExportFailure = z.infer<
  typeof marketingSubmissionsImagerightExportFailureSchema
>;

const exportCountSchema = z.object({
  files: z.number().int(),
  correspondence: z.number().int(),
});

export const marketingSubmissionsImagerightExportSummarySchema = z.object({
  scope: marketingSubmissionsImagerightExportScopeSchema,
  submission_ids: z.array(z.number().int()),
  totals: exportCountSchema,
  exported: exportCountSchema,
  skipped: exportCountSchema,
  failed: exportCountSchema,
  failures: z.array(marketingSubmissionsImagerightExportFailureSchema),
});

export type MarketingSubmissionsImagerightExportSummary = z.infer<
  typeof marketingSubmissionsImagerightExportSummarySchema
>;
