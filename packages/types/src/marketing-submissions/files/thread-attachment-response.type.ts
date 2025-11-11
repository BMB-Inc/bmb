import type { MarketingSubmissionsEmailDirection } from '../communications';

export interface MarketingSubmissionsThreadAttachmentFileVersion {
  id: string;
  version: number;
  uploadedAt: Date | null;
  uploadedByUser: string | null;
  minioObjectKey: string | null;
  minioVersionId: string | null;
  deleted: boolean;
}

export interface MarketingSubmissionsThreadAttachmentResponse {
  attachmentId: string;
  emailId: string;
  threadId: string;
  fileId: string;
  sentFileVersion: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDeleted: boolean;
  emailSubject: string;
  emailDirection: MarketingSubmissionsEmailDirection;
  emailSentAt: Date;
  emailReceivedAt: Date | null;
  fileVersion: MarketingSubmissionsThreadAttachmentFileVersion | null;
}
