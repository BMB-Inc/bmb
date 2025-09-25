import { z } from 'zod/v4'

export const getPagesDto = z.object({
	documentId: z.coerce.number()
})

export type GetPagesDto = z.infer<typeof getPagesDto>
