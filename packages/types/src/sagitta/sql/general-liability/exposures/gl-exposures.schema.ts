import { z } from "zod/v4";

export const glExposuresSchema = z
  .object({
    GL_UNDERWRITING_ID: z.number().nullable().optional(),
    HAZARD: z.string().nullable().optional(),
    BASIS: z.string().nullable().optional(),
    BASISDESCRIPTION: z.string().nullable().optional(),
    CLASS: z.string().nullable().optional(),
    EXPOSURE: z.string().nullable().optional(),
    GLCLASSDESCRIPTION: z.string().nullable().optional(),
    HAZARDLOCATIONNO: z.number().nullable().optional(),
    STATE: z.string().nullable().optional(),
    ADDITONALOTHERINTERESTSEQ: z.number().nullable().optional(),
    HAZARDLOCATIONSEQ: z.number().nullable().optional(),
    JOB: z.string().nullable().optional(),
    JOBDESCRIPTION: z.number().nullable().optional(),
    PRODSRATE: z.number().nullable().optional(),
    PROPSRATE: z.number().nullable().optional(),
    SUBLINE: z.string().nullable().optional(),
    TERR: z.string().nullable().optional(),
    URISEQ: z.string().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
    LOCATIONADDRESS: z.string().nullable().optional(),
  })
  .meta({
    description:
      "General liability exposures from Sagitta table 'GL_UNDERWRITING_HAZARD'",
    sagittaTable: "GL_UNDERWRITING_HAZARD",
  });

export type GLExposuresSchema = z.infer<typeof glExposuresSchema>;
