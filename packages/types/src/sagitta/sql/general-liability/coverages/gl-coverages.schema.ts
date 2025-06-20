import { z } from "zod/v4";

export const glCoveragesSchema = z
  .object({
    GL_COVERAGES_ID: z.number().optional().nullable(),
    CGL: z.string().optional().nullable(),
    CLAIMSMADE: z.string().optional().nullable(),
    DATEOFF: z.date().optional().nullable(),
    DED: z.number().optional().nullable(),
    DEDBASIS: z.string().optional().nullable(),
    EACHOCCURRENCE: z.number().optional().nullable(),
    FIRELEGAL: z.number().optional().nullable(),
    GENAGGREGATE: z.number().optional().nullable(),
    MEDICALEXP: z.number().optional().nullable(),
    OCCURRENCE: z.string().optional().nullable(),
    OTHERCOVERAGEPREMIUM: z.string().optional().nullable(),
    PERCLAIM: z.string().optional().nullable(),
    PEROCCURRENCE: z.string().optional().nullable(),
    PERSADVERTISINGINJURY: z.number().optional().nullable(),
    POLICIES_ID: z.number().optional().nullable(),
    PREMISESOPERATIONSPREM: z.number().optional().nullable(),
    PRODUCTSCOMPLETEDOPERATIONS: z.number().optional().nullable(),
    PRODUCTSPREM: z.number().optional().nullable(),
    TOTALPREMIUM: z.number().optional().nullable(),
  })
  .meta({
    description:
      "General liability coverages from Sagitta table 'GL_COVERAGES'",
    sagittaTable: "GL_COVERAGES",
  });

export type GlCoveragesSchema = z.infer<typeof glCoveragesSchema>;
