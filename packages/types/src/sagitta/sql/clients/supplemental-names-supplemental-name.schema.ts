import z from "zod/v4";

export const supplementalNamesSupplementalNameSchema = z
  .object({
    SUPPLEMENTAL_NAMES_ID: z.number().int(),
    SUPPLEMENTALNAME: z.string(),
    SUPPNAMESEQ: z.number().int(),
    Z_ASSOC_ROW: z.number().int(),
  })
  .meta({
    description:
      "Supplemental names supplemental name from Sagitta table 'SUPPLEMENTAL_NAMES_SUPPLEMENTALNAME'",
    sagittaTable: "SUPPLEMENTAL_NAMES_SUPPLEMENTALNAME",
  });

export type SupplementalNamesSupplementalNameSchema = z.infer<
  typeof supplementalNamesSupplementalNameSchema
>;
