export interface MarketingSubmissionsGraphAttachment {
  id: string;
  name?: string | null;
  contentType?: string | null;
  size?: number;
  isInline?: boolean;
  lastModifiedDateTime?: string | null;
  contentId?: string | null;
  contentLocation?: string | null;
  contentBytes?: string | null;
  downloadUrl: string;
}

