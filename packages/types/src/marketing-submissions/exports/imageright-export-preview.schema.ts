import z from 'zod/v4';

import {
  marketingSubmissionsImagerightExportItemTypeSchema,
  marketingSubmissionsImagerightExportScopeSchema,
} from './imageright-export.schema';

export const marketingSubmissionsImagerightExportPreviewItemSchema = z.object({
  submission_id: z.number().int(),
  item_type: marketingSubmissionsImagerightExportItemTypeSchema,
  item_id: z.string(),
  filename: z.string(),
  content_type: z.string(),
  size: z.number().int().nullable(),
  thread_id: z.string().uuid().nullable(),
  email_id: z.string().uuid().nullable(),
  file_id: z.string().uuid().nullable(),
  file_version_id: z.string().uuid().nullable(),
  file_version: z.number().int().nullable(),
});

export type MarketingSubmissionsImagerightExportPreviewItem = z.infer<
  typeof marketingSubmissionsImagerightExportPreviewItemSchema
>;

export const marketingSubmissionsImagerightExportPreviewSchema = z.object({
  scope: marketingSubmissionsImagerightExportScopeSchema,
  submission_ids: z.array(z.number().int()),
  totals: z.object({
    files: z.number().int(),
    correspondence: z.number().int(),
  }),
  items: z.array(marketingSubmissionsImagerightExportPreviewItemSchema),
});

export type MarketingSubmissionsImagerightExportPreview = z.infer<
  typeof marketingSubmissionsImagerightExportPreviewSchema
>;
