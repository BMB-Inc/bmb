import z from "zod";

export const soapStaffSchema = z.object({
  StaffName: z.string().nullable().optional(),
  WorkPhoneNumber: z.number().nullable().optional(),
  EmailAddr: z.string().nullable().optional(),
  Title: z.string().nullable().optional(),
});

export type SoapStaffSchema = z.infer<typeof soapStaffSchema>;
