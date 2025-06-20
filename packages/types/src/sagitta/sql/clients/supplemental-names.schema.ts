import z from "zod/v4";

export const soapSupplementalNamesSchema = z
  .object({
    SUPPLEMENTAL_NAMES_ID: z.number(),
    DATEOFF: z.date().nullable().optional(),
    FEDEMPIDNO: z.string().nullable().optional(),
    GLCODE: z.string().nullable().optional(),
    LASTEFFDATE: z.date().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    LEGALENTITY: z.number().nullable().optional(),
    LEGALENTITYDESC: z.string().nullable().optional(),
    NAICSCODE: z.string().nullable().optional(),
    NAMENUMBER: z.string().nullable().optional(),
    NAMETYPE: z.string().nullable().optional(),
    NAMETYPEDESC: z.string().nullable().optional(),
    POLICIES_ID: z.number().nullable().optional(),
    SICCODE: z.number().nullable().optional(),
    STATE: z.string().nullable().optional(),
    SUPPMAILADDRESS: z.string().nullable().optional(),
    SUPPNAMECITY: z.string().nullable().optional(),
    SUPPNAMESEQ: z.number().nullable().optional(),
    ZIPCODE: z.string().nullable().optional(),
    ZIPCODEEXT: z.string().nullable().optional(),
  })
  .meta({
    description: "Supplemental names from Sagitta table 'SUPPLEMENTAL_NAMES'",
    sagittaTable: "SUPPLEMENTAL_NAMES",
  });

export type SoapSupplementalNamesSchema = z.infer<
  typeof soapSupplementalNamesSchema
>;
