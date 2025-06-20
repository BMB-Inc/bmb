import z from "zod/v4";

export const insurorsSchema = z
  .object({
    INSURORS_ID: z.number().nullable().optional(),
    INSURERNAME: z.string().nullable().optional(),
    INSURORS_CODE: z.string().nullable().optional(),
    ADDRESSLINE1: z.string().nullable().optional(),
    ADDRESSLINE2: z.string().nullable().optional(),
    CITY: z.string().nullable().optional(),
    STATE: z.string().nullable().optional(),
    ZIPCODE: z.string().nullable().optional(),
    AGENCYCODE: z.string().nullable().optional(),
    AMBCOMPANYNAME: z.string().nullable().optional(),
    AMBESTNUMBER: z.number().nullable().optional(),
    AMBLASTUPDATE: z.date().nullable().optional(),
    AMBPARENTNUMBER: z.number().nullable().optional(),
    BESTSFINANCIALSIZE: z.string().nullable().optional(),
    BESTSFINANCIALSTRENGTH: z.string().nullable().optional(),
    CLAIM_RPT_EXT: z.string().nullable().optional(),
    CLAIM_RPT_NUMBER: z.string().nullable().optional(),
    COMPANYCODE: z.string().nullable().optional(),
    COMMISSIONYTD: z.number().nullable().optional(),
    DATEOFF: z.date().nullable().optional(),
    DATEOFFREMARKS: z.string().nullable().optional(),
    ESTIMATEDPREMIUMYTD: z.number().nullable().optional(),
    FAXNUMBER: z.string().nullable().optional(),
    FEIN: z.string().nullable().optional(),
    FINANCIALSTRENGTHACTION: z.string().nullable().optional(),
    FINANCIALSTRENGTHOUTLOOK: z.string().nullable().optional(),
    GLOBAL: z.string().nullable().optional(),
    GROUP: z.string().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    NAIC: z.string().nullable().optional(),
    NY_COMPANY_CODE: z.string().nullable().optional(),
    PAY: z.string().nullable().optional(),
    PREMIUMYTD: z.number().nullable().optional(),
    TELEPHONE1: z.string().nullable().optional(),
    TELEPHONE1EXTENSION: z.string().nullable().optional(),
    TELEPHONE2: z.string().nullable().optional(),
    TELEPHONE2EXTENSION: z.string().nullable().optional(),
  })
  .meta({
    description: "Insurors from Sagitta table 'INSURORS'",
    sagittaTable: "INSURORS",
  });

export type InsurorsSchema = z.infer<typeof insurorsSchema>;
