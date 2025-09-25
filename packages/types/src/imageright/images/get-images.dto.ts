import { z } from 'zod/v4'

export const getImagesDto = z.object({
	pageId: z.coerce.number(),
	imageId: z.coerce.number(),
	version: z.coerce.number().default(0)
})

export type GetImagesDto = z.infer<typeof getImagesDto>
