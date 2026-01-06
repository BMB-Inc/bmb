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
});

export const policyCheckWorkInProgressOverviewSchema = z.object({
  totalImports: z.number().int(),
  distinctPolicies: z.number().int(),
  distinctClients: z.number().int(),
  oldestImportAt: z.coerce.date().nullable(),
  newestImportAt: z.coerce.date().nullable(),
  recentActivity: z.array(policyCheckWorkInProgressRecentActivitySchema),
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
