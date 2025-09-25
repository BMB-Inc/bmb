import { z } from 'zod/v4'

export enum FolderTypes {
	policies = 162
}

export const getFoldersDto = z.object({
	clientId: z.number(),
	folderTypes: z.enum(FolderTypes),
})

export type GetFoldersDto = z.infer<typeof getFoldersDto>
