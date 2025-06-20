import { z } from "zod/v4";

export const ownersOfficersSchema = z
  .object({
    WC_UNDERWRITING_ID: z.number().nullable().optional(),
    INDNAME: z
      .string()
      .min(1, { message: "Individual name is required." })
      .nullable()
      .optional(),
    IESTATE: z.string().nullable().optional(),
    INDIVIDUALINCLEXCLUSION: z
      .string()
      .min(1, { message: "Individual inclusion/exclusion is required." })
      .nullable()
      .optional(),
    INDIVIDUALOWN: z.coerce
      .number()
      .min(1, { message: "Individual ownership % is required." })
      .transform((value) => String(value))
      .nullable()
      .optional(),
    INDIVIDUALTITLERELATION: z
      .string()
      .min(1, { message: "Individual title relation is required." })
      .nullable()
      .optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Workers compensation owners/officers from Sagitta table 'WC_UNDERWRITING_INDNAME'",
    sagittaTable: "WC_UNDERWRITING_INDNAME",
  });

export type OwnersOfficersSchema = z.infer<typeof ownersOfficersSchema>;
