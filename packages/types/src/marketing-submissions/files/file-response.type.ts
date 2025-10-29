import type { MarketingSubmissionsFileSchema } from "./file.schema";
import type { MarketingSubmissionsFileVersion } from "./file-versions.schema";

export type MarketingSubmissionsFileResponse =
	Omit<MarketingSubmissionsFileSchema, "latest_version"> & {
		version: number;
	} &
	Pick<
		MarketingSubmissionsFileVersion,
		"minio_version_id" | "uploaded_by_user"
	>;