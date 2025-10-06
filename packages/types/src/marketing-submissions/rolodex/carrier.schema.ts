import z from "zod/v4";

export const carrierSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	date_created: z.coerce.date().default(new Date())
});

export const createCarrierSchema = carrierSchema.omit({ id: true, date_created: true });

export const updateCarrierSchema = createCarrierSchema.partial();

export type CarrierSchema = z.infer<typeof carrierSchema>;
export type CreateCarrierSchema = z.infer<typeof createCarrierSchema>;
export type UpdateCarrierSchema = z.infer<typeof updateCarrierSchema>;

export const getCarriersDto = carrierSchema.pick({ id: true, name: true })

export type GetCarriersDto = z.infer<typeof getCarriersDto>
