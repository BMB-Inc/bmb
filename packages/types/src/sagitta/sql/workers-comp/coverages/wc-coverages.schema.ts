import { z } from "zod/v4";

export const wcCoveragesSchema = z
  .object({
    WC_COVERAGES_ID: z.number().optional().nullable(),
    DATEOFF: z.date().optional().nullable(),
    DISEASEPEREMPLLIMIT: z.number().optional().nullable(),
    DISEASEPOLICYLIMIT: z.number().optional().nullable(),
    EMPLLIABACCLIMIT: z.number().optional().nullable(),
    EMPLLIABPREM: z.number().optional().nullable(),
    EXCLSTATES1: z.string().optional().nullable(),
    EXCLSTATES2: z.string().optional().nullable(),
    EXCLSTATES3: z.string().optional().nullable(),
    EXCLSTATES4: z.string().optional().nullable(),
    EXCLSTATES5: z.string().optional().nullable(),
    INCLSSTATES1: z.string().optional().nullable(),
    INCLSSTATES2: z.string().optional().nullable(),
    INCLSSTATES3: z.string().optional().nullable(),
    INCLSSTATES4: z.string().optional().nullable(),
    INCLSSTATES5: z.string().optional().nullable(),
    POLICIES_ID: z.number().optional().nullable(),
    USLH: z.string().optional().nullable(),
    USLHPREM: z.number().optional().nullable(),
    VOLCOMP: z.string().optional().nullable(),
    VOLCOMPPREM: z.number().optional().nullable(),
  })
  .meta({
    description:
      "Workers compensation coverages from Sagitta table 'WC_COVERAGES'",
    sagittaTable: "WC_COVERAGES",
  });

export type WcCoveragesSchema = z.infer<typeof wcCoveragesSchema>;
