import z from "zod/v4";

export enum MarketingSubmissionsThreadStatus {
	ACTIVE = "ACTIVE",
	BOUND = "BOUND",
	CLOSED = "CLOSED",
	DECLINED = "DECLINED"
}

const threadStatusEnum = z.enum(MarketingSubmissionsThreadStatus)

export const marketingSubmissionsThreadSchema = z.object({
	id: z.uuid(),
	carrier_id: z.uuid(),
	status: threadStatusEnum,
	created_at: z.date().default(new Date()),
	submission_id: z.int(),
	conversation_id: z.string(),
	updated_at: z.date().optional(),
});

export const createMarketingSubmissionsThreadSchema =
	marketingSubmissionsThreadSchema.omit({ id: true, created_at: true });

export const updateMarketingSubmissionsThreadSchema =
	createMarketingSubmissionsThreadSchema.partial();

export type MarketingSubmissionsThreadSchema = z.infer<
	typeof marketingSubmissionsThreadSchema
>;
export type CreateMarketingSubmissionsThreadSchema = z.infer<
	typeof createMarketingSubmissionsThreadSchema
>;
export type UpdateMarketingSubmissionsThreadSchema = z.infer<
	typeof updateMarketingSubmissionsThreadSchema
>;

export const marketingSubmissionsBindThreadSchema = z.object({
	id: z.uuid(),
	thread_id: z.uuid(),
	status: threadStatusEnum,
	premium: z.number().optional().nullable(),
	declination_reason: z.string().optional().nullable(),
	created_at: z.date(),
	updated_at: z.date()
})

export const marketingSubmissionsBindThreadDto = marketingSubmissionsBindThreadSchema.omit({
	id: true,
	thread_id: true,
	created_at: true,
	updated_at: true
}).refine(data => {
	if (data.status === MarketingSubmissionsThreadStatus.BOUND) {
		const isBoundWithPremium = data.status === MarketingSubmissionsThreadStatus.BOUND && data?.premium && data?.premium > 0
		return isBoundWithPremium
	} else {
		return true
	}
}, "Binding submission must include bound premium.").refine(data => {
	if (data.status === MarketingSubmissionsThreadStatus.DECLINED) {

		const isDeclinedWithReason = data?.declination_reason
		return isDeclinedWithReason ? true : false
	} else {
		return true
	}
}, "Declining a submission must include a declinationReason.")

export type MarketingSubmissionsBindThreadSchema = z.infer<typeof marketingSubmissionsBindThreadSchema>
