import type { MarketingSubmissionsEmailDirection } from '../communications';
import type { MarketingSubmissionsFileType } from './file.schema';

export interface MarketingSubmissionsExportReadyFileResponse {
  submission_metadata_id: string;
  submission_id: number;
  ready_for_export: true;
  marked_ready_at: Date | null;
  marked_ready_by_user_id: string | null;
  submission_metadata_created_at: Date;
  submission_metadata_updated_at: Date;
  thread_id: string;
  conversation_id: string;
  carrier_id: string;
  attachment_id: string;
  email_id: string;
  email_direction: MarketingSubmissionsEmailDirection;
  email_subject: string;
  email_sent_at: Date | null;
  email_received_at: Date | null;
  contact_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  file_id: string;
  sent_file_version: number;
  file_name: string;
  file_mime_type: string;
  file_type: MarketingSubmissionsFileType;
  file_size: number;
  file_deleted: boolean;
  file_version_id: string;
  file_version: number;
  file_version_uploaded_at: Date | null;
  file_version_uploaded_by_user: string | null;
  file_version_minio_object_key: string | null;
  file_version_minio_version_id: string | null;
  file_version_deleted: boolean;
}
