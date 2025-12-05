import type { MarketingSubmissionsFileSchema } from './file.schema';
import type { MarketingSubmissionsFileVersion } from './file-versions.schema';

export type MarketingSubmissionsFileVersionResponse = Pick<
  MarketingSubmissionsFileVersion,
  'version' | 'minio_version_id' | 'uploaded_at'
>;

export type MarketingSubmissionsFileResponse = Omit<
  MarketingSubmissionsFileSchema,
  'latest_version'
> & {
  version: number;
  versions: MarketingSubmissionsFileVersionResponse[];
} & Pick<MarketingSubmissionsFileVersion, 'minio_version_id' | 'uploaded_by_user' | 'uploaded_at'>;
