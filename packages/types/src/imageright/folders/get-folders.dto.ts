import { z } from 'zod/v4'


export const getFoldersDto = z.object({
	clientId: z.coerce.number(),
	folderTypes: z.enum(["policies"]).array().optional().nullable(),
	folderId: z.number().optional().nullable()
})

export type GetFoldersDto = z.infer<typeof getFoldersDto>
