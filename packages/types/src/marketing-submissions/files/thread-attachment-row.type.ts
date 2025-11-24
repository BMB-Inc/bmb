import type { MarketingSubmissionsEmailDirection } from '../communications';

export interface MarketingSubmissionsThreadAttachmentRow {
  attachment_id: string;
  email_id: string;
  file_id: string;
  sent_file_version: number;
  thread_id: string;
  email_subject: string;
  email_direction: MarketingSubmissionsEmailDirection;
  email_sent_at: Date;
  email_received_at: Date | null;
  file_name: string;
  file_type: string;
  file_size: number;
  file_deleted: boolean | null;
  quote_id?: string | null;
  quote_file_id?: string | null;
  quote_file_version?: number | null;
  file_version_id: string | null;
  file_version: number | null;
  file_version_uploaded_at: Date | null;
  file_version_uploaded_by_user: string | null;
  file_version_object_key: string | null;
  file_version_minio_id: string | null;
  file_version_deleted: boolean | null;
}
