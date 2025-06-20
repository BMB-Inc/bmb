import { z } from "zod/v4";

export const wcExposuresSchema = z
  .object({
    WC_UNDERWRITING_CLASS_ID: z.number().optional(),
    WC_UNDERWRITING_ID: z.number().optional(),
    CLASS: z.string().optional(),
    CLASSBASIS: z.string().optional(),
    CLASSDESCRIPTION: z.string().optional(),
    CLASSPREMIUM: z.number().optional(),
    CLASSRATE: z.number().optional(),
    EXPOSUREAMT: z.number().optional(),
    IFANYEXPOSURE: z.string().optional(),
    LOCATION: z.number().optional(),
    NOEMPLOYEES: z.number().optional(),
  })
  .meta({
    description:
      "Workers compensation exposures from Sagitta table 'WC_UNDERWRITING_CLASS'",
    sagittaTable: "WC_UNDERWRITING_CLASS",
  });

export type WCExposuresSchema = z.infer<typeof wcExposuresSchema>;
