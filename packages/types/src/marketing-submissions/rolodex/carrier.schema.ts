import z from "zod/v4";

export const carrierSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const createCarrierSchema = carrierSchema.omit({ id: true });

export const updateCarrierSchema = createCarrierSchema.partial();

export type CarrierSchema = z.infer<typeof carrierSchema>;
export type CreateCarrierSchema = z.infer<typeof createCarrierSchema>;
export type UpdateCarrierSchema = z.infer<typeof updateCarrierSchema>;
