import type { MarketingSubmissionsEmailSyncStatus } from './email-sync-state.schema';

export type MarketingSubmissionsEmailDeltaSyncResponse = {
  mailbox_email: string;
  totalMessages: number;
  syncedMessages: number;
  skippedWithoutSubmission: number;
  skippedWithoutThread: number;
  lastSyncedAt: Date;
  syncStatus: MarketingSubmissionsEmailSyncStatus;
  hasChanges: boolean;
  unprocessedMessages: number;
  message: string;
};

