import z from "zod/v4";

export const cpBlanketsSchema = z
  .object({
    CP_BLANKETS_ID: z.number().optional(),
    AGREEDAMT: z.string().optional(),
    BLANKET: z.string().optional(),
    BLANKETCODE: z.string().optional(),
    BLANKETDESCRIPTION: z.string().optional(),
    BLANKETRATE: z.number().optional(),
    CAUSE: z.string().optional(),
    COINSURANCEPERCENT: z.number().optional(),
    COVSEQ: z.number().optional(),
    DATEOFF: z.date().optional(),
    DEDAMT: z.string().optional(),
    DEDBASIS: z.string().optional(),
    DEDSYMBOL: z.string().optional(),
    DEDTYPE: z.string().optional(),
    DEDTYPEDESCRIP: z.string().optional(),
    INFLATIONGUARDPERCENT: z.string().optional(),
    LASTEFFDATE: z.date().optional(),
    LASTENTRYDATE: z.date().optional(),
    LASTUSER: z.string().optional(),
    POLICIES_ID: z.number().optional(),
    TOTALBLKLIMIT: z.string().optional(),
    TOTALBLKPREMIUM: z.number().optional(),
    VALUATION: z.string().optional(),
  })
  .meta({
    description:
      "Commercial Property Blankets from Sagitta table 'CP_BLANKETS'",
    sagittaTable: "CP_BLANKETS",
  });

export type CPBlanketsSchema = z.infer<typeof cpBlanketsSchema>;
