import z from "zod/v4";

export const miscCoveragesCoverageSchema = z
  .object({
    OL_COVERAGES_ID: z.number().nullable().optional(),
    COVERAGESEQUENCENUMBER: z.string().nullable().optional(),
    COVERAGE: z.string().nullable().optional(),
    BUILDING: z.string().nullable().optional(),
    CAUSEOFLOSS: z.string().nullable().optional(),
    COINSURANCE: z.string().nullable().optional(),
    COVERAGEDESC: z.string().nullable().optional(),
    COVERAGEEFFDATE: z.date().nullable().optional(),
    COVERAGEEXPDATE: z.date().nullable().optional(),
    COVERAGETYPECODE: z.string().nullable().optional(),
    DED1: z.number().nullable().optional(),
    DED2: z.number().nullable().optional(),
    DEDBASIS1: z.string().nullable().optional(),
    DEDBASIS2: z.string().nullable().optional(),
    DEDSYMBOL1: z.string().nullable().optional(),
    DEDSYMBOL2: z.string().nullable().optional(),
    DEDTYPE1: z.string().nullable().optional(),
    DEDTYPE2: z.string().nullable().optional(),
    EDTDATE: z.date().nullable().optional(),
    EXPOSURE1: z.string().nullable().optional(),
    EXPOSURE1BASIS: z.string().nullable().optional(),
    EXPOSURE2: z.number().nullable().optional(),
    EXPOSURE2BASIS: z.string().nullable().optional(),
    FORM: z.string().nullable().optional(),
    LIMIT1: z.number().nullable().optional(),
    LIMIT1DESCCODE: z.string().nullable().optional(),
    LIMIT2: z.number().nullable().optional(),
    LIMIT2DESCCODE: z.string().nullable().optional(),
    LOCATION: z.number().nullable().optional(),
    NUMBER: z.string().nullable().optional(),
    PREMIUM: z.number().nullable().optional(),
    RATE: z.number().nullable().optional(),
    RATINGBASIS: z.string().nullable().optional(),
    STATE: z.string().nullable().optional(),
    TERR: z.string().nullable().optional(),
    VALUATIONCODE1: z.string().nullable().optional(),
    VALUATIONCODE2: z.string().nullable().optional(),
    VEHBODYTYPE: z.string().nullable().optional(),
    VEHIDNO: z.string().nullable().optional(),
    VEHMAKE: z.string().nullable().optional(),
    VEHMODEL: z.string().nullable().optional(),
    VEHNO: z.number().nullable().optional(),
    VEHYEAR: z.number().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Misc Coverages Coverage from Sagitta table 'OL_COVERAGES_COVERAGE'",
    sagittaTable: "OL_COVERAGES_COVERAGE",
  });

export type MiscCoveragesCoverageSchema = z.infer<
  typeof miscCoveragesCoverageSchema
>;
