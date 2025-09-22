import { z } from 'zod/v4'

export const authSchema = z.object({
  UserName: z.string(),
  Password: z.string()
})

export type Auth = z.infer<typeof authSchema>