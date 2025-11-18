import z from 'zod/v4';

export enum MarketingSubmissionsEmailSyncStatus {
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
  SUCCESS = 'success',
}

const emailSyncStatusValues: [
  MarketingSubmissionsEmailSyncStatus,
  ...MarketingSubmissionsEmailSyncStatus[],
] = [
  MarketingSubmissionsEmailSyncStatus.IN_PROGRESS,
  MarketingSubmissionsEmailSyncStatus.FAILED,
  MarketingSubmissionsEmailSyncStatus.SUCCESS,
];

export const marketingSubmissionsEmailSyncStateSchema = z.object({
  id: z.uuid(),
  mailbox_email: z.email(),
  delta_token: z.string(),
  last_synced_at: z.coerce.date(),
  sync_status: z.enum(emailSyncStatusValues),
  error_message: z.string().nullable().optional(),
  last_error_at: z.coerce.date().nullable().optional(),
  gap_suspected: z.boolean().default(false),
  gap_reason: z.string().nullable().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable().optional(),
});

export const createMarketingSubmissionsEmailSyncStateSchema =
  marketingSubmissionsEmailSyncStateSchema.omit({
    id: true,
    created_at: true,
  });

export const updateMarketingSubmissionsEmailSyncStateSchema =
  createMarketingSubmissionsEmailSyncStateSchema.extend({
    updated_at: z.coerce.date(),
  });

export type MarketingSubmissionsEmailSyncStateSchema = z.infer<
  typeof marketingSubmissionsEmailSyncStateSchema
>;
export type CreateMarketingSubmissionsEmailSyncStateSchema = z.infer<
  typeof createMarketingSubmissionsEmailSyncStateSchema
>;
export type UpdateMarketingSubmissionsEmailSyncStateSchema = z.infer<
  typeof updateMarketingSubmissionsEmailSyncStateSchema
>;
