import { z } from 'zod/v4'

export const getClientsDto = z.object({
	clientId: z.coerce.number().optional().nullable(),
	clientName: z.string().optional().nullable(),
	clientCode: z.string().optional().nullable()
})

export type GetClientsDto = z.infer<typeof getClientsDto>
