import { z } from "zod/v4";

export const lossesSchema = z.object({
  ADJUSTER_CONTACT_INFO_ADDL: z.string().optional().nullable(),
  ADJUSTERASSIGNED: z.string().optional().nullable(),
  C_3RD_SERV_NAME: z.string().optional().nullable(),
  C_CLIENT_CODE: z.string().optional().nullable(),
  C_CLIENT_NAME: z.string().optional().nullable(),
  CAT_CODE_ADDL: z.string().optional().nullable(),
  COV: z.string().optional().nullable(),
  CRITICAL_ADDL: z.string().optional().nullable(),
  DATECLOSED: z.date().optional().nullable(),
  ESTLOSSAMT: z.number().optional().nullable(),
  LASTENTRYDATE: z.date().optional().nullable(),
  LASTUSER: z.string().optional().nullable(),
  LOSSDATE: z.date().optional().nullable(),
  LOSSES_ID: z.number().optional().nullable(),
  LOSSID: z.string().optional().nullable(),
  LOSSSEQ: z.number().optional().nullable(),
  LOSSTIME: z.string().optional().nullable(),
  NAMED_INSURED: z.string().optional().nullable(),
  POLICIES_ID: z.number().optional().nullable(),
  REPORTDATE: z.date().optional().nullable(),
  SERVICER: z.string().optional().nullable(),
  SERVICER_NAME: z.string().optional().nullable(),
  STATUS: z.string().optional().nullable(),
  TYPE: z.string().optional().nullable(),
});

export type LossesSchema = z.infer<typeof lossesSchema>;
