import z from 'zod/v4';

export const policyCheckWorkInProgressImportSchema = z.object({
  id: z.string(),
  policyId: z.number().int(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  documentId: z.number().int().nullable(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  pageIds: z.array(z.number().int()).optional(),
  createdAt: z.coerce.date(),
});

export const policyCheckWorkInProgressGroupSchema = z.object({
  policyId: z.number().int(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  clientName: z.string().nullable(),
  clientCode: z.string().nullable(),
  lastActivityAt: z.coerce.date(),
  documentCount: z.number().int(),
  totalSize: z.number().int(),
  imports: z.array(policyCheckWorkInProgressImportSchema),
});

export const policyCheckWorkInProgressSchema = z.array(policyCheckWorkInProgressGroupSchema);

export const policyCheckWorkInProgressRecentActivitySchema = z.object({
  policyId: z.number().int(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  clientName: z.string().nullable(),
  clientCode: z.string().nullable(),
  lastActivityAt: z.coerce.date(),
  documentCount: z.number().int(),
  totalSize: z.number().int(),
  activityType: z.enum(['import', 'request']),
  requestId: z.string().nullable(),
  requestStatus: z.enum(['pending', 'sent', 'responded', 'failed', 'exported']).nullable(),
  recentImport: z
    .object({
      id: z.string(),
      filename: z.string(),
      documentId: z.number().int().nullable(),
      createdAt: z.coerce.date(),
    })
    .nullable(),
  recentRequest: z
    .object({
      id: z.string(),
      status: z.enum(['pending', 'sent', 'responded', 'failed', 'exported']),
      updatedAt: z.coerce.date(),
    })
    .nullable(),
});

export const policyCheckWorkInProgressOverviewSchema = z.object({
  totalImports: z.number().int(),
  distinctPolicies: z.number().int(),
  distinctClients: z.number().int(),
  oldestImportAt: z.coerce.date().nullable(),
  newestImportAt: z.coerce.date().nullable(),
  recentActivity: z.array(policyCheckWorkInProgressRecentActivitySchema),
});

export const policyCheckWorkInProgressOverviewQuerySchema = z.object({
  all: z
    .boolean()
    .optional()
    .describe('Include all users when true; otherwise scoped to the requester.'),
  policyId: z.number().int().optional().describe('Filter to a specific policy id.'),
  clientId: z.number().int().optional().describe('Filter to a specific client id.'),
  folderId: z.number().int().optional().describe('Filter to a specific folder id.'),
  window: z
    .string()
    .min(1)
    .optional()
    .describe('Time window such as 30d, 7d, or 1mo for import recency.'),
  recentLimit: z
    .number()
    .int()
    .min(1)
    .max(25)
    .optional()
    .describe('Max recent activity entries to include.'),
});

export type PolicyCheckWorkInProgressImport = z.infer<
  typeof policyCheckWorkInProgressImportSchema
>;
export type PolicyCheckWorkInProgressGroup = z.infer<
  typeof policyCheckWorkInProgressGroupSchema
>;
export type PolicyCheckWorkInProgress = z.infer<typeof policyCheckWorkInProgressSchema>;
export type PolicyCheckWorkInProgressRecentActivity = z.infer<
  typeof policyCheckWorkInProgressRecentActivitySchema
>;
export type PolicyCheckWorkInProgressOverview = z.infer<
  typeof policyCheckWorkInProgressOverviewSchema
>;
export type PolicyCheckWorkInProgressOverviewQuery = z.infer<
  typeof policyCheckWorkInProgressOverviewQuerySchema
>;
