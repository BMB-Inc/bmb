import z from 'zod/v4';

const E164_PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

const phoneSchema = z
  .string()
  .regex(E164_PHONE_REGEX, { message: 'Phone numbers must be E.164 formatted.' });

export const marketingSubmissionsContactSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Email is required' }),
  active: z.boolean().default(true),
  lob: z.array(z.string()).min(1, { message: 'LOB is required' }),
  carrier_id: z.uuid(),
  submission_house_email: z.string().email().nullable().optional(),
  cell_phone: phoneSchema.nullable().optional(),
  work_phone: phoneSchema.nullable().optional(),
});

export const createMarketingSubmissionsContactSchema = marketingSubmissionsContactSchema.omit({
  id: true,
  carrier_id: true,
  active: true,
});
export const updateMarketingSubmissionsContactSchema =
  createMarketingSubmissionsContactSchema.partial();

export type MarketingSubmissionsContactSchema = z.infer<typeof marketingSubmissionsContactSchema>;
export type CreateMarketingSubmissionsContactSchema = z.infer<
  typeof createMarketingSubmissionsContactSchema
>;
export type UpdateMarketingSubmissionsContactSchema = z.infer<
  typeof updateMarketingSubmissionsContactSchema
>;

export const getMarketingSubmissionsContactsDto = z
  .object({
    id: z.uuid().optional(),
    name: z.string().optional(),
    carrier_id: z.uuid().optional(),
    lob: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .partial();

export type GetMarketingSubmissionsContactsDto = z.infer<typeof getMarketingSubmissionsContactsDto>;

export const marketingSubmissionsContactTagsSchema = z.object({
  id: z.uuid(),
  contacts_id: z.uuid(),
  tag: z.string(),
});

export const createMarketingSubmissionsContactTagsSchema =
  marketingSubmissionsContactTagsSchema.omit({ id: true });
export const updateMarketingSubmissionsContactTagsSchema =
  createMarketingSubmissionsContactTagsSchema.partial();

export type MarketingSubmissionsContactTagsSchema = z.infer<
  typeof marketingSubmissionsContactTagsSchema
>;
export type CreateMarketingSubmissionsContactTagsSchema = z.infer<
  typeof createMarketingSubmissionsContactTagsSchema
>;
export type UpdateMarketingSubmissionsContactTagsSchema = z.infer<
  typeof updateMarketingSubmissionsContactTagsSchema
>;

export const marketingSubmissionsContactCcSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

export type MarketingSubmissionsContactCcSchema = z.infer<
  typeof marketingSubmissionsContactCcSchema
>;

export const createMarketingSubmissionsContactCcSchema = marketingSubmissionsContactCcSchema.omit({
  id: true,
});

export type CreateMarketingSubmissionsContactCcSchema = z.infer<
  typeof createMarketingSubmissionsContactCcSchema
>;

export const updateMarketingSubmissionsContactCcSchema =
  createMarketingSubmissionsContactCcSchema.partial();

export type UpdateMarketingSubmissionsContactCcSchema = z.infer<
  typeof updateMarketingSubmissionsContactCcSchema
>;

export type MarketingSubmissionsContactWithCc = MarketingSubmissionsContactSchema & {
  cc_contacts: MarketingSubmissionsContactCcSchema[];
};
