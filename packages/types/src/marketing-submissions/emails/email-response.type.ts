import type { SubmissionInboxResponse } from '../communications';
import type { MarketingSubmissionsEmailAttachment } from './email-attachment.type';

export type MarketingSubmissionsEmailResponse = SubmissionInboxResponse & {
  messageId: string;
  submissionId: number;
  attachments: MarketingSubmissionsEmailAttachment[];
};

