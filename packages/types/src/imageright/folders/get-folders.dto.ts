import { z } from 'zod/v4'

export enum FolderTypes {
	policies = 'policies'
}

export const getFoldersDto = z.object({
	clientId: z.coerce.number(),
	folderTypes: z.enum([FolderTypes.policies]).optional().nullable(),
	folderId: z.number().optional().nullable()
})

export type GetFoldersDto = z.infer<typeof getFoldersDto>
