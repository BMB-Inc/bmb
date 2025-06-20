import z from "zod/v4";

export const cpCoveragesBuildingNoSchema = z
  .object({
    CP_COVERAGES_ID: z.number().optional().nullable(),
    BUILDINGNO: z.string().optional().nullable(),
    AGREED: z.string().optional().nullable(),
    AMTVAL: z.number().optional().nullable(),
    BLANKET: z.string().optional().nullable(),
    CAUSE: z.string().optional().nullable(),
    COINSURANCE: z.string().optional().nullable(),
    DEDAMT: z.number().optional().nullable(),
    DEDBASIS: z.string().optional().nullable(),
    DEDDESCRIPTION: z.string().optional().nullable(),
    DEDSYMBOL: z.string().optional().nullable(),
    DEDTYPE: z.string().optional().nullable(),
    INFLATIONGUARD: z.string().optional().nullable(),
    PREMIUM: z.number().optional().nullable(),
    SUBJECTOFINSURANCE: z.string().optional().nullable(),
    SUBJECTOFINSURANCEDESCRIPTION: z.string().optional().nullable(),
    VALUATION: z.string().optional().nullable(),
    Z_ASSOC_ROW: z.number().optional().nullable(),
  })
  .meta({
    description:
      "Commercial Property Coverages Building No from Sagitta table 'CP_COVERAGES_BUILDINGNO'",
    sagittaTable: "CP_COVERAGES_BUILDINGNO",
  });

export type CPBuildingNoSchema = z.infer<typeof cpCoveragesBuildingNoSchema>;
