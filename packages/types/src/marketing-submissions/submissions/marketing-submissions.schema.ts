import z from "zod/v4";

export const marketingSubmissionSchema = z.object({
  UID: z.int(),
  DateToMKTG: z.date(),
  ExpDate: z.date(),
  Producer: z.string().meta({ description: "Name of the producer." }),
  Coordinator: z.string().meta({ description: "Name of the coordinator." }),
  AccountName: z.string(),
  NeededBy: z.date(),
  AccountSize: z.int(),
  AccountType: z.string(),
  IsDeleted: z.boolean(),
  Reason: z.string(),
  ReasonDescription: z.string(),
  Location: z.string(),
  DateToSVC: z.date(),
  Task_ID: z.int(),
  PriorPremium: z.int(),
  CreatedOn: z.date(),
  ReleasedOn: z.date(),
  SurplusLines: z.string(),
  SurplusLinesDetails: z.string(),
  ProposalDelivered: z.date(),
  CLIENTID: z.int(),
  CLIENTCODE: z.string(),
  CLIENTNAME: z.string(),
  Servicer: z.string().meta({ description: "Servicer staff codes." }),
  Processor: z.string().meta({ description: "Staff username?" }),
  ServicerName: z.string(),
  ProducerName: z.string().meta({ description: "Producer usernames" }),
  ProducerNames: z
    .string()
    .meta({ description: "Comma delimited list of producer names." }),
  ASR: z.string().meta({ description: "ASR Username." }),
  DIV: z.string(),
  CAT1: z.string(),
  CAT2: z.string(),
  CAT3: z.string(),
  CAT4: z.string(),
  CAT5: z.string(),
  MarketingAssistant: z.string(),
  DateToCarrier: z.date(),
  ProjectName: z.string(),
});

export type MarketingSubmissionSchema = z.infer<
  typeof marketingSubmissionSchema
>;
