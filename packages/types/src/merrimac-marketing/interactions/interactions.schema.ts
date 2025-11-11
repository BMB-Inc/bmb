import z from 'zod/v4';

export const interactionsZodObject = z.object({
  interaction_id: z.string(),
  submission_id: z.string(),
  interaction_detail: z.string(),
  date_created: z.iso.datetime(),
  date_interacted: z.iso.datetime(),
});

export type Interactions = z.infer<typeof interactionsZodObject>;

export const createInteractionSchema = interactionsZodObject.omit({
  interaction_id: true,
  submission_id: true,
  date_created: true,
});

export type CreateInteraction = z.infer<typeof createInteractionSchema>;

export const updateInteractionSchema = createInteractionSchema.partial();

export type UpdateInteraction = z.infer<typeof updateInteractionSchema>;
