import { z } from "zod/v4";
import { imagerightFileSchema } from "../file.schema";

export const imagerightClientsSchema = z.array(imagerightFileSchema);
export type ImagerightClient = z.infer<typeof imagerightFileSchema>;
export type ImagerightClients = z.infer<typeof imagerightClientsSchema>;

export const imagerightClientSearchSchema = z.object({
  clientCode: z.string().optional(),
  clientName: z.string().optional(),
});

export type ImagerightClientSearch = z.infer<typeof imagerightClientSearchSchema>;
