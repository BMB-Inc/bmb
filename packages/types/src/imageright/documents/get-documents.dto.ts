import { z } from 'zod/v4'

export enum DocumentTypes {
	applications = "applications"
}

export const getDocumentsDto = z.object({
	clientId: z.coerce.number(),
	documentId: z.coerce.number().optional().nullable(),
	folderId: z.coerce.number().optional().nullable(),
	documentType: z.enum(DocumentTypes).optional().nullable()
})

export type GetDocumentsDto = z.infer<typeof getDocumentsDto>
