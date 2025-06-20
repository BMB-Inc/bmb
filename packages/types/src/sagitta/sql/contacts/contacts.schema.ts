import z from "zod/v4";

export const contactsSchema = z
  .object({
    CONTACTS_ID: z.number().nullable().optional(),
    ADDRESS1: z.string().nullable().optional(),
    ADDRESS2: z.string().nullable().optional(),
    CITY: z.string().nullable().optional(),
    CLIENTS_ID: z.number().nullable().optional(),
    FIRSTNAME: z.string().nullable().optional(),
    LASTNAME: z.string().nullable().optional(),
    BUSINESSEMAILADDRESS: z.string().nullable().optional(),
    TELEPHONE: z.string().nullable().optional(),
    TELEPHONEEXT: z.string().nullable().optional(),
    TYPECODE: z.string().nullable().optional(),
  })
  .meta({
    description: "Contacts from Sagitta table 'CONTACTS'",
    sagittaTable: "CONTACTS",
  });

export type ContactsSchema = z.infer<typeof contactsSchema>;
