import { z } from "zod/v4";

export const merrimacMarketingAgentsSchema = z.object({
    agents_id: z.uuid(),
    name: z.string(),
    description: z.string().optional().nullable()
});

export const createMerrimacMarketingAgentsSchema = merrimacMarketingAgentsSchema.omit({
    agents_id: true
});

export const updateMerrimacMarketingAgentsSchema = merrimacMarketingAgentsSchema.partial();

export type MerrimacMarketingAgents = z.infer<typeof merrimacMarketingAgentsSchema>;
export type CreateMerrimacMarketingAgents = z.infer<typeof createMerrimacMarketingAgentsSchema>;
export type UpdateMerrimacMarketingAgents = z.infer<typeof updateMerrimacMarketingAgentsSchema>;