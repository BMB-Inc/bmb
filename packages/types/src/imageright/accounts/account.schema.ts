import { z } from "zod/v4";

export const accountSchema = z.object({
  id: z.number().nullable(),
  externalId: z.string().nullable(),
  name: z.string(),
  friendlyName: z.string(),
  type: z.number(),
  enabled: z.boolean(),
  description: z.string(),
}).meta({
  description: "Account from ImageRight table 'ACCOUNTS'",
  imageRightTable: "ACCOUNTS",
});

export type Account = z.infer<typeof accountSchema>;