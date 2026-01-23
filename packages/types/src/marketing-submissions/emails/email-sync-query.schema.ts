import z from 'zod/v4';

export const marketingSubmissionsMailboxSyncQuerySchema = z.object({
  mailbox_email: z.string().email(),
});

export type MarketingSubmissionsMailboxSyncQuery = z.infer<
  typeof marketingSubmissionsMailboxSyncQuerySchema
>;
