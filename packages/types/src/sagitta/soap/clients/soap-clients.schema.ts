import z from "zod/v4";

export const soapClientProducerCdSchema = z.object({
  Producer1Cd: z.coerce.string().nullable().optional(),
});

export const soapClientServicerCdSchema = z.object({
  Servicer1Cd: z.coerce.string().nullable().optional(),
  Servicer2Cd: z.coerce.string().nullable().optional(),
  Servicer3Cd: z.coerce.string().nullable().optional(),
});

export const soapClientSchema = z
  .object({
    ClientCd: z.string().nullable().optional().meta({
      description: "Client code from Sagitta SOAP API.",
    }),
    ClientName: z.string().nullable().optional(),
    BillToCode: z.number().nullable().optional(),
    Addr1: z.string().nullable().optional(),
    City: z.string().nullable().optional(),
    StateProvCd: z.string().nullable().optional(),
    Phone1Number: z.number().nullable().optional(),
    ReferenceCd: z.number().nullable().optional(),
    ProducerCd: soapClientProducerCdSchema,
    ServicerCd: soapClientServicerCdSchema,
    PostCd: z.object({
      PostalCode: z.number().nullable().optional(),
    }),
    CreditTerms: z.number().nullable().optional(),
    SourceCd: z.number().nullable().optional(),
    SourceDt: z.number().nullable().optional(),
    CatCd: z.number().nullable().optional(),
    SICCd: z.number().nullable().optional(),
    CollectionComments: z.string().nullable().optional(),
    RemarkText: z.string().nullable().optional(),
    FaxNumber: z.number().nullable().optional(),
    DateBusinessStarted: z.number().nullable().optional(),
    BusinessNature: z.string().nullable().optional(),
    InspectionContact: z.string().nullable().optional(),
    InspectionPhoneNumber: z.number().nullable().optional(),
    AccountingContact: z.string().nullable().optional(),
    AccountingPhoneNumber: z.number().nullable().optional(),
    LegalEntityCd: z.string().nullable().optional(),
    EmailAddr: z.string().nullable().optional(),
    Obsolete53: z.number().nullable().optional(),
    WebSiteLink: z.string().nullable().optional(),
    DivisionNumber: z.number().nullable().optional(),
    Obsolete60: z.number().nullable().optional(),
    ParentRelCd: z.string().nullable().optional(),
    RelationClient: z.string().nullable().optional(),
    FEIN: z.number().nullable().optional(),
    a71: z.number().nullable().optional(),
    a72: z.number().nullable().optional(),
    IntegrationsSyncIndicator: z.string().nullable().optional(),
    ["@_sagitem"]: z.number().nullable().optional(),
  })
  .meta({
    description: "Clients from Sagitta SOAP API.",
  });

export type SoapClientSchema = z.infer<typeof soapClientSchema>;
