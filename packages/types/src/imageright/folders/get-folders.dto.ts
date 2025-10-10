import { z } from "zod/v4";

export enum FolderTypes {
	policies = "policies",
	submissions = "submissions"
}

export const getFoldersDto = z.object({
	clientId: z.coerce.number(),
	folderTypes: z.enum(FolderTypes).array().optional().nullable(),
	folderId: z.coerce.number().optional().nullable()
})

export type GetFoldersDto = z.infer<typeof getFoldersDto>;
