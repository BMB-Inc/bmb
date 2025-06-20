import { z } from "zod/v4";

export const umExposuresSchema = z
  .object({
    UM_UNDERWRITING_ID: z.number().optional().nullable(),
    PRIMSUBLOC: z.number().optional().nullable(),
    ANNUALGROSSSALES: z.number().optional().nullable(),
    ANNUALPAYROLL: z.number().optional().nullable(),
    EMPLOYEES: z.string().optional().nullable(),
    FOREIGNGROSSSALES: z.string().optional().nullable(),
    NAMELOCPRIMARYSUBCOS: z.string().optional().nullable(),
    UNDERWRITINGSEQ: z.string().optional().nullable(),
    Z_ASSOC_ROW: z.number().optional().nullable(),
  })
  .meta({
    description:
      "Umbrella exposures from Sagitta table 'UM_UNDERWRITING_PRIMSUBLOC'",
    sagittaTable: "UM_UNDERWRITING_PRIMSUBLOC",
  });

export type UmExposuresSchema = z.infer<typeof umExposuresSchema>;
